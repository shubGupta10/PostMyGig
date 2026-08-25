import mongoose, { Schema, Document, Model } from "mongoose";

export interface Review extends Document {
    gigId: string;
    authorId: string
    targetId: string;
    role: "client" | "freelancer"
    rating: number;
    comment: string;
    status: "hidden" | "published";
    createdAt?: Date;
    updatedAt?: Date;
}

const reviewSchema = new Schema<Review>(
    {
        gigId: {
            type: String,
            required: true
        },
        authorId: {
            type: String,
            required: true,
        },
        targetId: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['client', 'freelancer'],
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['hidden', 'published'],
            default: 'hidden',
        },
    },
    {
        timestamps: true,
    }
)

reviewSchema.index({ targetId: 1, status: 1 });
reviewSchema.index({ gigId: 1 });

const ReviewModel: Model<Review> = mongoose.models.Review || mongoose.model<Review>("Review", reviewSchema);

export default ReviewModel;