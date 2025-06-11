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

    const cooldownKey = `reset-password-cooldown:${email}`;
    const requestCountKey = `reset-password-count:${email}`;

    const cooldownExists = await redis.exists(cooldownKey);
    if (cooldownExists) {
      const ttl = await redis.ttl(cooldownKey);
      const minutes = Math.floor(ttl / 60);
      const seconds = ttl % 60;
      return NextResponse.json({
        message: `Please wait ${minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`} before requesting another password reset.`,
        cooldownActive: true,
        remainingTime: ttl
      }, { status: 429 });
    }

    const foundUser = await userModel.findOne({ email: email });
    if (!foundUser) {
      return NextResponse.json(
        { message: "User not found with this email" },
        { status: 404 }
      );
    }

    let requestCount = await redis.get(requestCountKey) as string | null;
    const currentCount = requestCount ? parseInt(requestCount) : 0;
    const newCount = currentCount + 1;

    await redis.set(requestCountKey, newCount.toString(), { ex: 60 * 10 });

    if (newCount >= 3) {
      await redis.set(cooldownKey, "1", { ex: 60 * 10 });
    }

    const token = crypto.randomUUID();
    const redisKey = `reset-password:${token}`;
    await redis.set(redisKey, JSON.stringify({ userEmail: foundUser.email }), {
      ex: 60 * 15,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_LIVE_URL}/auth/forgot-password/reset-password?token=${token}`;

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

    const response: any = {
      message: "Password reset link sent to your email.",
    };

    if (newCount >= 3) {
      response.cooldownActive = true;
      response.remainingTime = 60 * 10;
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}