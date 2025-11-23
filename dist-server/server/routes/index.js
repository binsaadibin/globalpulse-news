import authRoutes from './auth.js';
import articleRoutes from './articles.js';
import videoRoutes from './videos.js';
import searchRoutes from './search.js';
import adminRoutes from './admin.js';
export var setupRoutes = function (app) {
    console.log('🛣️ Setting up advanced API routes...');
    // API status endpoint
    app.get('/api/status', function (req, res) {
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
            }
        });
    });
    // Setup all route modules
    var routes = [
        { path: '/api/auth', module: authRoutes, name: 'Authentication' },
        { path: '/api/articles', module: articleRoutes, name: 'Articles' },
        { path: '/api/videos', module: videoRoutes, name: 'Videos' },
        { path: '/api/search', module: searchRoutes, name: 'Search' },
        { path: '/api/admin', module: adminRoutes, name: 'Admin' }
    ];
    routes.forEach(function (_a) {
        var path = _a.path, module = _a.module, name = _a.name;
        try {
            app.use(path, module);
            console.log("\u2705 ".concat(name, " routes registered: ").concat(path));
        }
        catch (error) {
            console.error("\u274C Failed to register ".concat(name, " routes:"), error);
            throw error;
        }
    });
    // API documentation endpoint
    app.get('/api', function (req, res) {
        res.json({
            name: 'GlobalPulse News API',
            description: 'Complete news management platform',
            version: '1.0.0',
            documentation: 'Visit /api/docs for detailed API documentation',
            status: 'active',
            timestamp: new Date().toISOString()
        });
    });
    console.log('🎯 All advanced API routes setup completed');
    console.log('📚 API Documentation available at: /api/docs');
    console.log('🔍 API Status available at: /api/status');
};
