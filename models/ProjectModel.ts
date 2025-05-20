import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ContactInfo {
  email?: string;
  whatsapp?: string;
  x?: string;
}

export interface Project extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  skillsRequired?: string[];
  contact?: ContactInfo;
  status: 'active' | 'archived' | 'expired' | 'completed';
  expiresAt?: Date;
  reportCount: number;
  isFlagged: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<Project>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    contact: {
      email: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      x: { type: String, default: '' }
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'expired', 'completed'],
      default: 'active',
    },
    expiresAt: {
      type: Date,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel: Model<Project> =
  mongoose.models.Project || mongoose.model<Project>('Project', projectSchema);

export default ProjectModel;
