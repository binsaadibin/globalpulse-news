import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  isApproved: boolean;
  permissions: string[];
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
  };
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true // Remove duplicate schema.index() calls
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true // Remove duplicate schema.index() calls
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  permissions: [{
    type: String,
    enum: ['create_articles', 'edit_articles', 'delete_articles', 'create_videos', 'edit_videos', 'delete_videos', 'manage_users']
  }],
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true
});

// Remove these duplicate index definitions to fix the warning
// userSchema.index({ username: 1 });
// userSchema.index({ email: 1 });
userSchema.index({ isActive: 1, isApproved: 1 });

export default mongoose.model<IUser>('User', userSchema);