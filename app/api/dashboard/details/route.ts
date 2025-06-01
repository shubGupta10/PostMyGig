import { NextRequest, NextResponse } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import ProjectModel from "@/models/ProjectModel";
import PingModel from "@/models/PingSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import ratelimiter from "@/lib/ratelimit";
import redis from "@/lib/redis"; 

export async function POST(req: NextRequest) {
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
    await ConnectoDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user.id || !session?.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const cacheKey = `dashboard-data:${userEmail}`;
    
    // Try to get cached data
    const cachedData = await redis.get(cacheKey);

    // Check if cached data exists and is valid
    if (cachedData) {
      let parsedData;
      try {
        // Handle both string and object responses from Redis
        parsedData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
        
        return NextResponse.json(parsedData, {
          status: 200,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "X-Cache": "HIT",
          },
        });
      } catch (parseError) {
        console.warn("Failed to parse cached data, will fetch fresh data:", parseError);
        // Continue to fetch fresh data if cache parsing fails
      }
    }

    // Fetch dashboard data
    const totalProjects = await ProjectModel.countDocuments({ createdBy: userEmail });
    const totalPings = await PingModel.countDocuments({ userEmail });
    const allProjects = await ProjectModel.find({ createdBy: userEmail }).lean();

    const responseData = {
      message: "Dashboard data fetched successfully",
      dashboard: {
        totalProjects,
        totalPings,
        projects: allProjects,
      },
    };

    // Cache the response data (Redis will handle JSON serialization)
    try {
      await redis.set(cacheKey, JSON.stringify(responseData), { ex: 600 }); // 10 minutes
    } catch (cacheError) {
      console.warn("Failed to cache data:", cacheError);
      // Don't fail the request if caching fails
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Error in dashboard API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}