import { ConnectoDatabase } from "@/lib/db";
import { authOptions } from "@/lib/options";
import userModel from "@/modules/users/models/UserModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return NextResponse.json({
                message: "Unauhorized"
            }, { status: 401 })
        }

        const { role } = await req.json();
        if (!role || (role !== "client" && role !== "freelancer")) {
            return NextResponse.json({ message: "Invalid role selected" }, { status: 400 });
        }

        await ConnectoDatabase();

        const updatedUser = await userModel.findByIdAndUpdate(
            session.user.id,
            {
                role,
                onboardingCompleted: true,
                updatedAt: new Date().toISOString(),
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            mesage: "Onboarding Completed",
            user: updatedUser
        }, { status: 200 })
    } catch (error) {
        console.error("Error during onboarding:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}