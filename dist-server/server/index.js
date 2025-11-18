// import express, { type Request, Response, NextFunction } from "express";
// import { createServer, type Server } from "http";
// import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import cors from 'cors';
// import path from 'path';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import express from "express";
import { createServer } from "http";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { fileURLToPath } from 'url'; // ADD THIS
import { dirname } from 'path'; // ADD THIS
// ADD THESE 2 LINES
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
console.log('🚀 Server starting initialization...');
var app = express();
// Add request logging middleware first
app.use(function (req, res, next) {
    console.log("\uD83D\uDCE5 ".concat(req.method, " ").concat(req.url));
    next();
});
// Basic middleware first
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
// CORS configuration
app.use(cors({
    origin: true, // Allow all origins for now to debug
    credentials: true,
}));
// Handle preflight requests
app.options('*', cors());
// Simple health check endpoint
app.get('/health', function (req, res) {
    console.log('🏥 Health check called');
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'GlobalPulse News API',
        version: '1.0.0'
    });
});
// Root route
app.get('/', function (req, res) {
    console.log('🏠 Root route called');
    res.json({
        status: 'OK',
        message: 'GlobalPulse News API is running',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/health',
            articles: '/api/articles',
            videos: '/api/videos',
            auth: '/api/auth'
        }
    });
});
// Test route
app.get('/test', function (req, res) {
    console.log('🧪 Test route called');
    res.json({ message: 'Test successful', timestamp: new Date().toISOString() });
});
// MOCK DATA STORAGE
var articlesStorage = [];
var videosStorage = [];
// MOCK USERS
var MOCK_USERS = [
    { id: '1', username: 'globalplus', password: 'globalplus@4455', role: 'admin' },
    { id: '2', username: 'globalnews', password: 'globalnews@4455', role: 'admin' },
    { id: '3', username: 'haroonosmani', password: 'haroon@1324', role: 'editor' },
];
// SIMPLIFIED AUTH MIDDLEWARE
var authenticateToken = function (req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    try {
        var decoded_1 = jwt.verify(token, 'fallback_secret');
        var user = MOCK_USERS.find(function (u) { return u.id === decoded_1.userId; });
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
// AUTH ROUTES
app.post('/api/auth/login', function (req, res) {
    try {
        var _a = req.body, username_1 = _a.username, password_1 = _a.password;
        console.log('🔐 Login attempt:', username_1);
        var user = MOCK_USERS.find(function (u) { return u.username === username_1 && u.password === password_1; });
        if (!user) {
            console.log('❌ Invalid credentials for:', username_1);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        var token = jwt.sign({ userId: user.id }, 'fallback_secret', { expiresIn: '24h' });
        console.log('✅ Login successful for:', username_1);
        res.json({
            token: token,
            user: { id: user.id, username: user.username, role: user.role },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/auth/me', authenticateToken, function (req, res) {
    try {
        res.json({
            id: req.user.id,
            username: req.user.username,
            role: req.user.role
        });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
// ARTICLES API ROUTES
// Get all published articles (for home page) - PUBLIC
app.get('/api/articles', function (req, res) {
    try {
        console.log('📰 Fetching published articles for home page');
        var publishedArticles = articlesStorage
            .filter(function (article) { return article.status === 'published'; })
            .map(function (article) { return (__assign(__assign({}, article), { views: article.views || 0, likes: article.likes || 0, comments: article.comments || [], readTime: article.readTime || '5 min read' })); });
        console.log('📊 Returning', publishedArticles.length, 'published articles');
        res.json(publishedArticles);
    }
    catch (error) {
        console.error('Get articles error:', error);
        res.json([]);
    }
});
// Create article - PROTECTED
app.post('/api/articles', authenticateToken, function (req, res) {
    try {
        console.log('📝 Creating article by:', req.user.username);
        var article = __assign(__assign({ _id: Date.now().toString() }, req.body), { views: 0, likes: 0, comments: [], readTime: req.body.readTime || '5 min read', createdBy: req.user.id, createdByUsername: req.user.username, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        articlesStorage.push(article);
        console.log('💾 Article saved. Total articles:', articlesStorage.length);
        res.json({
            success: true,
            message: "Article ".concat(article.status === 'draft' ? 'saved as draft' : 'published', " successfully"),
            article: article
        });
    }
    catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get user's articles for dashboard - PROTECTED
app.get('/api/articles/my-articles', authenticateToken, function (req, res) {
    try {
        console.log('📚 Fetching articles for user:', req.user.username);
        var userArticles = articlesStorage
            .filter(function (article) { return article.createdBy === req.user.id; })
            .map(function (article) { return (__assign(__assign({}, article), { views: article.views || 0, likes: article.likes || 0, comments: article.comments || [] })); });
        console.log('📊 Returning', userArticles.length, 'articles for user');
        res.json(userArticles);
    }
    catch (error) {
        console.error('Get my articles error:', error);
        res.json([]);
    }
});
// Update article - PROTECTED
app.put('/api/articles/:id', authenticateToken, function (req, res) {
    try {
        var articleId_1 = req.params.id;
        console.log('✏️ Updating article:', articleId_1);
        var articleIndex = articlesStorage.findIndex(function (article) {
            return article._id === articleId_1 && article.createdBy === req.user.id;
        });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var updatedArticle = __assign(__assign(__assign({}, articlesStorage[articleIndex]), req.body), { updatedAt: new Date().toISOString() });
        articlesStorage[articleIndex] = updatedArticle;
        console.log('✅ Article updated successfully');
        res.json({
            success: true,
            message: "Article ".concat(updatedArticle.status === 'draft' ? 'draft updated' : 'updated and published', " successfully"),
            article: updatedArticle
        });
    }
    catch (error) {
        console.error('Update article error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete article - PROTECTED
app.delete('/api/articles/:id', authenticateToken, function (req, res) {
    try {
        var articleId_2 = req.params.id;
        console.log('🗑️ Deleting article:', articleId_2);
        var articleIndex = articlesStorage.findIndex(function (article) {
            return article._id === articleId_2 && article.createdBy === req.user.id;
        });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var deletedArticle = articlesStorage.splice(articleIndex, 1)[0];
        console.log('✅ Article deleted. Total articles:', articlesStorage.length);
        res.json({
            success: true,
            message: 'Article deleted successfully',
            article: deletedArticle
        });
    }
    catch (error) {
        console.error('Delete article error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get article details - PUBLIC
app.get('/api/articles/:id', function (req, res) {
    try {
        var articleId_3 = req.params.id;
        console.log('📖 Fetching article:', articleId_3);
        var article = articlesStorage.find(function (a) { return a._id === articleId_3; });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        // Increment views when someone views details
        article.views = (article.views || 0) + 1;
        article.updatedAt = new Date().toISOString();
        var enhancedArticle = __assign(__assign({}, article), { views: article.views || 0, likes: article.likes || 0, comments: article.comments || [], readTime: article.readTime || '5 min read', hasLiked: false });
        res.json(enhancedArticle);
    }
    catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Like an article - PUBLIC
app.post('/api/articles/:id/like', function (req, res) {
    try {
        var articleId_4 = req.params.id;
        console.log('❤️ Liking article:', articleId_4);
        var articleIndex = articlesStorage.findIndex(function (a) { return a._id === articleId_4; });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var article = articlesStorage[articleIndex];
        if (typeof article.likes !== 'number') {
            article.likes = 0;
        }
        article.likes += 1;
        article.updatedAt = new Date().toISOString();
        res.json({
            success: true,
            likes: article.likes,
            hasLiked: true
        });
    }
    catch (error) {
        console.error('Like article error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Unlike an article - PUBLIC
app.post('/api/articles/:id/unlike', function (req, res) {
    try {
        var articleId_5 = req.params.id;
        console.log('💔 Unliking article:', articleId_5);
        var articleIndex = articlesStorage.findIndex(function (a) { return a._id === articleId_5; });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var article = articlesStorage[articleIndex];
        if (article.likes > 0) {
            article.likes -= 1;
        }
        article.updatedAt = new Date().toISOString();
        res.json({
            success: true,
            likes: article.likes,
            hasLiked: false
        });
    }
    catch (error) {
        console.error('Unlike article error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Add comment to article - PUBLIC
app.post('/api/articles/:id/comments', function (req, res) {
    try {
        var articleId_6 = req.params.id;
        var _a = req.body, text = _a.text, user = _a.user;
        console.log('💬 Adding comment to article:', articleId_6);
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }
        var articleIndex = articlesStorage.findIndex(function (a) { return a._id === articleId_6; });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var article = articlesStorage[articleIndex];
        if (!Array.isArray(article.comments)) {
            article.comments = [];
        }
        var newComment = {
            id: Date.now().toString(),
            text: text.trim(),
            user: user || 'Anonymous',
            timestamp: new Date().toISOString(),
            likes: 0
        };
        article.comments.unshift(newComment);
        article.updatedAt = new Date().toISOString();
        console.log('✅ Comment added. Total comments:', article.comments.length);
        res.json({
            success: true,
            comment: newComment,
            totalComments: article.comments.length
        });
    }
    catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// VIDEOS API ROUTES
// Get all published videos - PUBLIC
app.get('/api/videos', function (req, res) {
    try {
        console.log('🎬 Fetching published videos for videos page');
        var publishedVideos = videosStorage.filter(function (video) { return video.status === 'published'; });
        console.log('📊 Returning', publishedVideos.length, 'published videos');
        res.json(publishedVideos);
    }
    catch (error) {
        console.error('Get videos error:', error);
        res.json([]);
    }
});
// Create video - PROTECTED
app.post('/api/videos', authenticateToken, function (req, res) {
    try {
        console.log('🎥 Creating video by:', req.user.username);
        var video = __assign(__assign({ _id: Date.now().toString() }, req.body), { views: 0, likes: 0, createdBy: req.user.id, createdByUsername: req.user.username, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        videosStorage.push(video);
        console.log('💾 Video saved. Total videos:', videosStorage.length);
        res.json({
            success: true,
            message: "Video ".concat(video.status === 'draft' ? 'saved as draft' : 'published', " successfully"),
            video: video
        });
    }
    catch (error) {
        console.error('Create video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get user's videos for dashboard - PROTECTED
app.get('/api/videos/my-videos', authenticateToken, function (req, res) {
    try {
        console.log('📹 Fetching videos for user:', req.user.username);
        var userVideos = videosStorage.filter(function (video) { return video.createdBy === req.user.id; });
        console.log('📊 Returning', userVideos.length, 'videos for user');
        res.json(userVideos);
    }
    catch (error) {
        console.error('Get my videos error:', error);
        res.json([]);
    }
});
// Update video - PROTECTED
app.put('/api/videos/:id', authenticateToken, function (req, res) {
    try {
        var videoId_1 = req.params.id;
        console.log('✏️ Updating video:', videoId_1);
        var videoIndex = videosStorage.findIndex(function (video) {
            return video._id === videoId_1 && video.createdBy === req.user.id;
        });
        if (videoIndex === -1) {
            return res.status(404).json({ message: 'Video not found' });
        }
        videosStorage[videoIndex] = __assign(__assign(__assign({}, videosStorage[videoIndex]), req.body), { updatedAt: new Date().toISOString() });
        console.log('✅ Video updated successfully');
        res.json({
            success: true,
            message: "Video ".concat(videosStorage[videoIndex].status === 'draft' ? 'draft updated' : 'updated and published', " successfully"),
            video: videosStorage[videoIndex]
        });
    }
    catch (error) {
        console.error('Update video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete video - PROTECTED
app.delete('/api/videos/:id', authenticateToken, function (req, res) {
    try {
        var videoId_2 = req.params.id;
        console.log('🗑️ Deleting video:', videoId_2);
        var videoIndex = videosStorage.findIndex(function (video) {
            return video._id === videoId_2 && video.createdBy === req.user.id;
        });
        if (videoIndex === -1) {
            return res.status(404).json({ message: 'Video not found' });
        }
        var deletedVideo = videosStorage.splice(videoIndex, 1)[0];
        console.log('✅ Video deleted. Total videos:', videosStorage.length);
        res.json({
            success: true,
            message: 'Video deleted successfully',
            video: deletedVideo
        });
    }
    catch (error) {
        console.error('Delete video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// VIDEO VIEW TRACKING ENDPOINTS
// Track video view - PUBLIC
app.post('/api/videos/:id/view', function (req, res) {
    try {
        var videoId_3 = req.params.id;
        console.log('👀 Tracking view for video:', videoId_3);
        var videoIndex = videosStorage.findIndex(function (video) { return video._id === videoId_3; });
        if (videoIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }
        var video = videosStorage[videoIndex];
        // Initialize views if not exists
        if (typeof video.views !== 'number') {
            video.views = 0;
        }
        // Increment views
        video.views += 1;
        video.updatedAt = new Date().toISOString();
        console.log('✅ View tracked. Total views:', video.views);
        res.json({
            success: true,
            views: video.views,
            message: 'View tracked successfully'
        });
    }
    catch (error) {
        console.error('Track view error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
// Get video views - PUBLIC
app.get('/api/videos/:id/views', function (req, res) {
    try {
        var videoId_4 = req.params.id;
        console.log('📊 Getting views for video:', videoId_4);
        var video = videosStorage.find(function (video) { return video._id === videoId_4; });
        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }
        var views = video.views || 0;
        res.json({
            success: true,
            views: views,
            videoId: videoId_4
        });
    }
    catch (error) {
        console.error('Get views error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
// Like a video - PUBLIC
app.post('/api/videos/:id/like', function (req, res) {
    try {
        var videoId_5 = req.params.id;
        console.log('❤️ Liking video:', videoId_5);
        var videoIndex = videosStorage.findIndex(function (video) { return video._id === videoId_5; });
        if (videoIndex === -1) {
            return res.status(404).json({ message: 'Video not found' });
        }
        var video = videosStorage[videoIndex];
        if (typeof video.likes !== 'number') {
            video.likes = 0;
        }
        video.likes += 1;
        video.updatedAt = new Date().toISOString();
        res.json({
            success: true,
            likes: video.likes,
            hasLiked: true
        });
    }
    catch (error) {
        console.error('Like video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Unlike a video - PUBLIC
app.post('/api/videos/:id/unlike', function (req, res) {
    try {
        var videoId_6 = req.params.id;
        console.log('💔 Unliking video:', videoId_6);
        var videoIndex = videosStorage.findIndex(function (video) { return video._id === videoId_6; });
        if (videoIndex === -1) {
            return res.status(404).json({ message: 'Video not found' });
        }
        var video = videosStorage[videoIndex];
        if (video.likes > 0) {
            video.likes -= 1;
        }
        video.updatedAt = new Date().toISOString();
        res.json({
            success: true,
            likes: video.likes,
            hasLiked: false
        });
    }
    catch (error) {
        console.error('Unlike video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// SEARCH API ROUTE - PUBLIC
app.get('/api/search', function (req, res) {
    try {
        var _a = req.query, query = _a.q, type = _a.type;
        console.log('🔍 Search request:', { query: query, type: type });
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }
        var searchTerm_1 = query.toLowerCase().trim();
        // Search in articles
        var articleResults = articlesStorage
            .filter(function (article) { return article.status === 'published'; })
            .filter(function (article) {
            var _a, _b, _c, _d, _e, _f, _g;
            var title = typeof article.title === 'string'
                ? article.title
                : ((_a = article.title) === null || _a === void 0 ? void 0 : _a.en) || ((_b = article.title) === null || _b === void 0 ? void 0 : _b.ar) || ((_c = article.title) === null || _c === void 0 ? void 0 : _c.ur) || '';
            var description = typeof article.description === 'string'
                ? article.description
                : ((_d = article.description) === null || _d === void 0 ? void 0 : _d.en) || ((_e = article.description) === null || _e === void 0 ? void 0 : _e.ar) || ((_f = article.description) === null || _f === void 0 ? void 0 : _f.ur) || '';
            return title.toLowerCase().includes(searchTerm_1) ||
                description.toLowerCase().includes(searchTerm_1) ||
                ((_g = article.category) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes(searchTerm_1));
        })
            .map(function (article) {
            var _a, _b;
            return ({
                id: article._id,
                title: typeof article.title === 'string' ? article.title : (_a = article.title) === null || _a === void 0 ? void 0 : _a.en,
                description: typeof article.description === 'string' ? article.description : (_b = article.description) === null || _b === void 0 ? void 0 : _b.en,
                url: "/article/".concat(article._id),
                type: 'news',
                date: article.createdAt,
                imageUrl: article.imageUrl
            });
        });
        // Search in videos
        var videoResults = videosStorage
            .filter(function (video) { return video.status === 'published'; })
            .filter(function (video) {
            var _a, _b, _c, _d, _e, _f;
            var title = typeof video.title === 'string'
                ? video.title
                : ((_a = video.title) === null || _a === void 0 ? void 0 : _a.en) || ((_b = video.title) === null || _b === void 0 ? void 0 : _b.ar) || ((_c = video.title) === null || _c === void 0 ? void 0 : _c.ur) || '';
            var description = typeof video.description === 'string'
                ? video.description
                : ((_d = video.description) === null || _d === void 0 ? void 0 : _d.en) || ((_e = video.description) === null || _e === void 0 ? void 0 : _e.ar) || ((_f = video.description) === null || _f === void 0 ? void 0 : _f.ur) || '';
            return title.toLowerCase().includes(searchTerm_1) ||
                description.toLowerCase().includes(searchTerm_1);
        })
            .map(function (video) {
            var _a, _b;
            return ({
                id: video._id,
                title: typeof video.title === 'string' ? video.title : (_a = video.title) === null || _a === void 0 ? void 0 : _a.en,
                description: typeof video.description === 'string' ? video.description : (_b = video.description) === null || _b === void 0 ? void 0 : _b.en,
                url: "/video/".concat(video._id),
                type: 'video',
                duration: '5:30',
                platform: video.platform
            });
        });
        var results = [];
        if (type === 'news') {
            results = articleResults;
        }
        else if (type === 'video') {
            results = videoResults;
        }
        else {
            results = __spreadArray(__spreadArray([], articleResults, true), videoResults, true);
        }
        console.log('🔍 Search results:', results.length);
        res.json({
            success: true,
            data: results,
            total: results.length,
            query: searchTerm_1
        });
    }
    catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Error handling middleware
app.use(function (err, req, res, next) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});
// 404 handler
app.use(function (req, res) {
    console.log('❌ 404 - Route not found:', req.method, req.url);
    res.status(404).json({ message: 'Route not found' });
});
var httpServer = createServer(app);
var startServer = function () {
    var port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    console.log('🚀 Starting production server...');
    console.log('🔧 Port:', port);
    console.log('🔧 Environment:', process.env.NODE_ENV);
    httpServer.listen(port, "0.0.0.0", function () {
        console.log('✅ PRODUCTION SERVER STARTED SUCCESSFULLY!');
        console.log("\u2705 Listening on port ".concat(port));
        console.log("\u2705 Health check: http://0.0.0.0:".concat(port, "/health"));
    });
    httpServer.on('error', function (error) {
        console.error('❌ SERVER FAILED TO START:', error);
        process.exit(1);
    });
};
startServer();
