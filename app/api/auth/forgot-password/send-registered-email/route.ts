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
        message: "Email Id not found",
      }, { status: 400 });
    }

    // 🔒 Check Redis cooldown
    const cooldownKey = `reset-password-cooldown:${email}`;
    const cooldownExists = await redis.exists(cooldownKey);
    if (cooldownExists) {
      const ttl = await redis.ttl(cooldownKey);
      return NextResponse.json({
        message: `Please wait ${ttl}s before requesting another password reset.`,
      }, { status: 429 });
    }

    // ✅ Find user
    const foundUser = await userModel.findOne({ email: email });
    if (!foundUser) {
      return NextResponse.json(
        { message: "User not found with this email" },
        { status: 404 }
      );
    }

    // 🔑 Generate token and store in Redis
    const token = crypto.randomUUID();
    const redisKey = `reset-password:${token}`;
    await redis.set(redisKey, JSON.stringify({ userEmail: foundUser.email }), {
      ex: 60 * 15, // 15 minutes
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_LIVE_URL}/auth/forgot-password/reset-password?token=${token}`;

    // ⏳ Set cooldown (90 seconds)
    await redis.set(cooldownKey, "1", { ex: 90 });

    // 📧 Send email
    const { error } = await resend.emails.send({
      from: 'PostMyGig <hello@postmygig.xyz>',
      to: email,
      subject: "Reset Password",
      html: postMyGigResetPasswordTemplate(email, resetUrl),
    });

    if (error) {
      await EmailSender({
        to: email,
        subject: "Reset Password",
        html: postMyGigResetPasswordTemplate(email, resetUrl),
      });
    }

    return NextResponse.json({
      message: "Password reset link sent to your email.",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
