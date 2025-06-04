import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import redis from "@/lib/redis";
import { postMyGigResetPasswordTemplate } from "@/lib/email/templates";
import { ConnectoDatabase } from "@/lib/db";
import { EmailSender } from "@/lib/email/send";
import resend from "@/lib/resend";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({
                message: "Email Id not found"
            }, { status: 400 })
        }


        //fetch the user
        const foundUser = await userModel.findOne({ email: email });
        if (!foundUser) {
            return NextResponse.json(
                { message: "User not found with this email" },
                { status: 404 }
            );
        }


        //generate an uuid
        const token = crypto.randomUUID();
        const rediskey = `reset-password:${token}`

        //store in redis
        await redis.set(rediskey, JSON.stringify({ userEmail: foundUser.email }),
            { ex: 60 * 15 })

        const resetUrl = `${process.env.NEXT_PUBLIC_LIVE_URL}/auth/forgot-password/reset-password?token=${token}`;


        //send email
        const { error } = await resend.emails.send({
            from: 'PostMyGig <hello@postmygig.xyz>',
            to: email,
            subject: "Reset Password",
            html: postMyGigResetPasswordTemplate(email, resetUrl)
        })

        if (error) {
            await EmailSender({
                to: email,
                subject: "Reset Password",
                html: postMyGigResetPasswordTemplate(email, resetUrl)
            })
        }

        return NextResponse.json({
            message: "Password reset link sent to your email.",
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}