import { ConnectoDatabase } from "@/lib/db";
import { authOptions } from "@/lib/options";
import redis from "@/lib/redis";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import userModel from "@/modules/users/models/UserModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        const userId = session?.user.id;
        const userEmail = session?.user.email;

        const user = await userModel.findById(userId);
        if (!user) {
            return NextResponse.json({
                message: "User not found",
            }, { status: 404 })
        }

        if (user.verificationStatus === "pending") {
            return NextResponse.json({
                message: "Verification request is already pending"
            }, { status: 400 })
        }

        if (user.verificationStatus === "approved") {
            return NextResponse.json({
                message: "Account is already verified"
            }, { status: 400 })
        }

        const completedGigsCount = await ProjectModel.countDocuments({
            $or: [
                { createdBy: userEmail, status: "completed" },
                { AcceptedFreelancerEmail: userEmail, status: "completed" }
            ]
        });

        if (completedGigsCount < 3) {
            return NextResponse.json({
                message: "You need at least 3 completed gigs to request verification"
            }, { status: 400 })
        }

        user.verificationStatus = "pending";
        await user.save();

        const cacheKey = `fetch-user-profile:${userId}`;
        await redis.del(cacheKey);

        return NextResponse.json({
            message: "Verification request submitted successfully!"
        }, { status: 200 })

    } catch (error) {
        console.error("Error in request-verification route:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
