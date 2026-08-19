import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ContactInfo {
  email?: string;
  whatsapp?: string;
  x?: string;
}

export interface Project extends Document {
  title: string;
  description: string;
  createdBy: string;
  skillsRequired?: string[];
  contact?: ContactInfo;
  budget: string;
  displayContactLinks: boolean;
  AcceptedFreelancerEmail?: string;
  status: 'active' | 'assigned' | 'expired' | 'completed' | "rejected";
  expiresAt?: Date;
  reportCount: number;
  isFlagged: boolean;
  isCurated?: boolean;
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
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
      min: 0,
    },
    AcceptedFreelancerEmail: {
      type: String,
      default: '',
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
    displayContactLinks: {
      type: Boolean,
      default: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'assigned', 'expired', 'completed', 'rejected'],
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
    isCurated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ status: 1, createdAt: -1 })
projectSchema.index({ createdBy: 1 })
projectSchema.index({ expiresAt: 1 })
projectSchema.index({ isCurated: 1 })

const ProjectModel: Model<Project> =
  mongoose.models.Project || mongoose.model<Project>('Project', projectSchema);

export default ProjectModel;
