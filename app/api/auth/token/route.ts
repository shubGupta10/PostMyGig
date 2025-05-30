import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken"; 

const secret = process.env.NEXTAUTH_SECRET as string;

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({
            message: "No session found"
        }, { status: 401 });
    }

    const payload = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        provider: session.user.provider,
    };

    const customToken = jwt.sign(payload, secret, {
        expiresIn: "7d" 
    });

    return NextResponse.json({
        token: customToken
    }, { status: 200 });
}
