import mongoose, { Model, Schema, Document } from 'mongoose';

interface ContactLinks {
  label: string;
  url: string;
}

interface User extends Document {
  name: string;
  email: string;
  role?: string;
  password?: string;
  profilePhoto?: string;
  provider: string;
  bio?: string;
  skills?: string[];
  location?: string;
  contactLinks?: ContactLinks[];
  reportCount?: number;
  activityPublic?: boolean;
  isBanned?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  isBanned: {
    type: Boolean,
    default: false
  },
  activityPublic: {
    type: Boolean,
    default: true,
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
