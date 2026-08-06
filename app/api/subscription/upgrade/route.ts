import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/models/UserModel";
import SubscriptionModel from "@/models/SubscriptionModel";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await ConnectoDatabase();

        const { plan = "pro" } = await req.json().catch(() => ({ plan: "pro" }));

        const updatedSnapshot = {
            plan: plan as "free" | "pro",
            status: "active" as const,
            expiresAt: null,
        };

        // 1. Update user document's embedded snapshot
        const user = await userModel.findByIdAndUpdate(
            session.user.id,
            { subscriptionSnapshot: updatedSnapshot },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 2. Create or update subscription lifecycle document
        await SubscriptionModel.findOneAndUpdate(
            { userId: session.user.id },
            {
                userEmail: session.user.email,
                plan,
                status: "active",
                startDate: new Date(),
                provider: "beta",
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            message: `Successfully upgraded to ${plan.toUpperCase()} plan!`,
            subscription: updatedSnapshot,
        });
    } catch (error: any) {
        console.error("Error upgrading subscription:", error);
        return NextResponse.json(
            { message: "Failed to upgrade subscription", error: error.message },
            { status: 500 }
        );
    }
}
