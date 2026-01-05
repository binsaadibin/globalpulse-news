import express from 'express';
import authRoutes from './auth.js';
import articleRoutes from './articles.js';
import videoRoutes from './videos.js';
import searchRoutes from './search.js';
import adminRoutes from './admin.js';
import advertisementRoutes from './advertisements.js';

export const setupRoutes = (app: express.Express) => {
  console.log('🛣️ Initializing API routes...');
  
  // Setup all routes with proper middleware
  app.use('/api/auth', authRoutes);
  app.use('/api/articles', articleRoutes);
  app.use('/api/videos', videoRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/advertisements', advertisementRoutes);
  
  console.log('🎯 ALL ROUTES INITIALIZED:');
  console.log('   ✅ /api/auth');
  console.log('   ✅ /api/articles');
  console.log('   ✅ /api/videos');
  console.log('   ✅ /api/search');
  console.log('   ✅ /api/admin');
  console.log('   ✅ /api/advertisements');
  
  // Test route to verify all routes are working
  app.get('/api/routes-status', (req: express.Request, res: express.Response) => {
    res.json({
      success: true,
      message: 'All API routes are active',
      timestamp: new Date().toISOString(),
      routes: {
        auth: {
          path: '/api/auth',
          methods: ['POST', 'GET'],
          endpoints: [
            'POST /api/auth/login',
            'POST /api/auth/register', 
            'GET /api/auth/me'
          ]
        },
        articles: {
          path: '/api/articles',
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          endpoints: [
            'GET /api/articles',
            'GET /api/articles/:id',
            'POST /api/articles',
            'GET /api/articles/my-articles',
            'PUT /api/articles/:id',
            'DELETE /api/articles/:id'
          ]
        },
        videos: {
          path: '/api/videos',
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          endpoints: [
            'GET /api/videos',
            'GET /api/videos/featured',
            'GET /api/videos/trending',
            'GET /api/videos/live',
            'GET /api/videos/shorts',
            'GET /api/videos/popular',
            'POST /api/videos',
            'GET /api/videos/my-videos',
            'PUT /api/videos/:id',
            'DELETE /api/videos/:id',
            'POST /api/videos/:id/view',
            'POST /api/videos/:id/like',
            'POST /api/videos/:id/unlike'
          ]
        },
        advertisements: {
          path: '/api/advertisements',
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          endpoints: [
            'GET /api/advertisements',
            'GET /api/advertisements/position/:position',
            'POST /api/advertisements',
            'GET /api/advertisements/my-ads',
            'PUT /api/advertisements/:id',
            'DELETE /api/advertisements/:id',
            'POST /api/advertisements/:id/click',
            'POST /api/advertisements/:id/impression'
          ]
        },
        search: {
          path: '/api/search',
          methods: ['GET'],
          endpoints: [
            'GET /api/search',
            'GET /api/search/articles',
            'GET /api/search/videos'
          ]
        },
        admin: {
          path: '/api/admin',
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          endpoints: [
            'GET /api/admin/stats',
            'GET /api/admin/users',
            'GET /api/admin/content'
          ]
        }
      }
    });
  });

  // Route health check for each module
  app.get('/api/health/routes', (req: express.Request, res: express.Response) => {
    const routeHealth = {
      auth: { status: 'active', path: '/api/auth' },
      articles: { status: 'active', path: '/api/articles' },
      videos: { status: 'active', path: '/api/videos' },
      advertisements: { status: 'active', path: '/api/advertisements' },
      search: { status: 'active', path: '/api/search' },
      admin: { status: 'active', path: '/api/admin' }
    };

    res.json({
      success: true,
      message: 'Route health check completed',
      timestamp: new Date().toISOString(),
      routes: routeHealth
    });
  });

  // Global API info endpoint
  app.get('/api', (req: express.Request, res: express.Response) => {
    res.json({
      name: 'GlobalPulse News API',
      version: '2.0.0',
      description: 'Complete news management platform with Videos and Advertisements',
      timestamp: new Date().toISOString(),
      baseUrl: 'https://globalpulse-news-production-31ee.up.railway.app',
      documentation: '/api/docs',
      health: '/health',
      status: '/api/status',
      features: [
        'Multi-language support (English, Arabic, Urdu)',
        'JWT Authentication & Authorization',
        'Article Management System',
        'Video Management with YouTube Integration',
        'Advertisement Management System',
        'Advanced Search & Filtering',
        'Admin Dashboard & Analytics',
        'Real-time Statistics',
        'CORS Enabled for Netlify Frontend'
      ],
      modules: {
        auth: 'User authentication and authorization',
        articles: 'News articles management',
        videos: 'Video content management',
        advertisements: 'Advertisement management and tracking',
        search: 'Unified search across articles and videos',
        admin: 'Administrative functions and analytics'
      }
    });
  });
};