import { ConnectoDatabase } from "@/lib/db";
import Chat from "@/models/ChatModel";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server"

const utApi = new UTApi();

const RETENTION_DAYS = 30;

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        await ConnectoDatabase();

        const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

        const expiredChats = await Chat.find({
            timeStamp: { $lt: cutoffDate },
            "attachment.fileKey": { $exists: true, $ne: "" },
        }, "_id attachment.fileKey").limit(200).lean();

        if (!expiredChats || expiredChats.length === 0) {
            return NextResponse.json({
                message: "No expired chat attachments found to delete.",
                deletedCount: 0,
            });
        }

        const fileKeysToDelete = expiredChats
            .map((chat: any) => chat.attachment?.fileKey)
            .filter((key: string | undefined): key is string => Boolean(key));


        let utDeletedCount = 0;
        if (fileKeysToDelete.length > 0) {
            const utResponse = await utApi.deleteFiles(fileKeysToDelete);
            utDeletedCount = fileKeysToDelete.length;
            console.log(`[UploadThing Cleanup] Deleted ${utDeletedCount} files:`, utResponse);
        }

        const chatIds = expiredChats.map((c: any) => c._id);
        await Chat.updateMany(
            { _id: { $in: chatIds } },
            {
                $set: {
                    "attachment.fileKey": "",
                    "attachment.isExpired": true,
                },
            }
        );
        return NextResponse.json({
            success: true,
            message: `Successfully cleaned up ${utDeletedCount} expired chat attachments older than ${RETENTION_DAYS} days.`,
            deletedCount: utDeletedCount,
        });
    } catch (error: any) {
        console.error("[UploadThing Cleanup Error]:", error);
        return NextResponse.json(
            { message: "Internal server error during attachment cleanup", error: error.message },
            { status: 500 }
        );
    }
}
