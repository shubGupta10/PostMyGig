export type NotificationType =
    | "ping_received"
    | "ping_accepted"
    | "ping_rejected"
    | "system_alert"

export interface INotificationItem {
    _id: string;
    recipientEmail: string;
    senderEmail?: string;
    senderName?: string;
    type: NotificationType;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export interface UserNotificationResult {
    notification: INotificationItem[];
    unreadCount: number;
    totalCount: number;
    page: number;
    totalPages: number;
}

export interface DispatchNotificationParams {
    recipientEmail: string;
    senderEmail?: string;
    senderName?: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
}