import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';
import { connectDB } from './db/connection.js';
import { setupRoutes } from './routes/index.js';

console.log('🚀 Server starting initialization...');

const app = express();

// Add request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// CORS configuration - ENHANCED
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Basic routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GlobalPulse News API',
    version: '1.0.0',
    routes: ['/api/auth', '/api/articles', '/api/videos', '/api/admin', '/api/search']
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'GlobalPulse News API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      articles: '/api/articles',
      videos: '/api/videos',
      admin: '/api/admin',
      search: '/api/search'
    }
  });
});

// Setup all API routes
setupRoutes(app);

// Route debugging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`🔍 Route accessed: ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - ENHANCED
app.use((req: Request, res: Response) => {
  console.log('❌ 404 - Route not found:', req.method, req.url);
  res.status(404).json({ 
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    availableRoutes: [
      'GET /health',
      'GET /',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/auth/me',
      'GET /api/articles',
      'POST /api/articles',
      'GET /api/videos',
      'POST /api/videos',
      'GET /api/admin/users',
      'POST /api/admin/users',
      'GET /api/search'
    ]
  });
});

const httpServer = createServer(app);

const startServer = async () => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  
  console.log('🚀 Starting production server...');
  console.log('🔧 Port:', port);
  console.log('🔧 Environment:', process.env.NODE_ENV);

  // Connect to MongoDB
  await connectDB();

  httpServer.listen(port, "0.0.0.0", () => {
    console.log('✅ PRODUCTION SERVER STARTED SUCCESSFULLY!');
    console.log(`✅ Listening on port ${port}`);
    console.log(`✅ Health check: http://0.0.0.0:${port}/health`);
    console.log('✅ Available routes:');
    console.log('   - GET  /health');
    console.log('   - GET  /');
    console.log('   - POST /api/auth/login');
    console.log('   - POST /api/auth/register');
    console.log('   - GET  /api/auth/me');
    console.log('   - GET  /api/articles');
    console.log('   - POST /api/articles');
    console.log('   - GET  /api/videos');
    console.log('   - POST /api/videos');
    console.log('   - GET  /api/admin/users');
    console.log('   - POST /api/admin/users');
    console.log('   - GET  /api/search');
  });

  httpServer.on('error', (error: Error) => {
    console.error('❌ SERVER FAILED TO START:', error);
    process.exit(1);
  });
};

startServer();