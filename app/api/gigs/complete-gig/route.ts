import { NextResponse, NextRequest, after } from "next/server";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";
import userModel from "@/modules/users/models/UserModel";
import Activity from "@/modules/notifications/models/ActivityModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import ReviewModel from "@/modules/reviews/model/ReviewModel";

export async function POST(req: NextRequest) {
    let dbSession;
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 403 })
        }
        await ConnectoDatabase();
        const { gigId, rating, comment } = await req.json();

        if (!gigId || !rating || !comment) {
            return NextResponse.json({ error: "Gig ID, rating and comments are required" }, { status: 400 });
        }

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        const project = await ProjectModel.findById(gigId).session(dbSession);

        if (!project) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
            return NextResponse.json({ error: "Gig not found" }, { status: 404 });
        }

        if (project.createdBy !== session.user.email) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
            return NextResponse.json({ message: "Forbidden. Only the gig creator can mark it completed." }, { status: 403 });
        }

        project.status = "completed";
        await project.save({ session: dbSession });

        const clientUser = await userModel.findOne({ email: project.createdBy }).session(dbSession);
        const freelancerUser = await userModel.findOne({ email: project.AcceptedFreelancerEmail }).session(dbSession);

        if (clientUser && freelancerUser) {
            await ReviewModel.create([{
                gigId: String(project._id),
                authorId: String(clientUser._id),
                targetId: String(freelancerUser._id),
                role: "client",
                rating: Number(rating),
                comment,
                status: "hidden"
            }], { session: dbSession });
        }

        const THRESHOLD = 3;

        if (project.createdBy) {
            const clientGigCount = await ProjectModel.countDocuments({
                createdBy: project.createdBy,
                status: "completed"
            }).session(dbSession);

            if (clientGigCount >= THRESHOLD) {
                await userModel.findOneAndUpdate(
                    { email: project.createdBy, verificationStatus: { $nin: ['pending', 'approved'] }, isVerified: { $ne: true } },
                    { $set: { verificationStatus: 'pending' } },
                    { session: dbSession }
                );
            }
        }

        // Check Freelancer verification eligibility
        if (project.AcceptedFreelancerEmail) {
            const freelancerGigCount = await ProjectModel.countDocuments({
                AcceptedFreelancerEmail: project.AcceptedFreelancerEmail,
                status: "completed"
            }).session(dbSession);

            if (freelancerGigCount >= THRESHOLD) {
                await userModel.findOneAndUpdate(
                    { email: project.AcceptedFreelancerEmail, verificationStatus: { $nin: ['pending', 'approved'] }, isVerified: { $ne: true } },
                    { $set: { verificationStatus: 'pending' } },
                    { session: dbSession }
                );
            }
        }

        await dbSession.commitTransaction();
        await dbSession.endSession();

        // Invalidate caches
        try {
            await redis.del(`fetch-open-gig:${gigId}`);
            const keys = await redis.keys("fetch-gigs:*");
            if (keys.length > 0) {
                await redis.del(...keys);
            }
            if (project.createdBy) {
                const userKeys = await redis.keys(`user-projects:${project.createdBy}*`);
                if (userKeys.length > 0) await redis.del(...userKeys);
            }
        } catch (e) {
            console.warn("Failed to invalidate cache", e);
        }

        // Record public activity
        after(async () => {
            try {
                const [clientUser, freelancerUser] = await Promise.all([
                    userModel.findOne({ email: project.createdBy }).select("name").lean(),
                    project.AcceptedFreelancerEmail
                        ? userModel.findOne({ email: project.AcceptedFreelancerEmail }).select("name").lean()
                        : null
                ]);

                await Activity.create({
                    userId: clientUser?._id?.toString() || project.createdBy,
                    gigId: gigId,
                    type: 'completed',
                    metadata: {
                        clientName: clientUser?.name || "Client",
                        freelancerName: freelancerUser?.name || "Freelancer",
                        gigTitle: project.title,
                        skills: project.skillsRequired?.slice(0, 3) || [],
                        budget: project.budget || "",
                    }
                });

                await redis.del("real-time-activity-data");
                await redis.del("public-success-feed");
            } catch (actErr) {
                console.warn("Failed to record completed activity:", actErr);
            }
        });

        return NextResponse.json({
            message: "Gig marked as completed successfully",
        }, { status: 200 });

    } catch (error) {
        if (dbSession) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
        }
        console.error("Complete gig error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
