import { NextResponse, NextRequest } from "next/server";
import userModel from "@/modules/users/models/UserModel";
import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

interface ContactLinks {
  label: string;
  url: string;
}

export async function PATCH(req: NextRequest) {
  try {
    await ConnectoDatabase();
    const body = await req.json();

    const {
      userId,
      name,
      email,
      bio,
      contactLinks,
      location,
      role,
      skills,
      portfolioProjects,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (session?.user.id !== userId) {
      return NextResponse.json({
        message: "Unauthorized"
      }, { status: 403 })
    }

    if (
      contactLinks &&
      (!Array.isArray(contactLinks) ||
        !contactLinks.every(
          (link) =>
            typeof link.label === "string" &&
            typeof link.url === "string"
        ))
    ) {
      return NextResponse.json(
        { error: "Invalid contactLinks format" },
        { status: 400 }
      );
    }

    if (
      skills &&
      (!Array.isArray(skills) || !skills.every((s) => typeof s === "string"))
    ) {
      return NextResponse.json({ error: "Invalid skills format" }, { status: 400 });
    }

    if (
      portfolioProjects &&
      (!Array.isArray(portfolioProjects) ||
        !portfolioProjects.every(
          (p) =>
            typeof p.title === "string" &&
            typeof p.description === "string" &&
            Array.isArray(p.tags)
        ))
    ) {
      return NextResponse.json(
        { error: "Invalid portfolioProjects format" },
        { status: 400 }
      );
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        bio,
        contactLinks,
        location,
        role,
        skills,
        portfolioProjects: portfolioProjects || [],
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
      if (updatedUser.email) {
        await redis.del(`fetch-user-profile:${updatedUser.email}`);
      }
      await redis.del(`fetch-user-profile:${userId}`);
      await redis.del(`fetch-public-user-profile-v7:${userId}`);
      console.log("Invalidated profile caches for", userId);
    } catch (cacheErr) {
      console.warn("Failed to invalidate profile redis cache:", cacheErr);
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
