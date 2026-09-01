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

        let emailsSent = 0;

        for (const project of eligibleProjects) {
            // Count how many pending pings this project has
            const pendingPingCount = await PingModel.countDocuments({
                projectId: project._id.toString(),
                status: "pending"
            });

            // Threshold: If they have 3 or more pending applications
            if (pendingPingCount >= 3) {
                const client = await userModel.findOne({ email: project.createdBy }).lean();
                if (!client) continue;

                const emailHtml = postMyGigUnresponsiveClientTemplate(
                    client.name,
                    project.title,
                    pendingPingCount,
                    project._id.toString()
                );

                try {
                    if (process.env.NODE_ENV === "production") {
                        const { error } = await resend.emails.send({
                            from: "PostMyGig <hello@postmygig.vercel.app>",
                            to: project.createdBy,
                            subject: `You have ${pendingPingCount} freelancers waiting for your response!`,
                            html: emailHtml,
                        });
                        if (error) {
                            await EmailSender({
                                to: project.createdBy,
                                subject: `You have ${pendingPingCount} freelancers waiting for your response!`,
                                html: emailHtml,
                            });
                        }
                    } else {
                        await EmailSender({
                            to: project.createdBy,
                            subject: `You have ${pendingPingCount} freelancers waiting for your response!`,
                            html: emailHtml,
                        });
                    }

                    await dispatchNotification({
                        recipientEmail: project.createdBy,
                        type: "system_alert",
                        title: "Unreviewed Applications",
                        message: `Your gig "${project.title}" has ${pendingPingCount} pending applications waiting for your response.`,
                        link: `/applications/view-applications?gigId=${project._id}`
                    });

                    // Update the project so we don't spam them tomorrow
                    await ProjectModel.findByIdAndUpdate(project._id, {
                        $set: { lastRemindedAt: new Date() }
                    });

                    emailsSent++;
                } catch (emailError) {
                    console.error(`Failed to send reminder for project ${project._id}:`, emailError);
                }
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
