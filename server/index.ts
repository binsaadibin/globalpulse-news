import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB, healthCheckDB } from './db/connection.js';
import { setupRoutes } from './routes/index.js';
import { apiRateLimit } from './middleware/rateLimit.js';

console.log('🚀 GlobalPulse News API Server Starting...');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`📥 [${timestamp}] ${req.method} ${req.url} - IP: ${ip} - User-Agent: ${req.get('User-Agent')}`);
  next();
});

// Body parsing middleware
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

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://globalpulse-news-production-31ee.up.railway.app',
      'https://your-production-domain.com'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Apply rate limiting to all routes
app.use(apiRateLimit);

// Health check endpoint with detailed information
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

// API status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    service: 'GlobalPulse News API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
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

// API documentation endpoint
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    name: 'GlobalPulse News API',
    version: '1.0.0',
    description: 'Complete news management platform API',
    documentation: 'See individual endpoint documentation for details',
    authentication: 'JWT Bearer Token required for protected routes',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'User authentication',
        'POST /api/auth/register': 'User registration',
        'GET /api/auth/me': 'Get current user profile'
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

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'GlobalPulse News API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: '/api/docs',
    health: '/health',
    status: '/api/status'
  });
});

// Setup all API routes
console.log('🛣️ Initializing API routes...');
setupRoutes(app);

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: Origin not allowed',
      code: 'CORS_ERROR'
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
      code: 'VALIDATION_ERROR'
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      code: 'DUPLICATE_ENTRY'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Rate limit error
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: err.message,
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }

  // Default error response
  const statusCode = err.status || 500;
  const response: any = {
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR'
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err;
  }

  res.status(statusCode).json(response);
});

// 404 handler - MUST be last
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
      'POST /api/auth/login',
      'GET /api/admin/users'
    ]
  });
});

const httpServer = createServer(app);

const startServer = async () => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  
  console.log('🔧 Server Configuration:');
  console.log(`   Port: ${port}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Node Version: ${process.version}`);
  console.log(`   Platform: ${process.platform}/${process.arch}`);

  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.log('💥 CRITICAL: MongoDB connection failed');
    console.log('🔧 Server cannot start without database connection');
    process.exit(1);
  }

  httpServer.listen(port, "0.0.0.0", () => {
    console.log('🎉 SERVER STARTED SUCCESSFULLY!');
    console.log(`✅ Server running on port ${port}`);
    console.log(`✅ Health: http://localhost:${port}/health`);
    console.log(`✅ API Status: http://localhost:${port}/api/status`);
    console.log(`✅ API Docs: http://localhost:${port}/api/docs`);
    console.log(`✅ Admin API: http://localhost:${port}/api/admin/users`);
    console.log('');
    console.log('📊 System Status:');
    console.log('   Database: Connected');
    console.log('   Authentication: JWT Enabled');
    console.log('   Rate Limiting: Active');
    console.log('   CORS: Configured');
    console.log('   Security: Helmet Enabled');
    console.log('   Compression: Active');
  });

  httpServer.on('error', (error: Error) => {
    console.error('❌ SERVER STARTUP FAILED:', error);
    process.exit(1);
  });
};

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal} - Shutting down gracefully...`);
  
  // Stop accepting new requests
  httpServer.close(async () => {
    console.log('✅ HTTP server closed');
    
    // Close database connection
    try {
      await import('./db/connection.js').then(({ disconnectDB }) => disconnectDB());
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.log('💥 Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // Close server & exit process
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();