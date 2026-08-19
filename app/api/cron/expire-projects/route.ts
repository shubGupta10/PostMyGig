import { ConnectoDatabase } from "@/lib/db";
import { EmailSender } from "@/lib/email/send";
import { postMyGigExpiredTemplate } from "@/lib/email/templates";
import { dispatchNotification } from "@/lib/notification/dispatcher";
import redis from "@/lib/redis";
import resend from "@/lib/resend";
import ProjectModel from "@/models/ProjectModel";
import PingModel from "@/models/PingSchema";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    let dbSession;
    try {
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 });
        }

        await ConnectoDatabase();

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        const now = new Date();
        const nowIso = now.toISOString();

        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const curatedGigs = await ProjectModel.find({ isCurated: true }, "_id").lean().session(dbSession);

        if (curatedGigs.length > 0) {
            const curatedIds = curatedGigs.map((g) => g._id.toString());
            await PingModel.updateMany(
                {
                    projectId: { $in: curatedIds },
                    status: "pending",
                    createdAt: { $lt: sevenDaysAgo },
                },
                { $set: { status: "rejected" } },
                { session: dbSession }
            );
        }

        const allActiveProjects = await ProjectModel.find(
            {},
            "title status expiresAt createdAt createdBy isCurated"
        ).lean().session(dbSession);

        const expiredProjects = await ProjectModel.find({
            status: "active",
            $or: [
                { expiresAt: { $lt: now } },
                { expiresAt: { $type: "string", $lt: nowIso } },
            ]
        }).lean().session(dbSession);

        if (!expiredProjects.length) {
            await dbSession.commitTransaction();
            await dbSession.endSession();
            return NextResponse.json({
                message: "No Projects to expire",
                count: 0,
                serverTime: nowIso,
                totalProjectsInDb: allActiveProjects.length,
                dbProjectsSummary: allActiveProjects.map((p: any) => ({
                    id: p._id,
                    title: p.title,
                    status: p.status,
                    createdAt: p.createdAt,
                    expiresAt: p.expiresAt,
                    isPast: p.expiresAt ? new Date(p.expiresAt) < now : null,
                })),
            }, { status: 200 });
        }

        const expireIds = expiredProjects.map((p) => p._id);

        await ProjectModel.updateMany(
            { _id: { $in: expireIds } },
            { $set: { status: "expired" } },
            { session: dbSession }
        );

        await PingModel.updateMany(
            { projectId: { $in: expireIds.map((id) => id.toString()) }, status: "pending" },
            { $set: { status: "rejected" } },
            { session: dbSession }
        );

        await dbSession.commitTransaction();
        await dbSession.endSession();

        for (const project of expiredProjects) {
            try {
                await dispatchNotification({
                    recipientEmail: project.createdBy,
                    type: "system_alert",
                    title: "Gig Expired",
                    message: `Your gig "${project.title}" has expired. You can view applications or relist it anytime.`,
                    link: "/my-jobs"
                });

                const emailHtml = postMyGigExpiredTemplate({
                    creatorEmail: project.createdBy,
                    gigTitle: project.title,
                    gigId: project._id.toString(),
                });

                if (process.env.NODE_ENV === "production") {
                    const { error } = await resend.emails.send({
                        from: "PostMyGig <hello@postmygig.vercel.app>",
                        to: project.createdBy,
                        subject: `Your Gig "${project.title}" has expired`,
                        html: emailHtml,
                    });
                    if (error) {
                        console.warn("[Resend Failed] Fallback to Nodemailer:", error);
                        await EmailSender({
                            to: project.createdBy,
                            subject: `Your Gig "${project.title}" has expired`,
                            html: emailHtml,
                        });
                    }
                } else {
                    await EmailSender({
                        to: project.createdBy,
                        subject: `Your Gig "${project.title}" has expired`,
                        html: emailHtml,
                    });
                }
            } catch (notifyError) {
                console.error(`Failed to notify creator of project ${project._id}:`, notifyError);
            }
        }

        try {
            const publicKeys = await redis.keys("fetch-gigs:*");
            if (publicKeys.length > 0) {
                await redis.del(...publicKeys);
            }

            for (const project of expiredProjects) {
                const userKeys = await redis.keys(`user-projects:${project.createdBy}:*`);
                if (userKeys.length > 0) {
                    await redis.del(...userKeys);
                }
            }
        } catch (cacheError) {
            console.warn("Failed to invalidate Redis cache:", cacheError);
        }

        return NextResponse.json({
            message: "Projects expired and creators notified successfully",
            expiredCount: expiredProjects.length
        }, { status: 200 });

    } catch (error: any) {
        if (dbSession) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
        }
        console.error("Cron expire-projects error:", error);
        return NextResponse.json({
            message: "Cron execution failed",
            error: error.message
        }, { status: 500 });
    }
}