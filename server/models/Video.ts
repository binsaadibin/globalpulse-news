import mongoose from 'mongoose';

export interface IVideo extends mongoose.Document {
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
  platform: string;
  videoUrl: string;
  status: 'published' | 'draft';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ur: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ur: { type: String, required: true },
  },
  platform: {
    type: String,
    required: true,
    enum: ['youtube', 'facebook', 'tiktok', 'instagram'],
  },
  videoUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export const Video = mongoose.model<IVideo>('Video', videoSchema);