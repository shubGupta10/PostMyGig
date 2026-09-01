import { ConnectoDatabase } from "@/lib/db";
import { EmailSender } from "@/lib/email/send";
import { postMyGigUnresponsiveClientTemplate } from "@/lib/email/templates";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import PingModel from "@/modules/notifications/models/PingSchema";
import userModel from "@/modules/users/models/UserModel";
import resend from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";
import { dispatchNotification } from "@/modules/notifications/services/dispatcher";

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await ConnectoDatabase();

        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        const fortyEightHoursAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

        // Find active projects created > 48h ago, not reminded in the last 3 days
        const eligibleProjects = await ProjectModel.find({
            status: "active",
            createdAt: { $lt: fortyEightHoursAgo },
            $or: [
                { lastRemindedAt: { $exists: false } },
                { lastRemindedAt: null },
                { lastRemindedAt: { $lt: threeDaysAgo } }
            ]
        }).lean();

        if (eligibleProjects.length === 0) {
            return NextResponse.json({ message: "No projects need reminding today" }, { status: 200 });
        }

        // 1. Filter projects that actually have 3+ pending applications
        const projectsNeedingAttention = [];
        for (const project of eligibleProjects) {
            const pendingPingCount = await PingModel.countDocuments({
                projectId: project._id.toString(),
                status: "pending"
            });
            
            if (pendingPingCount >= 3) {
                projectsNeedingAttention.push({
                    id: project._id,
                    title: project.title,
                    createdBy: project.createdBy,
                    pendingPingCount
                });
            }
        }

        if (projectsNeedingAttention.length === 0) {
            return NextResponse.json({ message: "No projects met the ping threshold" }, { status: 200 });
        }

        // 2. Group by Client Email
        const clientMap = new Map();
        for (const project of projectsNeedingAttention) {
            if (!clientMap.has(project.createdBy)) {
                clientMap.set(project.createdBy, []);
            }
            clientMap.get(project.createdBy).push(project);
        }

        let emailsSent = 0;

        // 3. Process each Client (Send exactly 1 email/notification per client)
        for (const [clientEmail, clientProjects] of clientMap.entries()) {
            const client = await userModel.findOne({ email: clientEmail }).lean();
            if (!client) continue;

            const totalPings = clientProjects.reduce((sum: number, p: any) => sum + p.pendingPingCount, 0);
            const gigCount = clientProjects.length;
            const singleGigId = gigCount === 1 ? clientProjects[0].id.toString() : null;

            const emailHtml = postMyGigUnresponsiveClientTemplate(
                client.name,
                gigCount,
                totalPings,
                singleGigId
            );

            try {
                // Send Email
                if (process.env.NODE_ENV === "production") {
                    const { error } = await resend.emails.send({
                        from: "PostMyGig <hello@postmygig.vercel.app>",
                        to: clientEmail,
                        subject: `You have ${totalPings} freelancers waiting for your response!`,
                        html: emailHtml,
                    });
                    if (error) {
                        await EmailSender({
                            to: clientEmail,
                            subject: `You have ${totalPings} freelancers waiting for your response!`,
                            html: emailHtml,
                        });
                    }
                } else {
                    await EmailSender({
                        to: clientEmail,
                        subject: `You have ${totalPings} freelancers waiting for your response!`,
                        html: emailHtml,
                    });
                }

                // Send ONE combined In-App Notification
                const notifMessage = gigCount > 1 
                    ? `You have ${totalPings} pending applications waiting across ${gigCount} of your gigs.`
                    : `You have ${totalPings} pending applications waiting for your response.`;
                const notifLink = gigCount > 1 ? `/my-jobs` : `/applications/view-applications?gigId=${singleGigId}`;

                await dispatchNotification({
                    recipientEmail: clientEmail,
                    type: "system_alert",
                    title: "Unreviewed Applications",
                    message: notifMessage,
                    link: notifLink
                });

                // 4. Update lastRemindedAt for ALL of this client's processed gigs at once
                const projectIdsToUpdate = clientProjects.map((p: any) => p.id);
                await ProjectModel.updateMany(
                    { _id: { $in: projectIdsToUpdate } },
                    { $set: { lastRemindedAt: new Date() } }
                );

                emailsSent++;
            } catch (emailError) {
                console.error(`Failed to send reminder to ${clientEmail}:`, emailError);
            }
        }

        return NextResponse.json({
            message: "Reminder cron finished successfully",
            emailsSent,
        }, { status: 200 });

    } catch (error) {
        console.error("Cron Error (Remind Clients):", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
