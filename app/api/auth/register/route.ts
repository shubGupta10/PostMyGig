import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import userModel from "@/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";
import ratelimiter from "@/lib/ratelimit";
import { postMyGigVerificationTemplate } from "@/lib/email/templates";
import { EmailSender } from "@/lib/email/send";
import redis from "@/lib/redis";
import { v4 as uuidv4 } from "uuid"; 

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success, reset } = await ratelimiter.limit(ip);

  if (!success) {
    return NextResponse.json({
      message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s.`,
    }, { status: 429 });
  }

  try {
    await ConnectoDatabase();

    const { name, email, role, password } = await req.json();

    if (!name || !email || !role || !password) {
      return NextResponse.json({ message: "Please fill all the details" }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      role,
      password: hashedPassword,
      provider: "credentials",
    };

    const userId = uuidv4();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Upstash Redis syntax: value + options object with `ex`
    await redis.set(`verify:${userId}`, JSON.stringify({ code: verificationCode, user }), {
      ex: 600, // 10 minutes
    });

    await EmailSender({
      to: email,
      subject: "Verify your PostMyGig account",
      html: postMyGigVerificationTemplate(name, verificationCode),
    });

    return NextResponse.json({
      message: "Verification code sent to your email",
      userId,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
