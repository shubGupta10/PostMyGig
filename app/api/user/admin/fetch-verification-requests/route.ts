import { NextResponse, NextRequest } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/models/UserModel";
import ProjectModel from "@/models/ProjectModel";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        
        const { adminEmail } = await req.json();

        if (!adminEmail) {
            return NextResponse.json({ message: "Admin Email not found" }, { status: 400 });
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
