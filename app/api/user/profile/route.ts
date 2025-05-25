import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import ratelimiter from "@/lib/ratelimit";
import redis from "@/lib/redis";

export async function GET(req: NextRequest) {
    
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success, limit, reset, remaining } = await ratelimiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s.`,
      },
      { status: 429 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;
    const cacheKey = `fetch-user-profile:${user.email}`;
    const cachedUser = await redis.get(cacheKey);

    if (typeof cachedUser === "string") {
      return new NextResponse(
        JSON.stringify({
          message: "User profile (from cache)",
          user: JSON.parse(cachedUser),
        }),
        {
          status: 200,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    const foundUser = await userModel.findOne({ email: user.email }).select("-password -__v");
    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cache the user profile for 1 hour
    await redis.set(cacheKey, JSON.stringify(foundUser), { ex: 3600 });

    return new NextResponse(
      JSON.stringify({
        message: "User profile fetched successfully",
        user: foundUser,
      }),
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
