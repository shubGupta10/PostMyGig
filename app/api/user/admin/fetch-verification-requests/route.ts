import { NextResponse, NextRequest } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/modules/users/models/UserModel";
import ProjectModel from "@/modules/gigs/models/ProjectModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function POST(req: NextRequest) {
    try {
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
        await ConnectoDatabase();

        const { adminEmail } = await req.json();

        if (!adminEmail) {
            return NextResponse.json({ message: "Admin Email not found" }, { status: 400 });
        }

        if (session.user.email !== adminEmail) {
            return NextResponse.json({
                message: "Unauthorized Access"
            }, { status: 404 })
        }

        const fetchCurrentUser = await userModel.findOne({ email: adminEmail });

        if (!fetchCurrentUser) {
            return NextResponse.json({ message: "User Not Found" }, { status: 404 });
        }

        if (fetchCurrentUser.isAdmin !== true) {
            return NextResponse.json({ message: "Only Admin is allowed to this route" }, { status: 403 });
        }

        // Fetch users with verificationStatus === 'pending'
        const pendingUsers = await userModel.find({ verificationStatus: 'pending' }).select("name email role profilePhoto isVerified verificationStatus");

        // For each user, fetch their completed gigs to display in the admin panel
        const usersWithGigs = await Promise.all(pendingUsers.map(async (user) => {
            let completedGigs = [];
            if (user.role === 'client') {
                completedGigs = await ProjectModel.find({ createdBy: user.email, status: 'completed' });
            } else {
                completedGigs = await ProjectModel.find({ AcceptedFreelancerEmail: user.email, status: 'completed' });
            }
            return {
                ...user.toObject(),
                completedGigs
            };
        }));

        return NextResponse.json({
            users: usersWithGigs
        }, { status: 200 });

    } catch (error) {
        console.error("fetch-verification-requests error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
