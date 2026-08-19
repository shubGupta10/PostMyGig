import { EmailSender } from "@/lib/email/send";
import { postMyGigGenericTemplate } from "@/lib/email/templates";
import { authOptions } from "@/lib/options";
import resend from "@/lib/resend";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 404 })
        }

        //check if this user is admin
        if (session.user.isAdmin !== true) {
            return NextResponse.json({
                message: "Not a admin account"
            }, { status: 404 })
        }
        const { htmlContent, to, subject, userName } = await req.json();

        if (!htmlContent || !to || !subject || !userName) {
            return NextResponse.json({
                message: "Missing required fields: htmlContent, to, subject, or userName"
            }, { status: 400 });
        }

        const { error } = await resend.emails.send({
            from: 'PostMyGig <hello@postmygig.vercel.app>',
            to,
            subject,
            html: postMyGigGenericTemplate(userName, htmlContent)
        });

        if (error) {
            console.error('Resend email error:', error);
            await EmailSender({
                to,
                subject,
                html: postMyGigGenericTemplate(userName, htmlContent)
            });
        }

        return NextResponse.json({
            message: "Email sent successfully"
        }, { status: 200 });
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json({
            message: "Failed to send email"
        }, { status: 500 });
    }
}
