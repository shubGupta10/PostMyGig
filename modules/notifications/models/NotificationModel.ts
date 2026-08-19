import { NotificationType } from '@/modules/notifications/components/types/notification';
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotificationDocument extends Document {
    recipientEmail: string;
    senderEmail?: string;
    senderName?: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
    {
        recipientEmail: {
            type: String,
            required: true,
            index: true,
        },
        senderEmail: {
            type: String,
            default: '',
        },
        senderName: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            enum: ['ping_received', 'ping_accepted', 'ping_rejected', 'system_alert'],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            default: '',
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ recipientEmail: 1, isRead: 1, createdAt: -1 });

const NotificationModel: Model<INotificationDocument> =
    mongoose.models.Notification || mongoose.model<INotificationDocument>('Notification', notificationSchema);

export default NotificationModel;
