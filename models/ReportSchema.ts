import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Report extends Document {
  reportedBy: mongoose.Types.ObjectId;
  reportedUser?: mongoose.Types.ObjectId;
  reportedProject?: mongoose.Types.ObjectId;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt?: Date;
  updatedAt?: Date;
}

const reportSchema = new Schema<Report>(
  {
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    reportedProject: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: false,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const ReportModel: Model<Report> =
  mongoose.models.Report || mongoose.model<Report>('Report', reportSchema);

export default ReportModel;
