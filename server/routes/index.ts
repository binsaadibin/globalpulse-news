import { Express } from 'express';
import authRoutes from './auth.js';
import articleRoutes from './articles.js';
import videoRoutes from './videos.js';
import searchRoutes from './search.js';
import adminRoutes from './admin.js';

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/articles', articleRoutes);
  app.use('/api/videos', videoRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/admin', adminRoutes);
};