import { NextRequest, NextResponse } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import ProjectModel from "@/models/ProjectModel";
import redis from "@/lib/redis";
import ratelimiter from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
  
  try {
    // Rate limiting check
    const { success, limit, reset, remaining } = await ratelimiter.limit(ip);

    if (!success) {
      return NextResponse.json({
        message: `Rate limit exceeded. Try again in ${Math.ceil(
          (reset - Date.now()) / 1000
        )}s.`,
        error: "RATE_LIMIT_EXCEEDED"
      }, { 
        status: 429,
        headers: {
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": reset.toString(),
        }
      });
    }

    // Check cache first
    const cacheKey = "fetch-gigs:all";
    
    try {
      const cachedGigs = await redis.get(cacheKey);
      
      if (cachedGigs) {
        const gigs = typeof cachedGigs === "string" ? JSON.parse(cachedGigs) : cachedGigs;
        
        return NextResponse.json({ 
          gigs,
          fromCache: true,
          count: gigs.length 
        }, { 
          status: 200,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Cache-Control": "public, max-age=300", // 5 minutes browser cache
          }
        });
      }
    } catch (redisError) {
      console.warn("Redis cache read failed:", redisError);
      // Continue to database fetch if Redis fails
    }

    // Connect to database
    await ConnectoDatabase();

    // Fetch from database with optimized query
    const currentDate = new Date();
    const gigs = await ProjectModel.find({
      expiresAt: { $gt: currentDate }, // Not expired
      status: { $nin: ["accepted", "completed"] },
      // Optional: Add visibility filter if you have private gigs
      // isPublic: true
    })
    .select({
      // Only select needed fields to reduce payload size
      title: 1,
      description: 1,
      skillsRequired: 1,
      status: 1,
      createdAt: 1,
      expiresAt: 1,
      createdBy: 1,
      isFlagged: 1,
      reportCount: 1
    })
    .sort({ createdAt: -1 })
    .limit(100) // Prevent huge payloads
    .lean(); // Returns plain objects instead of Mongoose documents

    // Cache the result
    try {
      await redis.set(cacheKey, JSON.stringify(gigs), { ex: 3600 }); // 1 hour
    } catch (redisError) {
      console.warn("Redis cache write failed:", redisError);
      // Don't fail the request if caching fails
    }

    return NextResponse.json({ 
      gigs,
      fromCache: false,
      count: gigs.length,
      fetchedAt: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
        "Cache-Control": "public, max-age=300", // 5 minutes browser cache
      },
    });

  } catch (error: any) {
    console.error("Error fetching gigs:", error);
    
    // Return different errors based on the type
    if (error.name === 'MongoError' || error.name === 'MongooseError') {
      return NextResponse.json(
        { 
          message: "Database connection failed",
          error: "DATABASE_ERROR"
        },
        { status: 503 } // Service Unavailable
      );
    }

    return NextResponse.json(
      { 
        message: "Failed to fetch gigs",
        error: "INTERNAL_SERVER_ERROR"
      },
      { status: 500 }
    );
  }
}