import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import resend from "@/lib/resend";
import { postMyGigAccountDeletedTemplate } from "@/lib/email/templates";
import { EmailSender } from "@/lib/email/send";
import ProjectModel from "@/models/ProjectModel";
import PingModel from "@/models/PingSchema";


export async function DELETE(req: NextRequest) {
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

        //delete user gigs
        await ProjectModel.deleteMany({
            createdBy: userEmail
        });

        //delete user pings
        await PingModel.deleteMany({
            userEmail: userEmail
        })

        //delete the user
        await userModel.deleteOne({
            email: userEmail
        })

        //send mail for deletion
        const { error } = await resend.emails.send({
            from: 'PostMyGig <hello@postmygig.xyz>',
            to: userEmail,
            subject: "Confirmation: Your Account Has Been Permanently Deleted",
            html: postMyGigAccountDeletedTemplate(session.user.name)
        })

        if (error) {
            console.error('Resend email error:', error);
            await EmailSender({
                to: userEmail,
                subject: "Confirmation: Your Account Has Been Permanently Deleted",
                html: postMyGigAccountDeletedTemplate(session.user.name)
            });
        }

        return NextResponse.json({
            message: "User Account Deleted"
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: "Failed to delete user Account"
        }, { status: 500 })
    }
}