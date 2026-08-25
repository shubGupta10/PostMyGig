import { ConnectoDatabase } from "@/lib/db";
import { authOptions } from "@/lib/options";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import userModel from "@/modules/users/models/UserModel";
import ReviewModel from "@/modules/reviews/model/ReviewModel";

export async function POST(req: NextRequest) {
    let dbSession;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        const { gigId, rating, comment } = await req.json();
        if (!gigId || !rating || !comment) {
            return NextResponse.json({
                message: "GigID, rating, comments are required"
            }, { status: 400 })
        }

        await ConnectoDatabase();

        const project = await ProjectModel.findById(gigId);
        if (!project || project.status !== "completed") {
            return NextResponse.json({ error: "Project not found or not completed" }, { status: 404 });
        }

        if (project.AcceptedFreelancerEmail !== session.user.email) {
            return NextResponse.json({ error: "Forbidden. Only the hired freelancer can leave this review." }, { status: 403 });
        }

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        const clientUser = await userModel.findOne({ email: project.createdBy }).session(dbSession);
        const freelancerUser = await userModel.findOne({ email: session.user.email }).session(dbSession);

        if (!clientUser || !freelancerUser) {
            throw new Error("Users not found");
        }

        const freelancerId = String(freelancerUser._id);
        const clientId = String(clientUser._id);

        const existingReview = await ReviewModel.findOne({ gigId, authorId: freelancerId }).session(dbSession);
        if (existingReview) {
            throw new Error("You have already reviewed this project.");
        }

        await ReviewModel.create([{
            gigId,
            authorId: freelancerId,
            targetId: clientId,
            role: "freelancer",
            rating: Number(rating),
            comment,
            status: "published"
        }], { session: dbSession });

        await ReviewModel.updateOne(
            { gigId, authorId: clientId, targetId: freelancerId },
            { $set: { status: "published" } },
            { session: dbSession }
        );

        const updateAverages = async (userId: string, email: string, session: any) => {
            const stats = await ReviewModel.aggregate([
                {
                    $match: {
                        targetId: userId,
                        status: "published"
                    },
                },
                {
                    $group: {
                        _id: null,
                        avgRating: {
                            $avg: "$rating"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]).session(session);

            const avgRating = stats.length > 0 ? Number(stats[0].avgRating.toFixed(1)) : 0;
            const totalReviews = stats.length > 0 ? stats[0].count : 0;

            await userModel.updateOne(
                { email },
                {
                    $set: {
                        averageRating: avgRating,
                        totalReviews: totalReviews
                    }
                }, { session: session }
            );
        };

        await updateAverages(clientId, clientUser.email, dbSession);
        await updateAverages(freelancerId, freelancerUser.email, dbSession);

        await dbSession.commitTransaction();
        return NextResponse.json({
            message: "Review submitted and published successfully!"
        });
    } catch (error: any) {
        if (dbSession) await dbSession.abortTransaction();
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    } finally {
        if (dbSession) dbSession.endSession();
    }
}