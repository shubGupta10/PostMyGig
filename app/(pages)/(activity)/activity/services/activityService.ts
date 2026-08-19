import { ConnectoDatabase } from "@/lib/db"
import redis from "@/lib/redis"
import ActivityModel from "@/modules/notifications/models/ActivityModel"
import type { ActivityItem } from "../types"

export async function fetchActivityData(): Promise<ActivityItem[]> {
  try {
    await ConnectoDatabase()
    const cacheKey = "real-time-activity-data"
    
    const redisData = await redis.get(cacheKey)
    if (redisData) {
      return Array.isArray(redisData) ? redisData : JSON.parse(redisData as string)
    }

    const dbData = await ActivityModel.find({}).sort({ createdAt: -1 }).lean()
    if (dbData && dbData.length > 0) {
      // Convert MongoDB ObjectIds to strings to avoid serialization errors
      const serializedData = dbData.map(doc => ({
        ...doc,
        _id: doc._id.toString(),
        userId: doc.userId.toString(),
        gigId: doc.gigId.toString(),
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      }))
      
      await redis.set(cacheKey, JSON.stringify(serializedData), { ex: 12000 })
      return serializedData as unknown as ActivityItem[]
    }
    
    return []
  } catch (error) {
    console.warn("Failed to fetch activity data:", error)
    return []
  }
}
