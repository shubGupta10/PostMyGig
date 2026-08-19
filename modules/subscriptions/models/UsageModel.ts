import mongoose, { Schema, Document, Model } from 'mongoose';
import { QuotaActionType } from '@/modules/subscriptions/services/types';

export interface IUsage extends Document {
    userId: mongoose.Types.ObjectId;
    userEmail: string;
    actionType: QuotaActionType;
    count: number;
    periodStart: Date;
    periodEnd: Date;
    createdAt: Date;
    updatedAt: Date;
}

const usageSchema = new Schema<IUsage>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        userEmail: {
            type: String,
            required: true,
            index: true,
        },
        actionType: {
            type: String,
            enum: ['gig_post', 'ping_send'],
            required: true,
        },
        count: {
            type: Number,
            default: 0,
            min: 0,
        },
        periodStart: {
            type: Date,
            required: true,
        },
        periodEnd: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


usageSchema.index({ userEmail: 1, actionType: 1, periodStart: 1 }, { unique: true });

const UsageModel: Model<IUsage> =
    mongoose.models.Usage || mongoose.model<IUsage>('Usage', usageSchema);

export default UsageModel;
