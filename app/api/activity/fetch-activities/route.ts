import { NextResponse, NextRequest } from "next/server";
import Activity from "@/models/ActivityModel";
import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";


export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const cacheKey = "real-time-activity-data";

        // Try fetching from Redis
        const redisData = await redis.get(cacheKey);
        if (redisData) {
            return NextResponse.json({
                message: "Real time Activity Data Fetched (from cache)",
                activityData: (redisData),
            });
        }

        // Fetch from MongoDB
        const dbData = await Activity.find({}).lean();
        if (!dbData || dbData.length === 0) {
            return NextResponse.json({
                message: "No activity data found",
            }, { status: 404 });
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
        }, { status: 500 });
    }
}
