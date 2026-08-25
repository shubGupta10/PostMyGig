import { ConnectoDatabase } from "@/lib/db"
import redis from "@/lib/redis"
import userModel from "@/modules/users/models/UserModel"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import type { UserData } from "../types"
import mongoose from "mongoose"

export async function fetchUserProfile(): Promise<UserData> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please log in to view your profile.")
  }

  try {
    await ConnectoDatabase()
    const userId = session.user.id

    const fetchSessionUser = await userModel.findById(userId)
    if (!fetchSessionUser) {
      throw new Error("User not found.")
    }

    const cacheKey = `fetch-user-profile:${fetchSessionUser.email}`
    const cachedUser = await redis.get(cacheKey)

    if (typeof cachedUser === "string") {
      return JSON.parse(cachedUser) as UserData
    }

    const foundUser = await userModel.findOne({ email: fetchSessionUser.email }).select("-password -__v").lean()

    if (!foundUser) {
      throw new Error("User profile not found.")
    }

    const serializedUser = JSON.parse(JSON.stringify(foundUser)) as UserData

    await redis.set(cacheKey, JSON.stringify(serializedUser), { ex: 3600 })

    return serializedUser
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to load profile data.")
  }
}

export async function fetchPublicUserProfile(userId: string): Promise<UserData | null> {
  try {
    await ConnectoDatabase()

    const cacheKey = `fetch-public-user-profile-v7:${userId}`
    const cachedUser = await redis.get(cacheKey)

    if (typeof cachedUser === "string") {
      return JSON.parse(cachedUser) as UserData
    }

    const [foundUser] = await userModel.aggregate([
      // Stage 1: Find the user
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      // Stage 2: Fetch Open Gigs
      {
        $lookup: {
          from: "projects",
          let: { userEmail: "$email" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$createdBy", "$$userEmail"] },
                    { $eq: ["$status", "active"] }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } }
          ],
          as: "openGigs"
        }
      },
      // Stage 3: Fetch Client Completed Gigs
      {
        $lookup: {
          from: "projects",
          let: { userEmail: "$email" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$createdBy", "$$userEmail"] },
                    { $eq: ["$status", "completed"] }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } }
          ],
          as: "clientCompleted"
        }
      },
      // Stage 4: Fetch Freelancer Completed Gigs
      {
        $lookup: {
          from: "projects",
          let: { userEmail: "$email" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$AcceptedFreelancerEmail", "$$userEmail"] },
                    { $eq: ["$status", "completed"] }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } }
          ],
          as: "freelancerCompleted"
        }
      },
      // Stage 5: Fetch Published Reviews
      {
        $lookup: {
          from: "reviews",
          let: { targetUserId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$targetUserId"] },
                    { $eq: ["$status", "published"] }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } }
          ],
          as: "reviews"
        }
      },
      // Stage 5: Merge arrays & Cleanup
      {
        $addFields: {
          completedGigs: { $concatArrays: ["$clientCompleted", "$freelancerCompleted"] }
        }
      },
      {
        $project: {
          password: 0,
          __v: 0,
          clientCompleted: 0,
          freelancerCompleted: 0
        }
      }
    ]);

    if (!foundUser) {
      return null;
    }

    // Enforce privacy settings
    if (foundUser.showEmail !== true) {
      delete foundUser.email;
    }
    if (foundUser.showContactLinks === false) {
      delete foundUser.contactLinks;
    }
    if (foundUser.activityPublic === false) {
      delete foundUser.openGigs;
      delete foundUser.completedGigs;
    }

    const serializedUser = JSON.parse(JSON.stringify(foundUser)) as UserData;
    await redis.set(cacheKey, JSON.stringify(serializedUser), { ex: 3600 });

    return serializedUser;
  } catch (error) {
    console.error("Failed to fetch public user profile:", error)
    return null
  }
}
