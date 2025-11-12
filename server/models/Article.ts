import mongoose from 'mongoose';

export interface IArticle extends mongoose.Document {
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
  category: string;
  imageUrl: string;
  status: 'published' | 'draft';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['technology', 'business', 'sports', 'politics', 'environment', 'health'],
  },
  imageUrl: {
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

export const Article = mongoose.model<IArticle>('Article', articleSchema);