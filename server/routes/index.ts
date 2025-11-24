import express from 'express';
import authRoutes from './auth.js';
import articleRoutes from './articles.js';
import videoRoutes from './videos.js';
import searchRoutes from './search.js';
import adminRoutes from './admin.js';

export const setupRoutes = (app: express.Express) => {
  console.log('🛣️ Initializing API routes...');
  
  // Setup all routes
  app.use('/api/auth', authRoutes);
  app.use('/api/articles', articleRoutes);
  app.use('/api/videos', videoRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/admin', adminRoutes);
  
  console.log('🎯 ALL ROUTES INITIALIZED:');
  console.log('   ✅ /api/auth');
  console.log('   ✅ /api/articles');
  console.log('   ✅ /api/videos');
  console.log('   ✅ /api/search');
  console.log('   ✅ /api/admin');
};