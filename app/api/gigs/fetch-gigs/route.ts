import { type NextRequest, NextResponse } from "next/server"
import { ConnectoDatabase } from "@/lib/db"
import ProjectModel from "@/models/ProjectModel"
import redis from "@/lib/redis"
import ratelimiter from "@/lib/ratelimit"

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous"
  
  // Get page and limit from URL
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const skip = (page - 1) * limit

  try {
    const { success, limit: rateLimit, reset, remaining } = await ratelimiter.limit(ip)

    if (!success) {
      return NextResponse.json(
        {
          message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s.`,
          error: "RATE_LIMIT_EXCEEDED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": rateLimit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      )
    }

    const cacheKey = `fetch-gigs:page:${page}:limit:${limit}`

    try {
      const cachedGigs = await redis.get(cacheKey)

      if (cachedGigs) {
        const data = typeof cachedGigs === "string" ? JSON.parse(cachedGigs) : cachedGigs


        return NextResponse.json(data, {
          status: 200,
          headers: {
            "X-RateLimit-Limit": rateLimit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Cache-Control": "no-cache",
          },
        })
      }
    } catch (redisError) {
      console.warn("Redis cache read failed:", redisError)
    }

    await ConnectoDatabase()


    const currentDate = new Date()

    // Get paginated gigs
    const gigs = await ProjectModel.find({
      expiresAt: { $gt: currentDate },
      status: { $nin: ["accepted", "completed"] }
    })
      .select({
        title: 1,
        description: 1,
        skillsRequired: 1,
        status: 1,
        createdAt: 1,
        expiresAt: 1,
        createdBy: 1,
        isFlagged: 1,
        reportCount: 1,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count
    const totalCount = await ProjectModel.countDocuments({
      expiresAt: { $gt: currentDate },
      status: { $nin: ["accepted", "completed"] }
    })

    const totalPages = Math.ceil(totalCount / limit)

    const responseData = {
      gigs,
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      fromCache: false,
    }

    try {
      await redis.set(cacheKey, JSON.stringify(responseData), { ex: 300 })
    } catch (redisError) {
      console.warn("Redis cache write failed:", redisError)
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "X-RateLimit-Limit": rateLimit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
        "Cache-Control": "no-cache",
      },
    })
  } catch (error: any) {
    console.error("Error fetching gigs:", error)

    if (error.name === "MongoError" || error.name === "MongooseError") {
      return NextResponse.json(
        {
          message: "Database connection failed",
          error: "DATABASE_ERROR",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        message: "Failed to fetch gigs",
        error: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    )
  }
}