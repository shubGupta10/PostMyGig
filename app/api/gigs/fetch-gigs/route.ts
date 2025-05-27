import { NextRequest, NextResponse } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import ProjectModel from "@/models/ProjectModel";
import redis from "@/lib/redis";
import ratelimiter from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success, limit, reset, remaining } = await ratelimiter.limit(ip);

  if (!success) {
    return NextResponse.json({
      message: `Rate limit exceeded. Try again in ${Math.ceil(
        (reset - Date.now()) / 1000
      )}s.`,
    }, { status: 429 })
  }

  try {
    await ConnectoDatabase();

    const cacheKey = "fetch-gigs:all";
    const cachedGigs = await redis.get(cacheKey);

    // If gigs are cached, return them
    if (typeof cachedGigs === "string") {
      return NextResponse.json({ gigs: JSON.parse(cachedGigs) }, { status: 200 });
    }

    // If not cached, fetch from database
    const currentDate = new Date();
    const gigs = await ProjectModel.find({
      expiresAt: {$gt: currentDate}, //not expired
      status: {$nin: ["accepted", "completed"]},
    }).sort({ createdAt: -1 }).lean();

    // Cache the result for future requests (e.g., 1 hour = 3600 seconds)
    await redis.set(cacheKey, JSON.stringify(gigs), { ex: 3600 });

    return new NextResponse(JSON.stringify({ gigs }), {
      status: 200,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });

  } catch (error) {
    console.error("Error fetching gigs:", error);
    return NextResponse.json(
      { message: "Failed to fetch gigs" },
      { status: 500 }
    );
  }
}
