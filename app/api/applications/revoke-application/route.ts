import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";
import PingModel from "@/models/PingSchema";
import ProjectModel from "@/models/ProjectModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        const { gigId } = await req.json();
        if (!gigId) {
            return NextResponse.json({ error: "Gig ID is required" }, { status: 400 });
        }

        await PingModel.updateMany(
            { projectId: gigId },
            { $set: { status: "pending" } }
        );

        await ProjectModel.findByIdAndUpdate(gigId, {
            $unset: { AcceptedFreelancerEmail: "" },
            $set: { status: "active" }
        }, { new: true });

        try {
            await redis.del(`fetch-open-gig:${gigId}`);
            const keys = await redis.keys("fetch-gigs:*");
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } catch (error) {
            console.warn("Failed to invalidate cache", error);
        }

        return NextResponse.json({
            message: "Acceptance revoked successfully",
        }, { status: 200 });
    } catch (error) {
        console.error("Revoke error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}