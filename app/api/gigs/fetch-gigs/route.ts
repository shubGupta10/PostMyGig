import { type NextRequest, NextResponse } from "next/server"
import { ConnectoDatabase } from "@/lib/db"
import ProjectModel from "@/models/ProjectModel"
import redis from "@/lib/redis"
import ratelimiter from "@/lib/ratelimit"

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous"

  try {
    const { success, limit, reset, remaining } = await ratelimiter.limit(ip)

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
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      )
    }

    const cacheKey = "fetch-gigs:all"

    try {
      const cachedGigs = await redis.get(cacheKey)

      if (cachedGigs) {
        const gigs = typeof cachedGigs === "string" ? JSON.parse(cachedGigs) : cachedGigs

        console.log("Returning cached gigs:", gigs.length)

        return NextResponse.json(
          {
            gigs,
            fromCache: true,
            count: gigs.length,
          },
          {
            status: 200,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
              "Cache-Control": "no-cache",
            },
          },
        )
      }
    } catch (redisError) {
      console.warn("Redis cache read failed:", redisError)
    }

    await ConnectoDatabase()

    console.log("Fetching gigs from database...")

    // First, let's get ALL gigs to see what's in the database
    const allGigs = await ProjectModel.find({})
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
      .lean()

    console.log("Total gigs in database:", allGigs.length)
    console.log(
      "All gigs statuses:",
      allGigs.map((g) => ({ id: g._id, status: g.status, expiresAt: g.expiresAt })),
    )

    // Now filter for active gigs
    const currentDate = new Date()
    console.log("Current date:", currentDate)

    const activeGigs = allGigs.filter((gig) => {
      const isNotExpired = gig.expiresAt ? new Date(gig.expiresAt) > currentDate : false
      const isActiveStatus = !["accepted", "completed"].includes(gig.status?.toLowerCase())

      console.log(
        `Gig ${gig._id}: expires ${gig.expiresAt}, status: ${gig.status}, notExpired: ${isNotExpired}, activeStatus: ${isActiveStatus}`,
      )

      return isNotExpired && isActiveStatus
    })

    console.log("Filtered active gigs:", activeGigs.length)

    // If no active gigs, let's also try a more lenient query
    if (activeGigs.length === 0) {
      console.log("No active gigs found, trying lenient query...")

      const lenientGigs = await ProjectModel.find({
        status: "active",
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
        .limit(100)
        .lean()

      console.log("Lenient query results:", lenientGigs.length)

      if (lenientGigs.length > 0) {
        try {
          await redis.set(cacheKey, JSON.stringify(lenientGigs), { ex: 300 })
        } catch (redisError) {
          console.warn("Redis cache write failed:", redisError)
        }

        return NextResponse.json(
          {
            gigs: lenientGigs,
            fromCache: false,
            count: lenientGigs.length,
            fetchedAt: new Date().toISOString(),
            queryType: "lenient",
          },
          {
            status: 200,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
              "Cache-Control": "no-cache",
            },
          },
        )
      }
    }

    try {
      await redis.set(cacheKey, JSON.stringify(activeGigs), { ex: 300 })
    } catch (redisError) {
      console.warn("Redis cache write failed:", redisError)
    }

    return NextResponse.json(
      {
        gigs: activeGigs,
        fromCache: false,
        count: activeGigs.length,
        fetchedAt: new Date().toISOString(),
        totalInDb: allGigs.length,
        queryType: "filtered",
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Cache-Control": "no-cache",
        },
      },
    )
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
