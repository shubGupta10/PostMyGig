import { NextResponse, NextRequest } from "next/server";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";
import Chat from "@/modules/chat/models/ChatModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function DELETE(req: NextRequest) {
    let dbSession;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }



        await ConnectoDatabase();

        const { gigId } = await req.json();

        if (!gigId) {
            return NextResponse.json({
                message: "Gig ID is required"
            }, { status: 400 });
        }

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        // First fetch the gig to get its creator
        const gig = await ProjectModel.findById(gigId).lean().session(dbSession);
        if (!gig) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
            return NextResponse.json({
                message: "Gig not found"
            }, { status: 404 });
        }

        // Check ownership after fetching the gig:
        if (gig.createdBy !== session.user.email) {
            await dbSession.abortTransaction();
            await dbSession.endSession()
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const cacheKey = `user-projects:${gig.createdBy}`;

        // Delete the gig
        const deleted = await ProjectModel.findByIdAndDelete(gigId).session(dbSession);
        if (!deleted) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
            return NextResponse.json({
                message: "Gig could not be deleted"
            }, { status: 500 });
        }

        try {
            await redis.del(cacheKey);
            await redis.del(`fetch-open-gig:${gigId}`);
            const keys = await redis.keys("fetch-gigs:*");
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } catch (e) {
            console.warn("Failed to invalidate cache", e);
        }

        //set to delete the gig
        await Chat.deleteMany({
            gigId: gigId
        }).session(dbSession);

        await dbSession.commitTransaction();
        await dbSession.endSession();

        return NextResponse.json({
            message: "Gig deleted and cache invalidated"
        }, { status: 200 });

    } catch (error) {
        if (dbSession) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
        }
        console.error("Error deleting gig:", error);
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 });
    }
}
