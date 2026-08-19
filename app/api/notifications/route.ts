import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "@/modules/notifications/services/dispatcher";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const result = await getUserNotifications(session.user.email, page, limit);

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { message: "Failed to fetch notifications", error: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { notificationId, markAll } = body;

        if (markAll) {
            await markAllNotificationsAsRead(session.user.email);
            return NextResponse.json(
                { message: "All notifications marked as read" },
                { status: 200 }
            );
        }

        if (!notificationId) {
            return NextResponse.json(
                { message: "Notification ID is required" },
                { status: 400 }
            );
        }

        const updated = await markNotificationAsRead(notificationId, session.user.email);

        return NextResponse.json(
            { message: "Notification marked as read", notification: updated },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating notification:", error);
        return NextResponse.json(
            { message: "Failed to update notification", error: error.message },
            { status: 500 }
        );
    }
}
