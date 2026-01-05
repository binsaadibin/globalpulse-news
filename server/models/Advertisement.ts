import mongoose, { Document, Schema } from 'mongoose';

export interface IAdvertisement extends Document {
  title: {
    en: string;
    ar: string;
    ur: string;
  };
  description: {
    en: string;
    ar: string;
    ur: string;
  };
  imageUrl: string;
  url: string;
  position: 'sidebar' | 'inline';
  ctaText: {
    en: string;
    ar: string;
    ur: string;
  };
  sponsor: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  priority: number;
  clicks: number;
  impressions: number;
  createdBy: mongoose.Types.ObjectId;
  createdByUsername: string;
  createdAt: Date;
  updatedAt: Date;
}

const advertisementSchema = new Schema<IAdvertisement>({
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ur: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ur: { type: String, required: true }
  },
  imageUrl: { type: String, required: true },
  url: { type: String, required: true },
  position: {
    type: String,
    enum: ['sidebar', 'inline'],
    required: true
  },
  ctaText: {
    en: { type: String, default: 'Learn More' },
    ar: { type: String, default: 'تعرف أكثر' },
    ur: { type: String, default: 'مزید جانیں' }
  },
  sponsor: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  priority: { type: Number, default: 1 },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdByUsername: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add indexes
advertisementSchema.index({ isActive: 1, position: 1 });
advertisementSchema.index({ startDate: 1, endDate: 1 });
advertisementSchema.index({ createdBy: 1 });

export default mongoose.model<IAdvertisement>('Advertisement', advertisementSchema);