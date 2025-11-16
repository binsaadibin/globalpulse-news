import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
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
      'https://globalpulse-news-production-31ee.up.railway.app'
    ];
    
    // Check if the origin is in allowed list or is a Netlify subdomain
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Handle preflight requests
app.options('*', cors());

// Root route for Railway health checks
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GlobalPulse News API is running',
    timestamp: new Date().toISOString()
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

// Initialize articles with proper structure
let articlesStorage: any[] = [
  {
    _id: '1',
    title: {
      en: 'Welcome to Global News Dashboard',
      ar: 'مرحبًا بكم في لوحة أخبار العالمية',
      ur: 'گلوبل نیوز ڈیش بورڈ میں خوش آمدید'
    },
    description: {
      en: 'This is your news platform where you can create and manage multilingual content',
      ar: 'هذه هي منصتكم الإخبارية حيث يمكنكم إنشاء وإدارة المحتوى متعدد اللغات',
      ur: 'یہ آپ کا نیوز پلیٹ فارم ہے جہاں آپ کثیر لسانی مواد تخلیق اور منظم کر سکتے ہیں'
    },
    category: 'technology',
    imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=300&fit=crop',
    status: 'published',
    isTrending: true,
    isFeatured: true,
    createdBy: '1',
    createdByUsername: 'globalplus',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    comments: [],
    readTime: '5 min read'
  }
];

let videosStorage: any[] = [
  {
    _id: '1',
    title: {
      en: 'Welcome Video Tutorial',
      ar: 'فيديو تعريفي ترحيبي',
      ur: 'خوش آمدید ویڈیو ٹیوٹوریل'
    },
    description: {
      en: 'Learn how to use the Global News Dashboard platform',
      ar: 'تعلم كيفية استخدام منصة لوحة أخبار العالمية',
      ur: 'گلوبل نیوز ڈیش بورڈ پلیٹ فارم کا استعمال کیسے کریں'
    },
    platform: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=example',
    status: 'published',
    createdBy: '1',
    createdByUsername: 'admin1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
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

app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
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

// Get all published articles (for home page) - IMPROVED
app.get('/api/articles', (req, res) => {
  try {
    console.log('📰 Fetching published articles for home page');
    
    // Return only published articles with enhanced data
    const publishedArticles = articlesStorage
      .filter(article => article.status === 'published')
      .map(article => ({
        ...article,
        // Ensure all articles have the new fields
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || [],
        readTime: article.readTime || '5 min read'
      }));
    
    console.log('📊 Returning', publishedArticles.length, 'published articles');
    
    res.json(publishedArticles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create article - IMPROVED
app.post('/api/articles', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('📝 Creating article by:', user.username);

    const article = {
      _id: Date.now().toString(),
      ...req.body,
      // ADD DEFAULT VALUES FOR NEW FIELDS
      views: 0,
      likes: 0,
      comments: [],
      readTime: req.body.readTime || '5 min read',
      createdBy: user.id,
      createdByUsername: user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to storage
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

// Get user's articles for dashboard - IMPROVED
app.get('/api/articles/my-articles', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    
    console.log('📚 Fetching articles for user:', decoded.userId);
    
    // Return user's articles with enhanced data
    const userArticles = articlesStorage
      .filter(article => article.createdBy === decoded.userId)
      .map(article => ({
        ...article,
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || []
      }));
    
    res.json(userArticles);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update article - IMPROVED
app.put('/api/articles/:id', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const articleId = req.params.id;
    console.log('✏️ Updating article:', articleId);

    // Find article index
    const articleIndex = articlesStorage.findIndex(article => 
      article._id === articleId && article.createdBy === user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Update article - preserve existing fields that aren't in update
    const updatedArticle = {
      ...articlesStorage[articleIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    articlesStorage[articleIndex] = updatedArticle;

    console.log('✅ Article updated successfully');
    console.log('📊 Article status:', updatedArticle.status);

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

// Delete article - IMPROVED
app.delete('/api/articles/:id', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const articleId = req.params.id;
    console.log('🗑️ Deleting article:', articleId);

    // Find article index
    const articleIndex = articlesStorage.findIndex(article => 
      article._id === articleId && article.createdBy === user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Remove article
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

// Get article details - FIXED ROUTE
app.get('/api/articles/:id', (req, res) => {
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

    // Ensure all required fields exist
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

// Like an article - FIXED ROUTE
app.post('/api/articles/:id/like', (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('❤️ Liking article:', articleId);

    const articleIndex = articlesStorage.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = articlesStorage[articleIndex];
    
    // Initialize likes if not exists
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

// Unlike an article - NEW ENDPOINT
app.post('/api/articles/:id/unlike', (req, res) => {
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

// Add comment to article - FIXED ROUTE
app.post('/api/articles/:id/comments', (req, res) => {
  try {
    const articleId = req.params.id;
    const { text, user } = req.body;
    
    console.log('💬 Adding comment to article:', articleId);

    // Validate input
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const articleIndex = articlesStorage.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = articlesStorage[articleIndex];
    
    // Initialize comments array if it doesn't exist
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

// Get article comments - NEW ENDPOINT
app.get('/api/articles/:id/comments', (req, res) => {
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

// Delete comment - NEW ENDPOINT
app.delete('/api/articles/:articleId/comments/:commentId', (req, res) => {
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

// Get all published videos
app.get('/api/videos', (req, res) => {
  try {
    console.log('🎬 Fetching published videos for videos page');
    
    // Return only published videos
    const publishedVideos = videosStorage.filter(video => video.status === 'published');
    console.log('📊 Returning', publishedVideos.length, 'published videos');
    
    res.json(publishedVideos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create video
app.post('/api/videos', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('🎥 Creating video by:', user.username);
    console.log('Video data:', req.body);

    const video = {
      _id: Date.now().toString(),
      ...req.body,
      createdBy: user.id,
      createdByUsername: user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to storage
    videosStorage.push(video);
    console.log('💾 Video saved. Total videos:', videosStorage.length);
    console.log('📊 Video status:', video.status);

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

// Get user's videos for dashboard
app.get('/api/videos/my-videos', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    
    console.log('📹 Fetching videos for user:', decoded.userId);
    
    // Return user's videos
    const userVideos = videosStorage.filter(video => video.createdBy === decoded.userId);
    res.json(userVideos);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update video
app.put('/api/videos/:id', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const videoId = req.params.id;
    console.log('✏️ Updating video:', videoId);
    console.log('Update data:', req.body);

    // Find video index
    const videoIndex = videosStorage.findIndex(video => 
      video._id === videoId && video.createdBy === user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update video
    videosStorage[videoIndex] = {
      ...videosStorage[videoIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Video updated successfully');
    console.log('📊 Video status:', videosStorage[videoIndex].status);

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

// Delete video
app.delete('/api/videos/:id', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const videoId = req.params.id;
    console.log('🗑️ Deleting video:', videoId);

    // Find video index
    const videoIndex = videosStorage.findIndex(video => 
      video._id === videoId && video.createdBy === user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Remove video
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

// SEARCH API ROUTE
app.get('/api/search', (req, res) => {
  try {
    const { q: query, type } = req.query;
    console.log('🔍 Search request:', { query, type });

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Search in articles
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

    // Search in videos
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
app.use((req, res, next) => {
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

  console.log('🚀 DEBUG: Starting server...');
  console.log('🔧 DEBUG: process.env.PORT =', process.env.PORT);
  console.log('🔧 DEBUG: NODE_ENV =', process.env.NODE_ENV);
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  console.log('🎯 DEBUG: Final port to use =', port);
  httpServer.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
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
      'https://globalpulse-news-production-31ee.up.railway.app'
    ];
    
    // Check if the origin is in allowed list or is a Netlify subdomain
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Handle preflight requests
app.options('*', cors());

// Root route for Railway health checks
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GlobalPulse News API is running',
    timestamp: new Date().toISOString()
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

// Initialize articles with proper structure
let articlesStorage: any[] = [
  {
    _id: '1',
    title: {
      en: 'Welcome to Global News Dashboard',
      ar: 'مرحبًا بكم في لوحة أخبار العالمية',
      ur: 'گلوبل نیوز ڈیش بورڈ میں خوش آمدید'
    },
    description: {
      en: 'This is your news platform where you can create and manage multilingual content',
      ar: 'هذه هي منصتكم الإخبارية حيث يمكنكم إنشاء وإدارة المحتوى متعدد اللغات',
      ur: 'یہ آپ کا نیوز پلیٹ فارم ہے جہاں آپ کثیر لسانی مواد تخلیق اور منظم کر سکتے ہیں'
    },
    category: 'technology',
    imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=300&fit=crop',
    status: 'published',
    isTrending: true,
    isFeatured: true,
    createdBy: '1',
    createdByUsername: 'globalplus',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    comments: [],
    readTime: '5 min read'
  }
];

let videosStorage: any[] = [
  {
    _id: '1',
    title: {
      en: 'Welcome Video Tutorial',
      ar: 'فيديو تعريفي ترحيبي',
      ur: 'خوش آمدید ویڈیو ٹیوٹوریل'
    },
    description: {
      en: 'Learn how to use the Global News Dashboard platform',
      ar: 'تعلم كيفية استخدام منصة لوحة أخبار العالمية',
      ur: 'گلوبل نیوز ڈیش بورڈ پلیٹ فارم کا استعمال کیسے کریں'
    },
    platform: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=example',
    status: 'published',
    createdBy: '1',
    createdByUsername: 'admin1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
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

app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
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

// Get all published articles (for home page) - IMPROVED
app.get('/api/articles', (req, res) => {
  try {
    console.log('📰 Fetching published articles for home page');
    
    // Return only published articles with enhanced data
    const publishedArticles = articlesStorage
      .filter(article => article.status === 'published')
      .map(article => ({
        ...article,
        // Ensure all articles have the new fields
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || [],
        readTime: article.readTime || '5 min read'
      }));
    
    console.log('📊 Returning', publishedArticles.length, 'published articles');
    
    res.json(publishedArticles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create article - IMPROVED
app.post('/api/articles', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('📝 Creating article by:', user.username);

    const article = {
      _id: Date.now().toString(),
      ...req.body,
      // ADD DEFAULT VALUES FOR NEW FIELDS
      views: 0,
      likes: 0,
      comments: [],
      readTime: req.body.readTime || '5 min read',
      createdBy: user.id,
      createdByUsername: user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to storage
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

// Get user's articles for dashboard - IMPROVED
app.get('/api/articles/my-articles', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    
    console.log('📚 Fetching articles for user:', decoded.userId);
    
    // Return user's articles with enhanced data
    const userArticles = articlesStorage
      .filter(article => article.createdBy === decoded.userId)
      .map(article => ({
        ...article,
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || []
      }));
    
    res.json(userArticles);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update article - IMPROVED
app.put('/api/articles/:id', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const articleId = req.params.id;
    console.log('✏️ Updating article:', articleId);

    // Find article index
    const articleIndex = articlesStorage.findIndex(article => 
      article._id === articleId && article.createdBy === user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Update article - preserve existing fields that aren't in update
    const updatedArticle = {
      ...articlesStorage[articleIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    articlesStorage[articleIndex] = updatedArticle;

    console.log('✅ Article updated successfully');
    console.log('📊 Article status:', updatedArticle.status);

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

// Delete article - IMPROVED
app.delete('/api/articles/:id', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const articleId = req.params.id;
    console.log('🗑️ Deleting article:', articleId);

    // Find article index
    const articleIndex = articlesStorage.findIndex(article => 
      article._id === articleId && article.createdBy === user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Remove article
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

// Get article details - FIXED ROUTE
app.get('/api/articles/:id', (req, res) => {
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

    // Ensure all required fields exist
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

// Like an article - FIXED ROUTE
app.post('/api/articles/:id/like', (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('❤️ Liking article:', articleId);

    const articleIndex = articlesStorage.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = articlesStorage[articleIndex];
    
    // Initialize likes if not exists
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

// Unlike an article - NEW ENDPOINT
app.post('/api/articles/:id/unlike', (req, res) => {
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

// Add comment to article - FIXED ROUTE
app.post('/api/articles/:id/comments', (req, res) => {
  try {
    const articleId = req.params.id;
    const { text, user } = req.body;
    
    console.log('💬 Adding comment to article:', articleId);

    // Validate input
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const articleIndex = articlesStorage.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = articlesStorage[articleIndex];
    
    // Initialize comments array if it doesn't exist
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

// Get article comments - NEW ENDPOINT
app.get('/api/articles/:id/comments', (req, res) => {
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

// Delete comment - NEW ENDPOINT
app.delete('/api/articles/:articleId/comments/:commentId', (req, res) => {
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

// Get all published videos
app.get('/api/videos', (req, res) => {
  try {
    console.log('🎬 Fetching published videos for videos page');
    
    // Return only published videos
    const publishedVideos = videosStorage.filter(video => video.status === 'published');
    console.log('📊 Returning', publishedVideos.length, 'published videos');
    
    res.json(publishedVideos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create video
app.post('/api/videos', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('🎥 Creating video by:', user.username);
    console.log('Video data:', req.body);

    const video = {
      _id: Date.now().toString(),
      ...req.body,
      createdBy: user.id,
      createdByUsername: user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to storage
    videosStorage.push(video);
    console.log('💾 Video saved. Total videos:', videosStorage.length);
    console.log('📊 Video status:', video.status);

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

// Get user's videos for dashboard
app.get('/api/videos/my-videos', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    
    console.log('📹 Fetching videos for user:', decoded.userId);
    
    // Return user's videos
    const userVideos = videosStorage.filter(video => video.createdBy === decoded.userId);
    res.json(userVideos);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update video
app.put('/api/videos/:id', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const videoId = req.params.id;
    console.log('✏️ Updating video:', videoId);
    console.log('Update data:', req.body);

    // Find video index
    const videoIndex = videosStorage.findIndex(video => 
      video._id === videoId && video.createdBy === user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update video
    videosStorage[videoIndex] = {
      ...videosStorage[videoIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Video updated successfully');
    console.log('📊 Video status:', videosStorage[videoIndex].status);

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

// Delete video
app.delete('/api/videos/:id', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'fallback_secret') as any;
    const user = MOCK_USERS.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const videoId = req.params.id;
    console.log('🗑️ Deleting video:', videoId);

    // Find video index
    const videoIndex = videosStorage.findIndex(video => 
      video._id === videoId && video.createdBy === user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Remove video
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

// SEARCH API ROUTE
app.get('/api/search', (req, res) => {
  try {
    const { q: query, type } = req.query;
    console.log('🔍 Search request:', { query, type });

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Search in articles
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

    // Search in videos
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
app.use((req, res, next) => {
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

  console.log('🚀 DEBUG: Starting server...');
  console.log('🔧 DEBUG: process.env.PORT =', process.env.PORT);
  console.log('🔧 DEBUG: NODE_ENV =', process.env.NODE_ENV);
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  console.log('🎯 DEBUG: Final port to use =', port);
  httpServer.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();