import mongoose, { Schema, Document, Model } from 'mongoose';
import { Project } from '../../gigs/models/ProjectModel';

export interface ContractRevision {
  uploadedBy: string; // Email of the person who uploaded
  fileUrl: string; // UploadThing URL
  fileName: string; // E.g., 'Master_Services_Agreement_v1.pdf'
  comment?: string;
  timestamp: Date;
}

export interface Contract extends Document {
  projectId: string | mongoose.Types.ObjectId | Project;
  clientId: string; // Email
  freelancerId: string; // Email
  status: 'pending_freelancer' | 'pending_client' | 'active' | 'completed' | 'cancelled';
  revisions: ContractRevision[];
  finalContractUrl?: string; // The URL of the accepted contract
  createdAt?: Date;
  updatedAt?: Date;
}

const contractRevisionSchema = new Schema<ContractRevision>({
  uploadedBy: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  comment: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const contractSchema = new Schema<Contract>(
  {
    projectId: {
      type: Schema.Types.Mixed, // Can be String or ObjectId depending on how it's saved
      ref: 'Project',
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    freelancerId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending_freelancer', 'pending_client', 'active', 'completed', 'cancelled'],
      default: 'pending_freelancer',
    },
    revisions: {
      type: [contractRevisionSchema],
      default: [],
    },
    finalContractUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

contractSchema.index({ projectId: 1, clientId: 1, freelancerId: 1 });
contractSchema.index({ clientId: 1 });
contractSchema.index({ freelancerId: 1 });

const ContractModel: Model<Contract> =
  mongoose.models.Contract || mongoose.model<Contract>('Contract', contractSchema);

export default ContractModel;
