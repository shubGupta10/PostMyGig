import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        const { gigId } = await req.json();

        if (!gigId) {
            return NextResponse.json({ error: "Gig ID is required" }, { status: 400 });
        }

        const project = await ProjectModel.findByIdAndUpdate(gigId, {
            status: "completed"
        }, { new: true });

        if (!project) {
            return NextResponse.json({ error: "Gig not found" }, { status: 404 });
        }

        // Invalidate caches
        try {
            await redis.del(`fetch-open-gig:${gigId}`);
            const keys = await redis.keys("fetch-gigs:*");
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } catch (e) {
            console.warn("Failed to invalidate cache", e);
        }

        return NextResponse.json({
            message: "Gig marked as completed successfully",
        }, { status: 200 });

    } catch (error) {
        console.error("Complete gig error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
