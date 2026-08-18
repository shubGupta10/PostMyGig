import { NextResponse, NextRequest } from "next/server";
import Activity from "@/models/ActivityModel";
import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";


async function handleFetchActivity() {
    try {
        await ConnectoDatabase();

        const cacheKey = "real-time-activity-data";

        // Try fetching from Redis
        const redisData = await redis.get(cacheKey);
        if (redisData) {
            const parsed = typeof redisData === "string" ? JSON.parse(redisData) : redisData;
            return NextResponse.json({
                message: "Real time Activity Data Fetched (from cache)",
                activityData: parsed,
            });
        }

        // Fetch from MongoDB
        const dbData = await Activity.find({}).sort({ createdAt: -1 }).limit(100).lean();
        if (!dbData || dbData.length === 0) {
            return NextResponse.json({
                message: "No activity data found",
                activityData: [],
            }, { status: 200 });
        }

        // Cache the result
        await redis.set(cacheKey, JSON.stringify(dbData), { ex: 12000 });

        return NextResponse.json({
            message: "Real time Activity Data Fetched (from DB)",
            activityData: dbData,
        });
    } catch (error) {
        console.error("Activity fetch error:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            activityData: [],
        }, { status: 500 });
    }
}

export async function GET() {
    return handleFetchActivity();
}

export async function POST() {
    return handleFetchActivity();
}

