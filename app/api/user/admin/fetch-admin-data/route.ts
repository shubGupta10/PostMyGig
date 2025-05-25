import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import ProjectModel from "@/models/ProjectModel";
import PingModel from "@/models/PingSchema";
import { ConnectoDatabase } from "@/lib/db";
import ratelimiter from "@/lib/ratelimit";

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

       const {userEmail} = await req.json();
       if(!userEmail){
        return NextResponse.json({
            message: "User Email not found"
        }, {status: 400})
       }

       const fetchCurrentUser = await userModel.findOne({email: userEmail});
       if (!fetchCurrentUser) {
           return NextResponse.json({
               message: "User not found"
           }, { status: 404 });
       }
       
        if (fetchCurrentUser.role !== 'admin') {
            return NextResponse.json({
                message: "Only Admin is allowed to this route"
            }, { status: 403 })
        }

        //fetch total users, projects and pings
        const totalUsers = await userModel.countDocuments();
        const totalProjects = await ProjectModel.countDocuments();
        const totalPingSends = await PingModel.countDocuments();

        //fetch all userslist
        const totalUsersData = await userModel.find({}).lean();
        const totalProjectsData = await ProjectModel.find({}).lean();

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