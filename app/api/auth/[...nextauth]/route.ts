import NextAuth from "next-auth";
import { authOptions } from "@/lib/options";
import ratelimiter from "@/lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";

async function rateLimitedHandler(req: NextRequest, ...args: any) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success, reset } = await ratelimiter.limit(ip);

  if (!success) {
    return NextResponse.json({
      message: `Rate limit exceeded. Try again in ${Math.ceil(
        (reset - Date.now()) / 1000
      )}s.`,
    }, { status: 429 });
  }

  return await NextAuth(authOptions)(req, ...args);
}

export { rateLimitedHandler as GET, rateLimitedHandler as POST };
