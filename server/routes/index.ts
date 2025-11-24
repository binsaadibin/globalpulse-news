import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB, healthCheckDB } from './db/connection.js';
import { setupRoutes } from './routes/index.js';
import { apiRateLimit } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { authenticateToken } from './middleware/auth.js';

console.log('🚀 GlobalPulse News API Server Starting...');

const app = express();

// ========================
// SECURITY MIDDLEWARE
// ========================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));

// ========================
// PERFORMANCE MIDDLEWARE
// ========================
app.use(compression());

// ========================
// REQUEST LOGGING
// ========================
app.use(requestLogger);

// ========================
// BODY PARSING
// ========================
app.use(express.json({ 
  limit: '10mb',
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// ========================
// CORS CONFIGURATION - FIXED
// ========================
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://globalpulse-news-production-31ee.up.railway.app',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
  exposedHeaders: ['X-Response-Time', 'X-Powered-By']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ========================
// RATE LIMITING
// ========================
app.use(apiRateLimit);

// ========================
// HEALTH CHECK & STATUS
// ========================
app.get('/health', async (req: Request, res: Response) => {
  const dbHealth = await healthCheckDB();
  const healthInfo = {
    status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    service: 'GlobalPulse News API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: dbHealth,
    nodeVersion: process.version,
  };

  const statusCode = healthInfo.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthInfo);
});

app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    service: 'GlobalPulse News API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      articles: '/api/articles',
      videos: '/api/videos',
      admin: '/api/admin',
      search: '/api/search'
    },
    documentation: '/api/docs'
  });
});

// ========================
// API DOCUMENTATION
// ========================
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    name: 'GlobalPulse News API',
    version: '1.0.0',
    description: 'Complete news management platform API',
    baseUrl: 'https://globalpulse-news-production-31ee.up.railway.app',
    authentication: 'JWT Bearer Token',
    endpoints: {
      health: {
        'GET /health': 'Health check and system status'
      },
      auth: {
        'POST /api/auth/login': 'User authentication',
        'POST /api/auth/register': 'User registration',
        'GET /api/auth/me': 'Get current user profile'
      },
      articles: {
        'GET /api/articles': 'Get published articles',
        'GET /api/articles/:id': 'Get article by ID',
        'POST /api/articles': 'Create article (Authenticated)',
        'GET /api/articles/my-articles': 'Get user articles (Authenticated)',
        'PUT /api/articles/:id': 'Update article (Authenticated)',
        'DELETE /api/articles/:id': 'Delete article (Authenticated)',
        'POST /api/articles/:id/like': 'Like article',
        'POST /api/articles/:id/unlike': 'Unlike article',
        'POST /api/articles/:id/comments': 'Add comment to article'
      },
      videos: {
        'GET /api/videos': 'Get published videos',
        'GET /api/videos/:id': 'Get video by ID',
        'POST /api/videos': 'Create video (Authenticated)',
        'GET /api/videos/my-videos': 'Get user videos (Authenticated)'
      },
      admin: {
        'GET /api/admin/users': 'Get all users (Admin only)',
        'POST /api/admin/users': 'Create user (Admin only)',
        'PUT /api/admin/users/:id': 'Update user (Admin only)',
        'DELETE /api/admin/users/:id': 'Delete user (Admin only)',
        'GET /api/admin/stats': 'Get system statistics (Admin only)'
      }
    }
  });
});

// ========================
// DEBUG ENDPOINTS - ADD THESE
// ========================
app.get('/api/debug/my-articles', authenticateToken, (req: Request, res: Response) => {
  console.log('🔧 DEBUG: /api/articles/my-articles route check');
  console.log('👤 Authenticated User:', req.user);
  
  res.json({
    success: true,
    message: 'My articles endpoint is accessible!',
    user: req.user,
    timestamp: new Date().toISOString(),
    endpoints: {
      'GET /api/articles/my-articles': 'Get user articles (Authenticated)',
      'GET /api/articles': 'Get all published articles',
      'POST /api/articles': 'Create new article (Authenticated)'
    }
  });
});

app.get('/api/debug/routes', (req: Request, res: Response) => {
  const routes: any[] = [];
  
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      // Routes registered directly on app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Routes registered via router
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods),
            router: true
          });
        }
      });
    }
  });

  res.json({
    success: true,
    message: 'Available API routes',
    totalRoutes: routes.length,
    routes: routes
  });
});

// ========================
// TEST ENDPOINTS
// ========================
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'GlobalPulse News API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test/auth', authenticateToken, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Authentication is working!',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// ========================
// ROOT ENDPOINT
// ========================
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'GlobalPulse News API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: '/api/docs',
    health: '/health',
    statusEndpoint: '/api/status',
    debug: '/api/debug/routes'
  });
});

// ========================
// API ROUTES
// ========================
console.log('🛣️ Initializing API routes...');
setupRoutes(app);
console.log('✅ API routes initialized');

// ========================
// ERROR HANDLING
// ========================
app.use(errorHandler);

// ========================
// 404 HANDLER
// ========================
app.use('*', (req: Request, res: Response) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    documentation: '/api/docs',
    availableEndpoints: [
      'GET /health',
      'GET /api/status',
      'GET /api/docs',
      'GET /api/debug/routes',
      'GET /api/articles',
      'GET /api/articles/my-articles (Authenticated)',
      'POST /api/articles (Authenticated)',
      'GET /api/videos',
      'GET /api/videos/my-videos (Authenticated)',
      'POST /api/videos (Authenticated)',
      'GET /api/admin/users (Admin only)'
    ]
  });
});

// ========================
// SERVER INITIALIZATION
// ========================
const httpServer = createServer(app);

class ServerManager {
  private isShuttingDown = false;

  async start(): Promise<void> {
    const port = this.getPort();
    
    console.log('🔧 Server Configuration:');
    console.log(`   Port: ${port}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Node Version: ${process.version}`);
    console.log(`   Platform: ${process.platform}/${process.arch}`);
    console.log(`   Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);

    try {
      await this.initializeDatabase();
      await this.startHttpServer(port);
      this.setupGracefulShutdown();
    } catch (error) {
      console.error('💥 Server startup failed:', error);
      process.exit(1);
    }
  }

  private getPort(): number {
    return process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  }

  private async initializeDatabase(): Promise<void> {
    console.log('🔗 Connecting to MongoDB...');
    try {
      await connectDB();
      console.log('✅ MongoDB connected successfully');
      
      // Test database connection
      const dbHealth = await healthCheckDB();
      console.log(`📊 Database health: ${dbHealth.status}`);
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  private async startHttpServer(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      httpServer.listen(port, "0.0.0.0", () => {
        this.logStartupSuccess(port);
        resolve();
      });

      httpServer.on('error', (error: Error) => {
        console.error('❌ HTTP server error:', error);
        reject(error);
      });
    });
  }

  private logStartupSuccess(port: number): void {
    console.log('');
    console.log('🎉 SERVER STARTED SUCCESSFULLY!');
    console.log('=' .repeat(50));
    console.log(`✅ Server running on port ${port}`);
    console.log(`✅ Health: http://localhost:${port}/health`);
    console.log(`✅ API Status: http://localhost:${port}/api/status`);
    console.log(`✅ API Docs: http://localhost:${port}/api/docs`);
    console.log(`✅ Debug Routes: http://localhost:${port}/api/debug/routes`);
    console.log(`✅ Test Auth: http://localhost:${port}/api/test/auth`);
    console.log('');
    console.log('📊 System Status:');
    console.log('   Database: Connected');
    console.log('   Authentication: JWT Enabled');
    console.log('   Rate Limiting: Active');
    console.log('   CORS: Configured');
    console.log('   Security: Helmet Enabled');
    console.log('   Compression: Active');
    console.log('   Logging: Comprehensive');
    console.log('');
    console.log('🔑 Key Endpoints:');
    console.log('   GET  /api/articles - Public articles');
    console.log('   GET  /api/articles/my-articles - User articles (Auth)');
    console.log('   POST /api/articles - Create article (Auth)');
    console.log('   GET  /api/videos - Public videos');
    console.log('   GET  /api/videos/my-videos - User videos (Auth)');
    console.log('   POST /api/videos - Create video (Auth)');
    console.log('=' .repeat(50));
    console.log('');
  }

  private setupGracefulShutdown(): void {
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;
        
        console.log(`\n🛑 Received ${signal} - Starting graceful shutdown...`);
        
        await this.shutdown();
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    // Log startup completion
    process.nextTick(() => {
      console.log('🚀 Server ready to accept requests');
    });
  }

  private async shutdown(): Promise<void> {
    try {
      console.log('🛑 Closing HTTP server...');
      
      await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => {
          if (error) {
            console.error('❌ Error closing HTTP server:', error);
            reject(error);
          } else {
            console.log('✅ HTTP server closed');
            resolve();
          }
        });
      });

      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('💥 Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Start the server
const serverManager = new ServerManager();

// Handle server startup errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception thrown:', error);
  process.exit(1);
});

// Start the server
serverManager.start().catch((error) => {
  console.error('💥 Failed to start server:', error);
  process.exit(1);
});

export default app;