import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";

export async function DELETE(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const { gigId } = await req.json();

        if (!gigId) {
            return NextResponse.json({
                message: "Gig ID is required"
            }, { status: 400 });
        }

        // First fetch the gig to get its creator
        const gig = await ProjectModel.findById(gigId).lean();
        if (!gig) {
            return NextResponse.json({
                message: "Gig not found"
            }, { status: 404 });
        }

        const cacheKey = `user-projects:${gig.createdBy}`;

        // Delete the gig
        const deleted = await ProjectModel.findByIdAndDelete(gigId);
        if (!deleted) {
            return NextResponse.json({
                message: "Gig could not be deleted"
            }, { status: 500 });
        }

        await redis.del(cacheKey);

        return NextResponse.json({
            message: "Gig deleted and cache invalidated"
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting gig:", error);
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 });
    }
}
