import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic, log } from "../vite";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/newsapp');
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.log('⚠️ MongoDB not running - using mock authentication');
  }
};
connectDB();

// CORS configuration - Using cors package
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://globalplus.netlify.app',
      'https://globalpulse-news-production-31ee.up.railway.app',
      'https://globalpulse-news.netlify.app'
    ];
    
    // Check if the origin is in allowed list or is a Netlify subdomain
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Handle preflight requests
app.options('*', cors());

// Health check endpoint - specific for Railway
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GlobalPulse News API',
    version: '1.0.0'
  });
});

// Root route for Railway health checks
app.get('/', (req: Request, res: Response) => {
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MOCK AUTH ROUTES
const MOCK_USERS = [
  { id: '1', username: 'globalplus', password: 'globalplus@4455', role: 'admin' },
  { id: '2', username: 'globalnews', password: 'globalnews@4455', role: 'admin' },
  { id: '3', username: 'haroonosmani', password: 'haroon@1324', role: 'editor' },
];

// ✅ COMPLETELY EMPTY - NO DEFAULT DATA
let articlesStorage: any[] = []; // Empty array - no default articles

let videosStorage: any[] = []; // Empty array - no default videos

// ✅ FIXED: Improved authentication middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔐 Auth check - Header:', authHeader ? 'Present' : 'Missing');
    console.log('🔐 Auth check - Token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      });
    }

    jwt.verify(token, 'fallback_secret', (err: any, decoded: any) => {
      if (err) {
        console.log('❌ Token verification failed:', err.message);
        return res.status(403).json({ 
          success: false,
          message: 'Invalid or expired token' 
        });
      }

      console.log('✅ Token verified for user ID:', decoded.userId);
      
      // Find user in mock users
      const user = MOCK_USERS.find(u => u.id === decoded.userId);
      if (!user) {
        console.log('❌ User not found for ID:', decoded.userId);
        return res.status(403).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      (req as any).user = decoded;
      (req as any).userData = user; // Attach full user data
      next();
    });
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Authentication error' 
    });
  }
};

// AUTH ROUTES
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('🔐 Login attempt:', username);

    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (!user) {
      console.log('❌ Invalid credentials for:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'fallback_secret', { expiresIn: '24h' });

    console.log('✅ Login successful for:', username);
    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
  try {
    const decoded = (req as any).user;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ARTICLES API ROUTES

// Get all published articles (for home page) - PUBLIC
app.get('/api/articles', (req: Request, res: Response) => {
  try {
    console.log('📰 Fetching published articles for home page');
    
    // ✅ ONLY USER-CREATED ARTICLES - NO DEFAULT DATA
    const publishedArticles = articlesStorage
      .filter(article => article.status === 'published')
      .map(article => ({
        ...article,
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || [],
        readTime: article.readTime || '5 min read'
      }));
    
    console.log('📊 Returning', publishedArticles.length, 'published articles');
    
    // ✅ FIX: Always return an array, even if empty
    res.json(publishedArticles);
  } catch (error) {
    console.error('Get articles error:', error);
    // ✅ FIX: Return empty array on error
    res.json([]);
  }
});

// Create article - PROTECTED
app.post('/api/articles', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).userData;
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('📝 Creating article by:', user.username);

    const article = {
      _id: Date.now().toString(),
      ...req.body,
      views: 0,
      likes: 0,
      comments: [],
      readTime: req.body.readTime || '5 min read',
      createdBy: user.id,
      createdByUsername: user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    articlesStorage.push(article);
    console.log('💾 Article saved. Total articles:', articlesStorage.length);

    res.json({
      success: true,
      message: `Article ${article.status === 'draft' ? 'saved as draft' : 'published'} successfully`,
      article: article
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's articles for dashboard - PROTECTED
app.get('/api/articles/my-articles', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).userData;
    
    console.log('📚 Fetching articles for user:', user.username);
    
    // ✅ ONLY USER'S ARTICLES - NO DEFAULT DATA
    const userArticles = articlesStorage
      .filter(article => article.createdBy === user.id)
      .map(article => ({
        ...article,
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || []
      }));
    
    console.log('📊 Returning', userArticles.length, 'articles for user');
    
    // ✅ FIX: Always return an array, even if empty
    res.json(userArticles);
  } catch (error) {
    console.error('Get my articles error:', error);
    // ✅ FIX: Return empty array on error
    res.json([]);
  }
});

// Update article - PROTECTED
app.put('/api/articles/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).userData;
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const articleId = req.params.id;
    console.log('✏️ Updating article:', articleId);

    const articleIndex = articlesStorage.findIndex(article => 
      article._id === articleId && article.createdBy === user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const updatedArticle = {
      ...articlesStorage[articleIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    articlesStorage[articleIndex] = updatedArticle;

    console.log('✅ Article updated successfully');

    res.json({
      success: true,
      message: `Article ${updatedArticle.status === 'draft' ? 'draft updated' : 'updated and published'} successfully`,
      article: updatedArticle
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete article - PROTECTED
app.delete('/api/articles/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).userData;
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const articleId = req.params.id;
    console.log('🗑️ Deleting article:', articleId);

    const articleIndex = articlesStorage.findIndex(article => 
      article._id === articleId && article.createdBy === user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const deletedArticle = articlesStorage.splice(articleIndex, 1)[0];
    console.log('✅ Article deleted. Total articles:', articlesStorage.length);

    res.json({
      success: true,
      message: 'Article deleted successfully',
      article: deletedArticle
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get article details - PUBLIC
app.get('/api/articles/:id', (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('📖 Fetching article:', articleId);

    const article = articlesStorage.find(a => a._id === articleId);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment views when someone views details
    article.views = (article.views || 0) + 1;
    article.updatedAt = new Date().toISOString();

    const enhancedArticle = {
      ...article,
      views: article.views || 0,
      likes: article.likes || 0,
      comments: article.comments || [],
      readTime: article.readTime || '5 min read',
      hasLiked: false
    };

    res.json(enhancedArticle);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like an article - PUBLIC
app.post('/api/articles/:id/like', (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('❤️ Liking article:', articleId);

    const articleIndex = articlesStorage.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = articlesStorage[articleIndex];
    
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
  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlike an article - PUBLIC
app.post('/api/articles/:id/unlike', (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('💔 Unliking article:', articleId);

    const articleIndex = articlesStorage.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = articlesStorage[articleIndex];
    
    if (article.likes > 0) {
      article.likes -= 1;
    }
    
    article.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      likes: article.likes,
      hasLiked: false
    });
  } catch (error) {
    console.error('Unlike article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to article - PUBLIC
app.post('/api/articles/:id/comments', (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const { text, user } = req.body;
    
    console.log('💬 Adding comment to article:', articleId);

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const articleIndex = articlesStorage.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = articlesStorage[articleIndex];
    
    if (!Array.isArray(article.comments)) {
      article.comments = [];
    }

    const newComment = {
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
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get article comments - PUBLIC
app.get('/api/articles/:id/comments', (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('💬 Fetching comments for article:', articleId);

    const article = articlesStorage.find(a => a._id === articleId);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({
      comments: article.comments || [],
      totalComments: (article.comments || []).length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment - PROTECTED
app.delete('/api/articles/:articleId/comments/:commentId', authenticateToken, (req: Request, res: Response) => {
  try {
    const { articleId, commentId } = req.params;
    console.log('🗑️ Deleting comment:', commentId, 'from article:', articleId);

    const articleIndex = articlesStorage.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = articlesStorage[articleIndex];
    
    if (!Array.isArray(article.comments)) {
      return res.status(404).json({ message: 'No comments found' });
    }

    const commentIndex = article.comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const deletedComment = article.comments.splice(commentIndex, 1)[0];
    article.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      comment: deletedComment,
      totalComments: article.comments.length
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// VIDEOS API ROUTES

// Get all published videos - PUBLIC
app.get('/api/videos', (req: Request, res: Response) => {
  try {
    console.log('🎬 Fetching published videos for videos page');
    
    // ✅ ONLY USER-CREATED VIDEOS - NO DEFAULT DATA
    const publishedVideos = videosStorage.filter(video => video.status === 'published');
    console.log('📊 Returning', publishedVideos.length, 'published videos');
    
    // ✅ FIX: Always return an array, even if empty
    res.json(publishedVideos);
  } catch (error) {
    console.error('Get videos error:', error);
    // ✅ FIX: Return empty array on error
    res.json([]);
  }
});

// Create video - PROTECTED
app.post('/api/videos', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).userData;
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('🎥 Creating video by:', user.username);

    const video = {
      _id: Date.now().toString(),
      ...req.body,
      views: 0,
      likes: 0,
      createdBy: user.id,
      createdByUsername: user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    videosStorage.push(video);
    console.log('💾 Video saved. Total videos:', videosStorage.length);

    res.json({
      success: true,
      message: `Video ${video.status === 'draft' ? 'saved as draft' : 'published'} successfully`,
      video: video
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's videos for dashboard - PROTECTED
app.get('/api/videos/my-videos', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).userData;
    
    console.log('📹 Fetching videos for user:', user.username);
    
    // ✅ ONLY USER'S VIDEOS - NO DEFAULT DATA
    const userVideos = videosStorage.filter(video => video.createdBy === user.id);
    console.log('📊 Returning', userVideos.length, 'videos for user');
    
    // ✅ FIX: Always return an array, even if empty
    res.json(userVideos);
  } catch (error) {
    console.error('Get my videos error:', error);
    // ✅ FIX: Return empty array on error
    res.json([]);
  }
});

// Update video - PROTECTED
app.put('/api/videos/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).userData;
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const videoId = req.params.id;
    console.log('✏️ Updating video:', videoId);

    const videoIndex = videosStorage.findIndex(video => 
      video._id === videoId && video.createdBy === user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    videosStorage[videoIndex] = {
      ...videosStorage[videoIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Video updated successfully');

    res.json({
      success: true,
      message: `Video ${videosStorage[videoIndex].status === 'draft' ? 'draft updated' : 'updated and published'} successfully`,
      video: videosStorage[videoIndex]
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete video - PROTECTED
app.delete('/api/videos/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).userData;
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const videoId = req.params.id;
    console.log('🗑️ Deleting video:', videoId);

    const videoIndex = videosStorage.findIndex(video => 
      video._id === videoId && video.createdBy === user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const deletedVideo = videosStorage.splice(videoIndex, 1)[0];
    console.log('✅ Video deleted. Total videos:', videosStorage.length);

    res.json({
      success: true,
      message: 'Video deleted successfully',
      video: deletedVideo
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// VIDEO VIEW TRACKING ENDPOINTS

// Track video view - PUBLIC
app.post('/api/videos/:id/view', (req: Request, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('👀 Tracking view for video:', videoId);

    const videoIndex = videosStorage.findIndex(video => video._id === videoId);
    
    if (videoIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
    }

    const video = videosStorage[videoIndex];
    
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
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get video views - PUBLIC
app.get('/api/videos/:id/views', (req: Request, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('📊 Getting views for video:', videoId);

    const video = videosStorage.find(video => video._id === videoId);
    
    if (!video) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
    }

    const views = video.views || 0;

    res.json({
      success: true,
      views: views,
      videoId: videoId
    });
  } catch (error) {
    console.error('Get views error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Like a video - PUBLIC
app.post('/api/videos/:id/like', (req: Request, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('❤️ Liking video:', videoId);

    const videoIndex = videosStorage.findIndex(video => video._id === videoId);
    
    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const video = videosStorage[videoIndex];
    
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
  } catch (error) {
    console.error('Like video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlike a video - PUBLIC
app.post('/api/videos/:id/unlike', (req: Request, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('💔 Unliking video:', videoId);

    const videoIndex = videosStorage.findIndex(video => video._id === videoId);
    
    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const video = videosStorage[videoIndex];
    
    if (video.likes > 0) {
      video.likes -= 1;
    }
    
    video.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      likes: video.likes,
      hasLiked: false
    });
  } catch (error) {
    console.error('Unlike video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// SEARCH API ROUTE - PUBLIC
app.get('/api/search', (req: Request, res: Response) => {
  try {
    const { q: query, type } = req.query;
    console.log('🔍 Search request:', { query, type });

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Search in articles - ONLY USER-CREATED
    const articleResults = articlesStorage
      .filter(article => article.status === 'published')
      .filter(article => {
        const title = typeof article.title === 'string' 
          ? article.title 
          : article.title?.en || article.title?.ar || article.title?.ur || '';
        const description = typeof article.description === 'string'
          ? article.description
          : article.description?.en || article.description?.ar || article.description?.ur || '';
        
        return title.toLowerCase().includes(searchTerm) || 
               description.toLowerCase().includes(searchTerm) ||
               article.category?.toLowerCase().includes(searchTerm);
      })
      .map(article => ({
        id: article._id,
        title: typeof article.title === 'string' ? article.title : article.title?.en,
        description: typeof article.description === 'string' ? article.description : article.description?.en,
        url: `/article/${article._id}`,
        type: 'news',
        date: article.createdAt,
        imageUrl: article.imageUrl
      }));

    // Search in videos - ONLY USER-CREATED
    const videoResults = videosStorage
      .filter(video => video.status === 'published')
      .filter(video => {
        const title = typeof video.title === 'string' 
          ? video.title 
          : video.title?.en || video.title?.ar || video.title?.ur || '';
        const description = typeof video.description === 'string'
          ? video.description
          : video.description?.en || video.description?.ar || video.description?.ur || '';
        
        return title.toLowerCase().includes(searchTerm) || 
               description.toLowerCase().includes(searchTerm);
      })
      .map(video => ({
        id: video._id,
        title: typeof video.title === 'string' ? video.title : video.title?.en,
        description: typeof video.description === 'string' ? video.description : video.description?.en,
        url: `/video/${video._id}`,
        type: 'video',
        duration: '5:30',
        platform: video.platform
      }));

    let results = [];
    
    if (type === 'news') {
      results = articleResults;
    } else if (type === 'video') {
      results = videoResults;
    } else {
      results = [...articleResults, ...videoResults];
    }

    console.log('🔍 Search results:', results.length);

    res.json({
      success: true,
      data: results,
      total: results.length,
      query: searchTerm
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

const httpServer = createServer(app);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  throw err;
});

(async () => {
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    // serveStatic(app); // Commented out for production
  }

  console.log('🚀 Starting server...');
  console.log('🔧 PORT:', process.env.PORT);
  console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
  
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  
  httpServer.listen({
    port,
    host: "0.0.0.0", // Important for Railway
  }, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`✅ Health check available at http://0.0.0.0:${port}/health`);
    console.log(`✅ API endpoints available at http://0.0.0.0:${port}/api`);
  }).on('error', (error) => {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  });
})();