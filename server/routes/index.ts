import express from 'express';
import authRoutes from './auth.js';
import articleRoutes from './articles.js';
import videoRoutes from './videos.js';
import searchRoutes from './search.js';
import adminRoutes from './admin.js';

export const setupRoutes = (app: express.Express) => {
  // Test route to verify setup
  app.get('/api/test-routes', (req, res) => {
    const routes = [
      { path: '/api/auth', methods: ['GET', 'POST'] },
      { path: '/api/articles', methods: ['GET', 'POST'] },
      { path: '/api/articles/my-articles', methods: ['GET'] },
      { path: '/api/videos', methods: ['GET', 'POST'] },
      { path: '/api/videos/my-videos', methods: ['GET'] }
    ];
    res.json({ 
      success: true, 
      message: 'Routes are set up',
      routes: routes 
    });
  });

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
  console.log('   ✅ /api/test-routes');
};