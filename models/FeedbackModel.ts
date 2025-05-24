import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Feedback extends Document {
    name: string;
    email: string;
    feedback: string;
    feedbackType: string;
    submittedAt?: Date;
}

const feedbackSchema = new Schema<Feedback>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        feedback: {
            type: String,
            required: true,
            trim: true,
        },
        feedbackType: {
            type: String,
            required: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const FeedbackModel: Model<Feedback> =
    mongoose.models.Feedback || mongoose.model<Feedback>('Feedback', feedbackSchema);

export default FeedbackModel;
