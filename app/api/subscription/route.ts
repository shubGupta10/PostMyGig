import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { getUserUsageStats } from "@/lib/subscription/engine";
import { ACTION_TYPES } from "@/lib/subscription/config/subscriptions";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user.role as "client" | "freelancer") || "freelancer";
        const actionType = role === "client" ? ACTION_TYPES.POST_GIG : ACTION_TYPES.SEND_PING;

        const stats = await getUserUsageStats(
            session.user.id,
            session.user.email,
            role,
            actionType
        );

        return NextResponse.json({
            subscription: session.user.subscription || {
                plan: "free",
                status: "active",
                expiresAt: null,
            },
            usage: stats,
        });
    } catch (error: any) {
        console.error("Error fetching subscription stats:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
