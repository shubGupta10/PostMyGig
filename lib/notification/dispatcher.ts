import { DispatchNotificationParams, UserNotificationResult } from "@/components/notification/types/notification";
import { ConnectoDatabase } from "../db";
import NotificationModel from "@/models/NotificationModel";
import redis from "../redis";

const getRedisUnreadKey = (email: string) => `unread-notification:${email}`

export async function dispatchNotification(params: DispatchNotificationParams) {
    try {
        await ConnectoDatabase();

        const notification = await NotificationModel.create({
            recipientEmail: params.recipientEmail,
            senderEmail: params.senderEmail!,
            senderName: params.senderName!,
            type: params.type,
            title: params.title,
            message: params.message,
            link: params.link!,
            isRead: false,
        });

        const redisKey = getRedisUnreadKey(params.recipientEmail);

        try {
            await redis.incr(redisKey);
        } catch (error) {
            console.warn("Failed to increment Redis notification cache:", error);
        }

        return notification;
    } catch (error) {
        console.error("Error dispatching notification:", error);
        return null;
    }
}

export async function getUserNotifications(
    recipientEmail: string,
    page: number = 1,
    limit: number = 10,
): Promise<UserNotificationResult> {
    await ConnectoDatabase();

    const skip = (page - 1) * limit;

    const [rawNotification, totalCount, unreadCountFromDb] = await Promise.all([
        NotificationModel.find({ recipientEmail })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        NotificationModel.countDocuments({
            recipientEmail
        }),
        NotificationModel.countDocuments({
            recipientEmail, isRead: false
        })
    ]);

    const redisKey = getRedisUnreadKey(recipientEmail);

    try {
        await redis.set(redisKey, unreadCountFromDb.toString());
    } catch (error) {
        console.warn("Failed to sync Redis notification count:", error);
    }

    const notifications = rawNotification.map((n: any) => ({
        _id: n._id.toString(),
        recipientEmail: n.recipientEmail,
        senderEmail: n.senderEmail,
        senderName: n.senderName,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        isRead: n.isRead,
        createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString(),
    }));

    return {
        notification: notifications,
        unreadCount: unreadCountFromDb,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit) || 1,
    };
}

export async function markNotificationAsRead(notificationId: string,
    recipientEmail: string) {

    await ConnectoDatabase();

    const updated = await NotificationModel.findOneAndUpdate(
        { _id: notificationId, recipientEmail },
        { isRead: true },
        { new: true }
    )

    if (updated) {
        const unreadCount = await NotificationModel.countDocuments({
            recipientEmail, isRead: false
        });


        const redisKey = getRedisUnreadKey(recipientEmail);

        try {
            await redis.set(redisKey, unreadCount.toString());
        } catch (error) {
            console.warn("Failed to update Redis unread count:", error);
        }
    }
}

export async function markAllNotificationsAsRead(recipientEmail: string) {
    await ConnectoDatabase();

    await NotificationModel.updateMany(
        { recipientEmail, isRead: false },
        { isRead: true }
    )

    const redisKey = getRedisUnreadKey(recipientEmail);

    try {
        await redis.set(redisKey, "0");
    } catch (error) {
        console.warn("Failed to reset Redis unread count:", error);
    }
}