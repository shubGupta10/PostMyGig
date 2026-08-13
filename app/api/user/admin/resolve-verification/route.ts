import { NextResponse, NextRequest } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/models/UserModel";

export async function PATCH(req: NextRequest) {
    try {
        await ConnectoDatabase();
        
        const { adminEmail, targetUserId, action } = await req.json();

        if (!adminEmail || !targetUserId || !action) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
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
