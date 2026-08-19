import mongoose, { Document, Schema, Model } from "mongoose";

export interface IActivity extends Document {
  userId: string;
  gigId: string;
  type: 'posted' | 'applied' | 'hired' | 'completed';
  metadata: {
    clientName?: string;
    freelancerName?: string;
    gigTitle: string;
    skills?: string[];
    budget?: string;
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
    enum: ['posted', 'applied', 'hired', 'completed'],
    required: true,
  },
  metadata: {
    clientName: {
      type: String,
      default: '',
    },
    freelancerName: {
      type: String,
      default: '',
    },
    gigTitle: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    budget: {
      type: String,
      default: '',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>("Activity", activitySchema);
export default Activity;
