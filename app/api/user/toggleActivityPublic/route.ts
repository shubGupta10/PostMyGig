import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { ConnectoDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();
        const { activityPublic } = await req.json();

        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        if (!userEmail) {
            return NextResponse.json({
                message: "User Email not found"
            }, { status: 404 })
        }

        const user = await userModel.findOne({ email: userEmail }).lean();
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 400 })
        }

        user.activityPublic = activityPublic;
        await userModel.findOneAndUpdate({ email: userEmail }, { activityPublic });

        return NextResponse.json({
            message: "Activity Toggle Turned"
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
}
