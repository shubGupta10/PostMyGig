import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Ping extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  message?: string;
  portfolioLink?: string;
  createdAt?: Date;
}

const pingSchema = new Schema<Ping>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    portfolioLink: {
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
