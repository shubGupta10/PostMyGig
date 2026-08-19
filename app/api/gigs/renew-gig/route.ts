import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { gigId } = await req.json();

        if (!gigId) {
            return NextResponse.json({ message: "Gig ID is required" }, { status: 400 });
        }

        // Verify ownership
        const gig = await ProjectModel.findOne({ _id: gigId, createdBy: session.user.email });
        if (!gig) {
            return NextResponse.json({ message: "Gig not found or unauthorized" }, { status: 404 });
        }

        // Extend for 45 days from today and reset status to 'active'
        const newExpiresAt = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
        gig.status = "active";
        gig.expiresAt = newExpiresAt;
        await gig.save();

        // Invalidate Redis caches
        try {
            const publicKeys = await redis.keys("fetch-gigs:*");
            if (publicKeys.length > 0) await redis.del(...publicKeys);

            const userKeys = await redis.keys(`user-projects:${session.user.email}:*`);
            if (userKeys.length > 0) await redis.del(...userKeys);
        } catch (cacheErr) {
            console.warn("Redis invalidation failed:", cacheErr);
        }

        return NextResponse.json({
            message: "Gig renewed successfully for 45 days",
            gig,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error renewing gig:", error);
        return NextResponse.json({ message: "Failed to renew gig" }, { status: 500 });
    }
}
