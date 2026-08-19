import { NextResponse, NextRequest } from "next/server";
import userModel from "@/modules/users/models/UserModel";
import redis from "@/lib/redis";
import { ConnectoDatabase } from "@/lib/db";
import ProjectModel from "@/modules/gigs/models/ProjectModel";

export async function POST(req: NextRequest) {
  try {
    await ConnectoDatabase();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const cacheKey = `fetch-user-profile:${userId}`;

    const cachedUser = await redis.get(cacheKey);

    if (typeof cachedUser === "string") {
      return NextResponse.json(
        {
          message: "User profile (from cache)",
          user: JSON.parse(cachedUser),
        },
        { status: 200 }
      );
    }

    const foundUser = await userModel.findById(userId).select("-password -__v").lean();

    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedGigCount = await ProjectModel.countDocuments({
      $or: [
        { createdBy: foundUser.email, status: "completed" },
        { AcceptedFreelancerEmail: foundUser.email, status: "completed" }
      ]
    });

    const userWithDetails = {
      ...foundUser,
      completedGigCount
    }

    await redis.set(cacheKey, JSON.stringify(userWithDetails), { ex: 3600 });

    return NextResponse.json(
      {
        message: "User profile fetched successfully",
        user: userWithDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
