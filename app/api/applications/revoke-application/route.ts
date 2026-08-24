import { ConnectoDatabase } from "@/lib/db";
import { authOptions } from "@/lib/options";
import redis from "@/lib/redis";
import PingModel from "@/modules/notifications/models/PingSchema";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import ContractModel from "@/modules/contracts/models/ContractModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    let dbSession;
    try {

        const session = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }
        await ConnectoDatabase();
        const { gigId } = await req.json();
        if (!gigId) {
            return NextResponse.json({ error: "Gig ID is required" }, { status: 400 });
        }

        const project = await ProjectModel.findById(gigId);
        if (!project) {
            return NextResponse.json({ error: "Gig not found" }, { status: 404 });
        }

        if (project.createdBy !== session.user.email) {
            return NextResponse.json({ error: "Forbidden. You do not own this gig." }, { status: 403 });
        }

        if (project.status !== 'accepted' && project.status !== 'contract_offered') {
            return NextResponse.json({ error: "There is no accepted application to revoke. The gig is not in an accepted state." }, { status: 400 });
        }

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        await PingModel.updateMany(
            { projectId: gigId },
            { $set: { status: "pending" } },
            { session: dbSession }
        );

        await ContractModel.updateMany(
            { projectId: gigId, status: { $ne: 'completed' } },
            { $set: { status: 'cancelled' } },
            { session: dbSession }
        );

        await ProjectModel.findByIdAndUpdate(gigId, {
            $unset: { AcceptedFreelancerEmail: "" },
            $set: { status: "active" },
        }, { new: true }).session(dbSession);

        const [updatedProject, allApplicationsForGig] = await Promise.all([
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

            if (updatedProject?.createdBy) {
                const clientKeys = await redis.keys(`dashboard-data:client:${updatedProject.createdBy}*`);
                const projectKeys = await redis.keys(`user-projects:${updatedProject.createdBy}*`);
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