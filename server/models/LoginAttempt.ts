import mongoose, { Document, Schema } from 'mongoose';

export interface ILoginAttempt extends Document {
  username: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  reason?: string;
  timestamp: Date;
}

const loginAttemptSchema = new Schema<ILoginAttempt>({
  username: String,
  ipAddress: String,
  userAgent: String,
  success: Boolean,
  reason: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete records after 30 days
loginAttemptSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model<ILoginAttempt>('LoginAttempt', loginAttemptSchema);