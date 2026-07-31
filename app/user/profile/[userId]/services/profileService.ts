import { ConnectoDatabase } from "@/lib/db"
import redis from "@/lib/redis"
import userModel from "@/models/UserModel"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import type { UserData } from "../types"

export async function fetchUserProfile(): Promise<UserData> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please log in to view your profile.")
  }

  try {
    await ConnectoDatabase()
    const userId = session.user.id
    
    // Check if the user exists
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

    // Deep serialize to convert ALL nested ObjectIds (e.g. contactLinks._id, skills etc.)
    const serializedUser = JSON.parse(JSON.stringify(foundUser)) as UserData

    // Cache the user profile for 1 hour
    await redis.set(cacheKey, JSON.stringify(serializedUser), { ex: 3600 })

    return serializedUser
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to load profile data.")
  }
}
