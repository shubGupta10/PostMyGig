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
    const cachedData = await redis.get(cacheKey);

    if (typeof cachedData === "string") {
      return new NextResponse(cachedData, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "X-Cache": "HIT",
        },
      });
    }

    // Fetch dashboard data
    const totalProjects = await ProjectModel.countDocuments({ createdBy: userEmail });
    const totalPings = await PingModel.countDocuments({ userEmail });
    const allProjects = await ProjectModel.find({ createdBy: userEmail }).lean();

    const responseData = JSON.stringify({
      message: "Dashboard data fetched successfully",
      dashboard: {
        totalProjects,
        totalPings,
        projects: allProjects,
      },
    });

    // Cache response for 10 minutes
    await redis.set(cacheKey, responseData, { ex: 600 });

    return new NextResponse(responseData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
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
