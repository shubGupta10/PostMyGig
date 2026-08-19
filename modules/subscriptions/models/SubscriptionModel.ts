import { SubscriptionPlan, SubscriptionProvider, SubscriptionStatus } from "@/modules/subscriptions/services/types";
import mongoose, { Model, Schema } from "mongoose";

export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId;
    userEmail: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startDate: Date;
    endDate?: Date;
    provider: SubscriptionProvider;
    providerSubscriptionId?: string;
    cancelAtPeriodEnd: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        userEmail: {
            type: String,
            required: true,
            index: true
        },
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free",
            required: true
        },
        status: {
            type: String,
            enum: ["active", "canceled", "past_due", "expired"],
            default: "active",
            required: true
        },
        startDate: {
            type: Date,
            default: Date.now(),
        },
        endDate: {
            type: Date,
            default: null,
        },
        provider: {
            type: String,
            enum: ["stripe", "razorpay"],
            default: "beta",
        },
        providerSubscriptionId: {
            type: String,
            default: '',
        },
        cancelAtPeriodEnd: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

const SubscriptionModel: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", subscriptionSchema)

export default SubscriptionModel;