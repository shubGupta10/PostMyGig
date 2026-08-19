import { NextResponse, type NextRequest, after } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/modules/users/models/UserModel";
import SubscriptionModel from "@/modules/subscriptions/models/SubscriptionModel";
import { dispatchNotification } from "@/modules/notifications/services/dispatcher";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    let dbSession;
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

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        // 1. Update user document's embedded snapshot
        const user = await userModel.findByIdAndUpdate(
            session.user.id,
            { subscriptionSnapshot: updatedSnapshot },
            { new: true },
        ).session(dbSession);

        if (!user) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
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
            { upsert: true, new: true },
        ).session(dbSession);

        await dbSession.commitTransaction();
        await dbSession.endSession();

        // 3. Dispatch system alert in-app notification
        after(async () => {
            await dispatchNotification({
                recipientEmail: session.user.email!,
                type: "system_alert",
                title: "Plan Upgraded!",
                message: `Welcome to PostMyGig ${plan.toUpperCase()} plan. You now have higher monthly gig and pitch quotas.`,
                link: "/dashboard",
            });
        });

        return NextResponse.json({
            message: `Successfully upgraded to ${plan.toUpperCase()} plan!`,
            subscription: updatedSnapshot,
        });
    } catch (error: any) {
        if (dbSession) {
            await dbSession.abortTransaction();
            await dbSession.endSession();
        }
        console.error("Error upgrading subscription:", error);
        return NextResponse.json(
            { message: "Failed to upgrade subscription", error: error.message },
            { status: 500 }
        );
    }
}
