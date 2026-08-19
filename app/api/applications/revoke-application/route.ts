import { ConnectoDatabase } from "@/lib/db";
import { authOptions } from "@/lib/options";
import redis from "@/lib/redis";
import PingModel from "@/modules/notifications/models/PingSchema";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    let dbSession;
    try {

        const session = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unathorized"
            }, { status: 404 })
        }
        await ConnectoDatabase();
        const { gigId } = await req.json();
        if (!gigId) {
            return NextResponse.json({ error: "Gig ID is required" }, { status: 400 });
        }

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        await PingModel.updateMany(
            { projectId: gigId },
            { $set: { status: "pending" } },
            { session: dbSession }
        );

        await ProjectModel.findByIdAndUpdate(gigId, {
            $unset: { AcceptedFreelancerEmail: "" },
            $set: { status: "active" },
        }, { new: true }).session(dbSession);

        const [project, allApplicationsForGig] = await Promise.all([
            ProjectModel.findById(gigId).select("createdBy").lean(),
            PingModel.find({ projectId: gigId }).select("userEmail").lean().session(dbSession),
        ]);

        await dbSession.commitTransaction();
        await dbSession.endSession();

        try {
            const keysToDelete: string[] = [
                `open-gig:${gigId}`,
                `fetch-open-gig:${gigId}`,
            ];

            if (project?.createdBy) {
                const clientKeys = await redis.keys(`dashboard-data:client:${project.createdBy}*`);
                const projectKeys = await redis.keys(`user-projects:${project.createdBy}*`);
                keysToDelete.push(...clientKeys, ...projectKeys);
            }

            for (const app of allApplicationsForGig) {
                if (app.userEmail) {
                    const fKeys = await redis.keys(`dashboard-data:freelancer:${app.userEmail}*`);
                    keysToDelete.push(...fKeys);
                }
            }

            const keys = await redis.keys("fetch-gigs:*");
            keysToDelete.push(...keys);

            if (keysToDelete.length > 0) {
                const uniqueKeys = Array.from(new Set(keysToDelete));
                await redis.del(...uniqueKeys);
            }
        } catch (error) {
            console.warn("Failed to invalidate cache", error);
        }

        return NextResponse.json({
            message: "Acceptance revoked successfully",
        }, { status: 200 });
    } catch (error) {
        if (dbSession) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
        }
        console.error("Revoke error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}