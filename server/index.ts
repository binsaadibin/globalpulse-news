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
import { seedAdvertisements } from './seeders/advertisements.js';

console.log('🚀 GlobalPulse News API Server Starting...');

const app = express();

// ========================
// CORS CONFIGURATION - UPDATED FOR NETLIFY
// ========================
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://globalplus.netlify.app',
      'https://globalplus-news.netlify.app',
      'http://localhost:5173',
      'http://localhost:3000',
      'https://globalpulse-news-production-31ee.up.railway.app',
      'https://*.netlify.app',
      'https://*.railway.app'
    ];
    
    // Check if the origin is in the allowed list or matches wildcard patterns
    if (allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const regex = new RegExp('^' + allowed.replace('*', '.*') + '$');
        return regex.test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'X-API-Key', 
    'Origin', 
    'Accept',
    'x-auth-token'
  ],
  exposedHeaders: [
    'X-Response-Time', 
    'X-Powered-By', 
    'Content-Range', 
    'X-Total-Count'
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware first
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

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
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:"],
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
// RATE LIMITING
// ========================
app.use(apiRateLimit);

// ========================
// CORS TEST ENDPOINT
// ========================
app.get('/api/cors-test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'CORS is working correctly! 🎉',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    headers: req.headers,
    cors: {
      enabled: true,
      allowedOrigins: [
        'https://globalplus.netlify.app',
        'http://localhost:5173',
        'http://localhost:3000'
      ]
    }
  });
});

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
    cors: {
      enabled: true,
      allowedOrigins: [
        'https://globalplus.netlify.app',
        'http://localhost:5173',
        'http://localhost:3000'
      ]
    }
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
    cors: {
      enabled: true,
      allowedOrigins: [
        'https://globalplus.netlify.app',
        'http://localhost:5173',
        'http://localhost:3000'
      ]
    },
    endpoints: {
      auth: '/api/auth',
      articles: '/api/articles',
      videos: '/api/videos',
      advertisements: '/api/advertisements',
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
    description: 'Complete news management platform API with Advertisement support',
    baseUrl: 'https://globalpulse-news-production-31ee.up.railway.app',
    authentication: 'JWT Bearer Token',
    cors: {
      enabled: true,
      allowedOrigins: [
        'https://globalplus.netlify.app',
        'http://localhost:5173',
        'http://localhost:3000'
      ]
    },
    endpoints: {
      health: {
        'GET /health': 'Health check and system status',
        'GET /api/cors-test': 'Test CORS configuration'
      },
      auth: {
        'POST /api/auth/login': 'User authentication',
        'POST /api/auth/register': 'User registration',
        'GET /api/auth/me': 'Get current user profile'
      },
      articles: {
        'GET /api/articles': 'Get all published articles',
        'GET /api/articles/:id': 'Get article by ID',
        'POST /api/articles': 'Create article (Authenticated)',
        'GET /api/articles/my-articles': 'Get user articles (Authenticated)',
        'PUT /api/articles/:id': 'Update article (Authenticated)',
        'DELETE /api/articles/:id': 'Delete article (Authenticated)'
      },
      videos: {
        'GET /api/videos': 'Get all published videos',
        'POST /api/videos': 'Create video (Authenticated)',
        'GET /api/videos/my-videos': 'Get user videos (Authenticated)'
      },
      advertisements: {
        'GET /api/advertisements': 'Get all active advertisements',
        'GET /api/advertisements/position/:position': 'Get ads by position',
        'GET /api/advertisements/my-ads': 'Get user advertisements (Authenticated)',
        'POST /api/advertisements': 'Create advertisement (Authenticated)',
        'PUT /api/advertisements/:id': 'Update advertisement (Authenticated)',
        'DELETE /api/advertisements/:id': 'Delete advertisement (Authenticated)',
        'POST /api/advertisements/:id/click': 'Track ad click',
        'POST /api/advertisements/:id/impression': 'Track ad impression'
      }
    }
  });
});

// ========================
// ROOT ENDPOINT
// ========================
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'GlobalPulse News API Server with Advertisement Support',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: '/api/docs',
    health: '/health',
    statusEndpoint: '/api/status',
    corsTest: '/api/cors-test',
    cors: {
      enabled: true,
      allowedOrigins: [
        'https://globalplus.netlify.app',
        'http://localhost:5173',
        'http://localhost:3000'
      ]
    }
  });
});

// ========================
// API ROUTES
// ========================
console.log('🛣️ Initializing API routes...');
setupRoutes(app);

// ========================
// ERROR HANDLING
// ========================
app.use(errorHandler);

// ========================
// 404 HANDLER
// ========================
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    documentation: '/api/docs',
    availableEndpoints: [
      'GET /health',
      'GET /api/status',
      'GET /api/docs',
      'GET /api/cors-test',
      'GET /api/articles',
      'GET /api/videos',
      'GET /api/advertisements'
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
    console.log(`   CORS Enabled: true`);
    console.log(`   Allowed Origins: ${[
      'https://globalplus.netlify.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ].join(', ')}`);

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
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Seed advertisements in development
    if (process.env.NODE_ENV === 'development' || process.env.SEED_DATA === 'true') {
      console.log('🌱 Seeding initial advertisement data...');
      try {
        await seedAdvertisements();
        console.log('✅ Advertisement data seeded successfully');
      } catch (seedError) {
        console.warn('⚠️  Advertisement seed data creation skipped or failed:', seedError);
      }
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
    console.log('🎉 SERVER STARTED SUCCESSFULLY!');
    console.log(`✅ Server running on port ${port}`);
    console.log(`✅ Health: http://localhost:${port}/health`);
    console.log(`✅ API Status: http://localhost:${port}/api/status`);
    console.log(`✅ API Docs: http://localhost:${port}/api/docs`);
    console.log(`✅ CORS Test: http://localhost:${port}/api/cors-test`);
    console.log(`✅ CORS: Enabled for Netlify frontend`);
    console.log('');
    console.log('📊 System Status:');
    console.log('   Database: Connected');
    console.log('   Authentication: JWT Enabled');
    console.log('   Rate Limiting: Active');
    console.log('   CORS: Configured for Netlify');
    console.log('   Security: Helmet Enabled');
    console.log('   Compression: Active');
    console.log('   Logging: Comprehensive');
    console.log('   Advertisement Support: ✅ Enabled');
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
serverManager.start();