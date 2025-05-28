import { NextResponse, NextRequest } from "next/server";
import userModel from "@/models/UserModel";
import redis from "@/lib/redis";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
    try {
        const { token, password } = await req.json();
        if (!token || !password) {
            return NextResponse.json({
                message: "Unauthenticated, token not found"
            }, { status: 404 })
        }

        const cache = await redis.get(`reset-password:${token}`) as { userEmail: string };

        if (!cache || typeof cache !== "object") {
            return NextResponse.json({
                message: "Verification token expired or not found",
            }, { status: 400 });
        }

        const { userEmail } = cache;
        if (!userEmail) {
            return NextResponse.json(
                { message: "Invalid token payload" },
                { status: 400 }
            );
        }

        //find user
        const foundUser = await userModel.findOne({ email: userEmail });
        if (!foundUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        foundUser.password = hashedPassword;
        await foundUser.save();

        //cleanup the redis
        await redis.del(`reset-password:${token}`);

        return NextResponse.json({
            message: "Password reset successfull"
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}