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

    const body = await req.json().catch(() => ({}));
    const page = Math.max(1, parseInt(body.page) || 1);
    const limit = Math.max(1, parseInt(body.limit) || 6);
    const skip = (page - 1) * limit;

    const cacheKey = `user-projects:${userEmail}:${page}:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
      return NextResponse.json({
        message: "Fetched from cache",
        projects: parsed.projects,
        pagination: parsed.pagination,
      }, { status: 200 });
    }

    const [projects, totalCount] = await Promise.all([
      ProjectModel.find({ createdBy: userEmail })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProjectModel.countDocuments({ createdBy: userEmail })
    ])

    if (!projects?.length) {
      return NextResponse.json({
        message: "User does not have any projects",
      }, { status: 200 });
    }

    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }

    const dataToCache = {
      projects,
      pagination
    }

    await redis.set(cacheKey, JSON.stringify(dataToCache), { ex: 600 });

    return NextResponse.json({
      message: "Projects fetched successfully",
      projects,
      pagination,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching user projects:", error.message, error.stack);
    return NextResponse.json({
      message: "Internal server error",
      error: error.message,
    }, { status: 500 });
  }
}
