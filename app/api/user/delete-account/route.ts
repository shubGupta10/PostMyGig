import { NextResponse, NextRequest, after } from "next/server";
import userModel from "@/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import resend from "@/lib/resend";
import { postMyGigAccountDeletedTemplate } from "@/lib/email/templates";
import { EmailSender } from "@/lib/email/send";
import ProjectModel from "@/models/ProjectModel";
import PingModel from "@/models/PingSchema";
import Chat from "@/models/ChatModel";
import { UTApi } from "uploadthing/server";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest) {
    let dbSession;
    try {
        await ConnectoDatabase();
        const { userEmail } = await req.json();
        if (!userEmail) {
            return NextResponse.json({
                message: "User Email not found"
            }, { status: 400 })
        }

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                message: "Session Not found"
            }, { status: 404 })
        }

        //check user authenticity
        if (session.user.email != userEmail) {
            return NextResponse.json({
                message: "User is not authorized"
            }, { status: 403 })
        }

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        //delete user gigs
        await ProjectModel.deleteMany({
            createdBy: userEmail
        }).session(dbSession);

        //delete user pings
        await PingModel.deleteMany({
            userEmail: userEmail
        }).session(dbSession);

        try {
            const userChatsWithFiles = await Chat.find({
                senderEmail: userEmail,
                "attachment.fileKey": { $exists: true, $ne: "" },
            }, "attachment.fileKey").lean();

            const fileKeys = userChatsWithFiles
                .map((c: any) => c.attachment?.fileKey)
                .filter((k: string | undefined): k is string => Boolean(k));

            if (fileKeys.length > 0) {
                const utApi = new UTApi();
                await utApi.deleteFiles(fileKeys);
            }
        } catch (fileErr) {
            console.error("Failed to delete user's uploadthing files:", fileErr);
        }

        //delete the chat messages
        await Chat.deleteMany({
            $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }]
        }).session(dbSession);

        //delete the user
        await userModel.deleteOne({
            email: userEmail
        }).session(dbSession);

        await dbSession.commitTransaction();
        await dbSession.endSession();

        //send mail for deletion
        after(async () => {
            const userName = session.user.name || "User";
            const { error } = await resend.emails.send({
                from: 'PostMyGig <hello@postmygig.vercel.app>',
                to: userEmail,
                subject: "Confirmation: Your Account Has Been Permanently Deleted",
                html: postMyGigAccountDeletedTemplate(userName)
            })

            if (error) {
                console.error('Resend email error:', error);
                await EmailSender({
                    to: userEmail,
                    subject: "Confirmation: Your Account Has Been Permanently Deleted",
                    html: postMyGigAccountDeletedTemplate(userName)
                });
            }
        });

        return NextResponse.json({
            message: "User Account Deleted"
        }, { status: 200 })
    } catch (error) {
        if (dbSession) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
        }
        return NextResponse.json({
            message: "Failed to delete user Account"
        }, { status: 500 })
    }
}