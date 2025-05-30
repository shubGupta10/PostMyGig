import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/models/ProjectModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        message: "Unauthorized",
      }, { status: 401 });
    }

    const user = session.user;

    const cacheKey = `user-projects:${user.email}`;
    const cachedProjects = await redis.get(cacheKey);

    if (cachedProjects) {
      return NextResponse.json({
        message: "Fetched from cache",
        projects: cachedProjects,
      }, { status: 200 });
    }

    const allProjects = await ProjectModel.find({ createdBy: user.email }).lean();

    if (!allProjects || allProjects.length === 0) {
      return NextResponse.json({
        message: "User does not have any projects",
      }, { status: 404 });
    }

    await redis.set(cacheKey, allProjects, { ex: 600 });

    return NextResponse.json({
      message: "Projects fetched successfully",
      projects: allProjects,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json({
      message: "Internal server error",
    }, { status: 500 });
  }
}
