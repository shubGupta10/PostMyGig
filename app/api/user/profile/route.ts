import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user;

        const foundUser = await userModel.findOne({ email: user.email }).select("-password -__v");
        if (!foundUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User profile fetched successfully", user: foundUser }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}