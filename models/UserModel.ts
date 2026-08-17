import { SubscriptionSnapshot } from '@/lib/subscription/types';
import mongoose, { Model, Schema, Document } from 'mongoose';

interface ContactLinks {
  label: string;
  url: string;
}

interface User extends Document {
  name: string;
  email: string;
  role?: string;
  onboardingCompleted: boolean;
  password?: string;
  profilePhoto?: string;
  provider: string;
  bio?: string;
  skills?: string[];
  location?: string;
  contactLinks?: ContactLinks[];
  reportCount?: number;
  activityPublic?: boolean;
  showEmail?: boolean;
  showContactLinks?: boolean;
  isBanned?: boolean;
  isVerified?: boolean;
  verificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  isAdmin?: boolean;
  subscriptionSnapshot?: SubscriptionSnapshot;
  createdAt?: string;
  updatedAt?: string;
  portfolioProjects?: PortfolioProject[];
}

export interface PortfolioProject {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['freelancer', 'client', 'admin'],
    required: false,
    default: "freelancer"
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: false,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', "github"],
  },
  bio: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    default: ''
  },
  contactLinks: {
    type: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],
    default: []
  },
  reportCount: {
    type: Number,
    default: 0
  },
  activityPublic: {
    type: Boolean,
    default: true
  },
  showEmail: {
    type: Boolean,
    default: false
  },
  showContactLinks: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  subscriptionSnapshot: {
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "expired"],
      default: "active"
    },
    expiresAt: {
      type: String,
      default: null,
    },
  },
  portfolioProjects: {
    type: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        tags: { type: [String], default: [] },
        liveUrl: { type: String, default: "" },
        githubUrl: { type: String, default: "" },
      }
    ],
    default: []
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
});

const userModel: Model<User> =
  mongoose.models.User || mongoose.model<User>('User', userSchema);

export default userModel;
