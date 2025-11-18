import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminSettings extends Document {
  settingKey: string;
  settingValue: any;
  description?: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminSettingsSchema = new Schema<IAdminSettings>({
  settingKey: {
    type: String,
    required: true,
    unique: true
  },
  settingValue: Schema.Types.Mixed,
  description: String,
  isEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IAdminSettings>('AdminSettings', adminSettingsSchema);