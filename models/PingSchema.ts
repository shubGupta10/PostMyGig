import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Ping extends Document {
  projectId: string;
  userEmail: string;
  posterEmail: string;
  message?: string;
  bestWorkLink?: string;
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

const PingModel: Model<Ping> =
  mongoose.models.Ping || mongoose.model<Ping>('Ping', pingSchema);

export default PingModel;
