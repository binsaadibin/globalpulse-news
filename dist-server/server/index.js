var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from "express";
import { createServer } from "http";
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB, healthCheckDB } from './db/connection.js';
import { setupRoutes } from './routes/index.js';
import { apiRateLimit } from './middleware/rateLimit.js';
console.log('🚀 GlobalPulse News API Server Starting...');
var app = express();
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
app.use(function (req, res, next) {
    var timestamp = new Date().toISOString();
    var ip = req.ip || req.connection.remoteAddress;
    console.log("\uD83D\uDCE5 [".concat(timestamp, "] ").concat(req.method, " ").concat(req.url, " - IP: ").concat(ip, " - User-Agent: ").concat(req.get('User-Agent')));
    next();
});
// Body parsing middleware
app.use(express.json({
    limit: '10mb',
    verify: function (req, res, buf) {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));
// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        var allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://globalpulse-news-production-31ee.up.railway.app',
            'https://your-production-domain.com'
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
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
app.get('/health', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dbHealth, healthInfo, statusCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, healthCheckDB()];
            case 1:
                dbHealth = _a.sent();
                healthInfo = {
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
                statusCode = healthInfo.status === 'healthy' ? 200 : 503;
                res.status(statusCode).json(healthInfo);
                return [2 /*return*/];
        }
    });
}); });
// API status endpoint
app.get('/api/status', function (req, res) {
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
app.get('/api/docs', function (req, res) {
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
app.get('/', function (req, res) {
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
app.use(function (err, req, res, next) {
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
        var errors = Object.values(err.errors).map(function (e) { return e.message; });
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: errors,
            code: 'VALIDATION_ERROR'
        });
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
        var field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: "".concat(field, " already exists"),
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
    var statusCode = err.status || 500;
    var response = {
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
app.use('*', function (req, res) {
    console.log("\u274C 404 - Route not found: ".concat(req.method, " ").concat(req.originalUrl));
    res.status(404).json({
        success: false,
        message: "Endpoint ".concat(req.method, " ").concat(req.originalUrl, " not found"),
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
var httpServer = createServer(app);
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var port, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
                console.log('🔧 Server Configuration:');
                console.log("   Port: ".concat(port));
                console.log("   Environment: ".concat(process.env.NODE_ENV || 'development'));
                console.log("   Node Version: ".concat(process.version));
                console.log("   Platform: ".concat(process.platform, "/").concat(process.arch));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // Connect to MongoDB
                console.log('🔗 Connecting to MongoDB...');
                return [4 /*yield*/, connectDB()];
            case 2:
                _a.sent();
                console.log('✅ MongoDB connected successfully');
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log('💥 CRITICAL: MongoDB connection failed');
                console.log('🔧 Server cannot start without database connection');
                process.exit(1);
                return [3 /*break*/, 4];
            case 4:
                httpServer.listen(port, "0.0.0.0", function () {
                    console.log('🎉 SERVER STARTED SUCCESSFULLY!');
                    console.log("\u2705 Server running on port ".concat(port));
                    console.log("\u2705 Health: http://localhost:".concat(port, "/health"));
                    console.log("\u2705 API Status: http://localhost:".concat(port, "/api/status"));
                    console.log("\u2705 API Docs: http://localhost:".concat(port, "/api/docs"));
                    console.log("\u2705 Admin API: http://localhost:".concat(port, "/api/admin/users"));
                    console.log('');
                    console.log('📊 System Status:');
                    console.log('   Database: Connected');
                    console.log('   Authentication: JWT Enabled');
                    console.log('   Rate Limiting: Active');
                    console.log('   CORS: Configured');
                    console.log('   Security: Helmet Enabled');
                    console.log('   Compression: Active');
                });
                httpServer.on('error', function (error) {
                    console.error('❌ SERVER STARTUP FAILED:', error);
                    process.exit(1);
                });
                return [2 /*return*/];
        }
    });
}); };
// Graceful shutdown handling
var gracefulShutdown = function (signal) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("\n\uD83D\uDED1 Received ".concat(signal, " - Shutting down gracefully..."));
        // Stop accepting new requests
        httpServer.close(function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('✅ HTTP server closed');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, import('./db/connection.js').then(function (_a) {
                                var disconnectDB = _a.disconnectDB;
                                return disconnectDB();
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error closing database connection:', error_2);
                        return [3 /*break*/, 4];
                    case 4:
                        console.log('✅ Graceful shutdown completed');
                        process.exit(0);
                        return [2 /*return*/];
                }
            });
        }); });
        // Force shutdown after 10 seconds
        setTimeout(function () {
            console.log('💥 Forcing shutdown after timeout');
            process.exit(1);
        }, 10000);
        return [2 /*return*/];
    });
}); };
process.on('SIGINT', function () { return gracefulShutdown('SIGINT'); });
process.on('SIGTERM', function () { return gracefulShutdown('SIGTERM'); });
process.on('unhandledRejection', function (reason, promise) {
    console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);
    // Close server & exit process
    process.exit(1);
});
process.on('uncaughtException', function (error) {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
// Start the server
startServer();
