import { NextResponse, NextRequest } from "next/server";
import userModel from "@/modules/users/models/UserModel";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import PingModel from "@/modules/notifications/models/PingSchema";
import { ConnectoDatabase } from "@/lib/db";
import ratelimiter from "@/lib/ratelimit";
import FeedbackModel from "@/modules/admin/models/FeedbackModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function POST(req: NextRequest) {

    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { success, limit, reset, remaining } = await ratelimiter.limit(ip);

    if (!success) {
        return NextResponse.json(
            {
                message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s.`,
            },
            { status: 429 }
        );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({
            message: "Unauthorized"
        }, { status: 404 })
    }

    //check if this user is admin
    if (session.user.isAdmin !== true) {
        return NextResponse.json({
            message: "Not a admin account"
        }, { status: 404 })
    }

    try {
        await ConnectoDatabase();

        const { userEmail } = await req.json();
        if (!userEmail) {
            return NextResponse.json({
                message: "User Email not found"
            }, { status: 400 })
        }

        if (session.user.email !== userEmail) {
            return NextResponse.json({
                message: "Unauthorized Access"
            }, { status: 404 })
        }

        const fetchCurrentUser = await userModel.findOne({ email: userEmail });
        if (!fetchCurrentUser) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 });
        }

        if (fetchCurrentUser.isAdmin !== true) {
            return NextResponse.json({
                message: "Only Admin is allowed to this route"
            }, { status: 403 })
        }

        const [
            totalUsers,
            totalProjects,
            totalPingSends,
            totalUsersData,
            totalProjectsData,
            fetchALLFeedbacks
        ] = await Promise.all([
            userModel.countDocuments(),
            ProjectModel.countDocuments(),
            PingModel.countDocuments(),
            userModel.find({}).sort({ createdAt: -1 }).limit(50).lean(),
            ProjectModel.find({}).sort({ createdAt: -1 }).limit(50).lean(),
            FeedbackModel.find({}).sort({ createdAt: -1 }).limit(50).lean()
        ])

        return NextResponse.json({
            message: "Fetch All data",
            data: {
                counts: {
                    totalUsers,
                    totalProjects,
                    totalPingSends,
                },
                allData: {
                    totalUsersData,
                    totalProjectsData,
                    fetchALLFeedbacks
                }
            }
        }, { status: 200 })
    } catch (error) {
        console.error("Admin Fetch Error:", error);
        return NextResponse.json({
            message: "Failed to fetch data",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}