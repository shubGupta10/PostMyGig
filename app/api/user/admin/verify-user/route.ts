import { NextResponse, NextRequest } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function PATCH(req: NextRequest) {
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

        const { adminEmail, targetUserId, isVerified } = await req.json();

        if (!adminEmail) {
            return NextResponse.json({
                message: "Admin Email not found"
            }, { status: 400 });
        }

        if (session.user.email !== adminEmail) {
            return NextResponse.json({
                message: "Unauthorized Access"
            }, { status: 404 })
        }

        if (!targetUserId) {
            return NextResponse.json({
                message: "Target User ID is required"
            }, { status: 400 });
        }

        const fetchCurrentUser = await userModel.findOne({ email: adminEmail });
        if (!fetchCurrentUser) {
            return NextResponse.json({
                message: "Admin user not found"
            }, { status: 404 });
        }

        if (fetchCurrentUser.isAdmin !== true) {
            return NextResponse.json({
                message: "Only Admin is allowed to this route"
            }, { status: 403 });
        }

        // Admin can verify or unverify a user
        const updatedUser = await userModel.findByIdAndUpdate(
            targetUserId,
            { isVerified },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({
                message: "Target user not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            message: `User verification status updated to ${isVerified}`,
            user: {
                id: updatedUser._id,
                isVerified: updatedUser.isVerified
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Verify User Error:", error);
        return NextResponse.json({
            message: "Failed to update user verification status",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
