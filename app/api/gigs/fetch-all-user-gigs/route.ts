import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/models/ProjectModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import redis from "@/lib/redis";
import { ConnectoDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await ConnectoDatabase();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({
        message: "Unauthorized or user email missing",
      }, { status: 401 });
    }

    const userEmail = session.user.email;
    const cacheKey = `user-projects:${userEmail}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
      return NextResponse.json({
        message: "Fetched from cache",
        projects: parsed,
      }, { status: 200 });
    }

    const allProjects = await ProjectModel.find({ createdBy: userEmail }).lean();

    if (!allProjects?.length) {
      return NextResponse.json({
        message: "User does not have any projects",
      }, { status: 200 });
    }

    await redis.set(cacheKey, JSON.stringify(allProjects), { ex: 600 });

    return NextResponse.json({
      message: "Projects fetched successfully",
      projects: allProjects,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching user projects:", error.message, error.stack);
    return NextResponse.json({
      message: "Internal server error",
      error: error.message,
    }, { status: 500 });
  }
}
