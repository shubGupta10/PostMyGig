import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import ProjectModel from "@/models/ProjectModel";
import PingModel from "@/models/PingSchema";
import { ConnectoDatabase } from "@/lib/db";
import ratelimiter from "@/lib/ratelimit";
import FeedbackModel from "@/models/FeedbackModel";

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

    try {
        await ConnectoDatabase();

        const { userEmail } = await req.json();
        if (!userEmail) {
            return NextResponse.json({
                message: "User Email not found"
            }, { status: 400 })
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