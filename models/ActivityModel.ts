import mongoose, { Document, Schema, Model } from "mongoose";

export interface IActivity extends Document {
  userId: string;
  gigId: string;
  type: string;
  metadata: {
    FullName: string;
    gigTitle: string;
  };
  createdAt: Date;
}

const activitySchema: Schema<IActivity> = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  gigId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['posted', 'pings'],
    required: true,
  },
  metadata: {
    FullName: {
      type: String,
      required: true,
    },
    gigTitle: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 4 * 24 * 60 * 60 });

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>("Activity", activitySchema);
export default Activity;
