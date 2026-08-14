import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/models/UserModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userEmail = session.user.email;
        const body = await req.json();

        // Extract allowed fields
        const { activityPublic, showEmail, showContactLinks } = body;

        const updateData: any = {};
        if (activityPublic !== undefined) updateData.activityPublic = activityPublic;
        if (showEmail !== undefined) updateData.showEmail = showEmail;
        if (showContactLinks !== undefined) updateData.showContactLinks = showContactLinks;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "No valid fields provided" }, { status: 400 });
        }

        await ConnectoDatabase();

        const updatedUser = await userModel.findOneAndUpdate(
            { email: userEmail },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Privacy settings updated successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating privacy settings:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
