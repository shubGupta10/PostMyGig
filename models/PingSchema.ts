import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Ping extends Document {
  projectId: string;
  userEmail: string;
  posterEmail: string;
  message?: string;
  bestWorkLink?: string;
  status: string;
  bestWorkDescription?: string;
  createdAt?: Date;
}

const pingSchema = new Schema<Ping>(
  {
    projectId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    posterEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    bestWorkLink: {
      type: String,
      default: '',
    },
    bestWorkDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

pingSchema.index({ projectId: 1, userEmail: 1 })
pingSchema.index({ posterEmail: 1 })
pingSchema.index({ status: 1 })
pingSchema.index({ userEmail: 1, createdAt: -1 })
pingSchema.index({ projectId: 1, status: 1 })

const PingModel: Model<Ping> =
  mongoose.models.Ping || mongoose.model<Ping>('Ping', pingSchema);

export default PingModel;
