import { NextResponse, NextRequest } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/modules/users/models/UserModel";
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

        const { adminEmail, targetUserId, action } = await req.json();

        if (!adminEmail || !targetUserId || !action) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
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

        let updateData: any = {};
        if (action === 'approve') {
            updateData = { verificationStatus: 'approved', isVerified: true };
        } else if (action === 'reject') {
            updateData = { verificationStatus: 'rejected', isVerified: false };
        } else {
            return NextResponse.json({ message: "Invalid action" }, { status: 400 });
        }

        const targetUser = await userModel.findByIdAndUpdate(
            targetUserId,
            { $set: updateData },
            { new: true }
        );

        if (!targetUser) {
            return NextResponse.json({ message: "Target user not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: `User verification ${action}d successfully`,
            user: targetUser
        }, { status: 200 });

    } catch (error) {
        console.error("resolve-verification error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
