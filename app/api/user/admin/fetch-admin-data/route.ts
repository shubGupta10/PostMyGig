import { NextResponse, NextRequest } from "next/server";
import userModel from "@/modules/users/models/UserModel";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import PingModel from "@/modules/notifications/models/PingSchema";
import { ConnectoDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { getPaginatedUsers, getPaginatedProjects, getPaginatedFeedbacks, getPaginatedApplications } from "./paginationService";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const {
            userEmail,
            userPage = 1,
            projectPage = 1,
            feedbackPage = 1,
            applicationPage = 1,
        } = await req.json();

        if (!userEmail) {
            return NextResponse.json({ message: "User Email not found" }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (!session || session.user.email !== userEmail) {
            return NextResponse.json({ message: "Unauthorized Access" }, { status: 403 });
        }

        const fetchCurrentUser = await userModel.findOne({ email: userEmail });
        if (!fetchCurrentUser || fetchCurrentUser.isAdmin !== true) {
            return NextResponse.json({ message: "Only Admin is allowed to this route" }, { status: 403 });
        }

        const [
            totalUsers,
            totalProjects,
            totalPingSends,
            paginatedUsers,
            paginatedProjects,
            paginatedFeedbacks,
            paginatedApplication,
        ] = await Promise.all([
            userModel.countDocuments(),
            ProjectModel.countDocuments(),
            PingModel.countDocuments(),

            getPaginatedUsers(userPage),
            getPaginatedProjects(projectPage),
            getPaginatedFeedbacks(feedbackPage),
            getPaginatedApplications(applicationPage)
        ]);

        return NextResponse.json({
            message: "Fetch All data",
            data: {
                counts: {
                    totalUsers,
                    totalProjects,
                    totalPingSends,
                },
                allData: {
                    totalUsersData: paginatedUsers.data,
                    totalProjectsData: paginatedProjects.data,
                    fetchALLFeedbacks: paginatedFeedbacks.data,
                    applicationPageData: paginatedApplication.data,
                },
                pagination: {
                    userPagination: paginatedUsers.pagination,
                    projectPagination: paginatedProjects.pagination,
                    feedbackPagination: paginatedFeedbacks.pagination,
                    applicationPagination: paginatedApplication.pagination
                }
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Admin Fetch Error:", error);
        return NextResponse.json({
            message: "Failed to fetch data",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
