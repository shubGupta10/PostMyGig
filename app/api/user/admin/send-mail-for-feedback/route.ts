import { EmailSender } from "@/lib/email/send";
import { postMyGigGenericTemplate } from "@/lib/email/templates";
import resend from "@/lib/resend";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { htmlContent, to, subject, userName } = await req.json();

        if (!htmlContent || !to || !subject || !userName) {
            return NextResponse.json({
                message: "Missing required fields: htmlContent, to, subject, or userName"
            }, { status: 400 });
        }

        const { error } = await resend.emails.send({
            from: 'PostMyGig <hello@postmygig.xyz>',
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
