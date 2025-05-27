import { NextResponse, NextRequest } from "next/server";
import { ConnectoDatabase } from "@/lib/db";
import redis from "@/lib/redis";
import userModel from "@/models/UserModel";

export async function POST(req: NextRequest) {
    try {
        await ConnectoDatabase();

        const { userId, code } = await req.json();

        if (!userId || !code) {
            return NextResponse.json({
                message: "User ID and code are required",
            }, { status: 400 });
        }

        const cache = await redis.get(`verify:${userId}`) as { code: string; user: any };

        if (!cache || typeof cache !== "object" || !cache.code || !cache.user) {
            return NextResponse.json({
                message: "Verification code expired or not found",
            }, { status: 400 });
        }

        const { code: storedCode, user } = cache;

        if (code !== storedCode) {
            return NextResponse.json({
                message: "Invalid verification code",
            }, { status: 400 });
        }

        await userModel.create(user);
        await redis.del(`verify:${userId}`);

        return NextResponse.json({
            message: "User created successfully",
        }, { status: 201 });


    } catch (error) {
        return NextResponse.json({
            message: "Internal server error",
        }, { status: 500 });
    }
}
