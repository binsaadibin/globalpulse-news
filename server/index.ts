import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcryptjs';

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
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enhanced MOCK USERS with hashed passwords (in production, use real database)
const MOCK_USERS = [
  { 
    id: '1', 
    username: 'globalplus', 
    password: 'globalplus@4455', // In production, this would be hashed
    role: 'admin',
    email: 'admin@globalpulse.com',
    name: 'Global Admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  { 
    id: '2', 
    username: 'globalnews', 
    password: 'globalnews@4455', 
    role: 'admin',
    email: 'news@globalpulse.com',
    name: 'News Editor',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  { 
    id: '3', 
    username: 'haroonosmani', 
    password: 'haroon@1324', 
    role: 'editor',
    email: 'haroon@globalpulse.com',
    name: 'Haroon Osmani',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date()
  },
];

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
const JWT_EXPIRES_IN = '24h';

// Helper functions for article management
const validateArticleId = (articleId: string): boolean => {
  return articlesStorage.some(article => article._id === articleId);
};

const getArticleById = (articleId: string) => {
  return articlesStorage.find(article => article._id === articleId);
};

const getArticleIndexById = (articleId: string) => {
  return articlesStorage.findIndex(article => article._id === articleId);
};

// Enhanced articles initialization with proper IDs
let articlesStorage: any[] = [
  {
    _id: '1',
    title: {
      en: 'GlobalPulse News Platform Launch',
      ar: 'إطلاق منصة جلوبال بالس نيوز',
      ur: 'گلوبل پلس نیوز پلیٹ فارم کا آغاز'
    },
    description: {
      en: 'Welcome to our new multilingual news platform featuring the latest updates from around the world in multiple languages including English, Arabic, and Urdu.',
      ar: 'مرحبًا بكم في منصتنا الإخبارية متعددة اللغات التي تقدم آخر التحديثات من جميع أنحاء العالم بعدة لغات بما في ذلك الإنجليزية والعربية والأردية.',
      ur: 'ہمارے نئے کثیر لسانی نیوز پلیٹ فارم میں خوش آمدید جو انگریزی، عربی اور اردو سمیت متعدد زبانوں میں دنیا بھر کی تازہ ترین معلومات پیش کرتا ہے۔'
    },
    category: 'technology',
    imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop',
    status: 'published',
    isTrending: true,
    isFeatured: true,
    createdBy: '1',
    createdByUsername: 'globalplus',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 1250,
    likes: 89,
    comments: [
      {
        id: '1',
        text: 'Great platform! Looking forward to more content.',
        user: 'Reader123',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 5
      },
      {
        id: '2', 
        text: 'The multilingual support is amazing!',
        user: 'MultilingualUser',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        likes: 3
      }
    ],
    readTime: '3 min read'
  },
  {
    _id: '2',
    title: {
      en: 'Breaking: Major Technology Breakthrough',
      ar: 'عاجل: اختراق تكنولوجي كبير',
      ur: 'بریکنگ: بڑی ٹیکنالوجی کی کامیابی'
    },
    description: {
      en: 'Scientists have announced a major breakthrough in quantum computing that could revolutionize how we process information.',
      ar: 'أعلن العلماء عن اختراق كبير في الحوسبة الكمومية يمكن أن يحدث ثورة في طريقة معالجة المعلومات.',
      ur: 'سائنسدانوں نے کوانٹم کمپیوٹنگ میں ایک بڑی کامیابی کا اعلان کیا ہے جو معلومات کے پروسیس کرنے کے طریقے میں انقلاب لا سکتی ہے۔'
    },
    category: 'technology',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    status: 'published',
    isTrending: true,
    isFeatured: false,
    createdBy: '2',
    createdByUsername: 'globalnews',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    views: 890,
    likes: 45,
    comments: [
      {
        id: '1',
        text: 'This is revolutionary!',
        user: 'TechEnthusiast',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        likes: 12
      }
    ],
    readTime: '4 min read'
  },
  {
    _id: '3',
    title: {
      en: 'Global Economic Forum Concludes',
      ar: 'اختتام المنتدى الاقتصادي العالمي',
      ur: 'گلوبل اکنامک فورم کا اختتام'
    },
    description: {
      en: 'World leaders have concluded the annual economic forum with new agreements on international trade and climate change initiatives.',
      ar: 'اختتم قادة العالم المنتدى الاقتصادي السنوي باتفاقيات جديدة حول التجارة الدولية ومبادرات تغير المناخ.',
      ur: 'عالمی رہنماؤں نے بین الاقوامی تجارت اور موسمیاتی تبدیلی کے اقدامات پر نئے معاہدوں کے ساتھ سالانہ اقتصادی فورم کا اختتام کیا ہے۔'
    },
    category: 'business',
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop',
    status: 'published',
    isTrending: false,
    isFeatured: true,
    createdBy: '3',
    createdByUsername: 'haroonosmani',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    views: 670,
    likes: 32,
    comments: [],
    readTime: '5 min read'
  },
  {
    _id: '4',
    title: {
      en: 'Sports: Championship Finals This Weekend',
      ar: 'الرياضة: نهائيات البطولة هذا الأسبوع',
      ur: 'کھیل: چیمپئن شپ فائنلز اس ہفتے'
    },
    description: {
      en: 'The highly anticipated championship finals will take place this weekend with teams from around the world competing for the top prize.',
      ar: 'ستقام نهائيات البطولة المنتظرة بشدة هذا الأسبوع مع فرق من جميع أنحاء العالم تتنافس على الجائزة الكبرى.',
      ur: 'انتہائی متوقع چیمپئن شپ فائنلز اس ہفتے ہوں گے جہاں دنیا بھر کی ٹیمیں اعلیٰ انعام کے لیے مقابلہ کریں گی۔'
    },
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop',
    status: 'published',
    isTrending: true,
    isFeatured: false,
    createdBy: '1',
    createdByUsername: 'globalplus',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    views: 420,
    likes: 28,
    comments: [],
    readTime: '2 min read'
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

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    
    (req as any).user = user;
    next();
  });
};

// Enhanced Auth Routes

// Token verification endpoint
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const userData = MOCK_USERS.find(u => u.id === user.userId);
    
    if (!userData) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      valid: true, 
      user: { 
        id: userData.id, 
        username: userData.username, 
        role: userData.role,
        name: userData.name,
        email: userData.email
      } 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Token verification failed' 
    });
  }
});

// Enhanced login with better security
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid input format' 
      });
    }

    console.log('🔐 Login attempt for:', username);

    // Trim and validate input
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password cannot be empty' 
      });
    }

    // Find user
    const user = MOCK_USERS.find(u => u.username === trimmedUsername && u.password === trimmedPassword);
    
    if (!user) {
      console.log('❌ Invalid credentials for:', trimmedUsername);
      // Simulate delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate token with expiration
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        role: user.role
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log('✅ Login successful for:', user.username);

    // Return user data without password
    const userResponse = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
      expiresIn: JWT_EXPIRES_IN
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication' 
    });
  }
});

// Enhanced user info endpoint
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const userData = MOCK_USERS.find(u => u.id === user.userId);
    
    if (!userData) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Return user data without password
    res.json({ 
      success: true,
      user: {
        id: userData.id, 
        username: userData.username, 
        role: userData.role,
        name: userData.name,
        email: userData.email,
        lastLogin: userData.lastLogin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get user information' 
    });
  }
});

// Logout endpoint (client-side token removal)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For JWT without blacklist, client simply discards the token
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Refresh token endpoint
app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const userData = MOCK_USERS.find(u => u.id === user.userId);
    
    if (!userData) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      { 
        userId: userData.id,
        username: userData.username,
        role: userData.role
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token: newToken,
      expiresIn: JWT_EXPIRES_IN
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
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
    
    res.json({
      success: true,
      data: publishedArticles,
      total: publishedArticles.length
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching articles' 
    });
  }
});

// Create article - IMPROVED
app.post('/api/articles', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const userData = MOCK_USERS.find(u => u.id === user.userId);
    
    if (!userData) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    console.log('📝 Creating article by:', userData.username);

    const article = {
      _id: Date.now().toString(),
      ...req.body,
      // ADD DEFAULT VALUES FOR NEW FIELDS
      views: 0,
      likes: 0,
      comments: [],
      readTime: req.body.readTime || '5 min read',
      createdBy: userData.id,
      createdByUsername: userData.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Validate required fields
    if (!article.title || !article.description || !article.category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

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
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating article' 
    });
  }
});

// Get user's articles for dashboard - IMPROVED
app.get('/api/articles/my-articles', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    
    console.log('📚 Fetching articles for user:', user.userId);
    
    // Return user's articles with enhanced data
    const userArticles = articlesStorage
      .filter(article => article.createdBy === user.userId)
      .map(article => ({
        ...article,
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || []
      }));
    
    res.json({
      success: true,
      data: userArticles,
      total: userArticles.length
    });
  } catch (error) {
    console.error('Get user articles error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching user articles' 
    });
  }
});

// Get article details - FIXED ROUTE
app.get('/api/articles/:id', (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('📖 Fetching article:', articleId);

    // Validate article ID first
    if (!validateArticleId(articleId)) {
      console.log('❌ Article not found:', articleId);
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const article = getArticleById(articleId);
    
    if (!article) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
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
      readTime: article.readTime || '5 min read'
    };

    res.json({
      success: true,
      data: enhancedArticle
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching article' 
    });
  }
});

// Update article - IMPROVED
app.put('/api/articles/:id', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const userData = MOCK_USERS.find(u => u.id === user.userId);
    
    if (!userData) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const articleId = req.params.id;
    console.log('✏️ Updating article:', articleId);

    // Find article index
    const articleIndex = getArticleIndexById(articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const article = articlesStorage[articleIndex];
    
    // Check if user owns the article
    if (article.createdBy !== user.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'You can only update your own articles' 
      });
    }

    // Update article - preserve existing fields that aren't in update
    const updatedArticle = {
      ...article,
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
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating article' 
    });
  }
});

// Delete article - IMPROVED
app.delete('/api/articles/:id', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const userData = MOCK_USERS.find(u => u.id === user.userId);
    
    if (!userData) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const articleId = req.params.id;
    console.log('🗑️ Deleting article:', articleId);

    // Find article index
    const articleIndex = getArticleIndexById(articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const article = articlesStorage[articleIndex];
    
    // Check if user owns the article
    if (article.createdBy !== user.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'You can only delete your own articles' 
      });
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
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting article' 
    });
  }
});

// Like an article - FIXED ROUTE
app.post('/api/articles/:id/like', (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('❤️ Liking article:', articleId);

    // Validate article ID first
    if (!validateArticleId(articleId)) {
      console.log('❌ Article not found:', articleId);
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const articleIndex = getArticleIndexById(articleId);
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
    res.status(500).json({ 
      success: false,
      message: 'Server error while liking article' 
    });
  }
});

// Unlike an article - NEW ENDPOINT
app.post('/api/articles/:id/unlike', (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('💔 Unliking article:', articleId);

    // Validate article ID first
    if (!validateArticleId(articleId)) {
      console.log('❌ Article not found:', articleId);
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const articleIndex = getArticleIndexById(articleId);
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
    res.status(500).json({ 
      success: false,
      message: 'Server error while unliking article' 
    });
  }
});

// Add comment to article - IMPROVED with better error handling
app.post('/api/articles/:id/comments', (req, res) => {
  try {
    const articleId = req.params.id;
    const { text, user } = req.body;
    
    console.log('💬 Adding comment to article:', articleId);

    // Validate article ID first
    if (!validateArticleId(articleId)) {
      console.log('❌ Article not found:', articleId);
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    // Validate input
    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Comment text is required' 
      });
    }

    const article = getArticleById(articleId);
    
    if (!article) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

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
    res.status(500).json({ 
      success: false,
      message: 'Server error while adding comment' 
    });
  }
});

// Get article comments - NEW ENDPOINT
app.get('/api/articles/:id/comments', (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('💬 Fetching comments for article:', articleId);

    // Validate article ID first
    if (!validateArticleId(articleId)) {
      console.log('❌ Article not found:', articleId);
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const article = getArticleById(articleId);
    
    if (!article) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    res.json({
      success: true,
      data: {
        comments: article.comments || [],
        totalComments: (article.comments || []).length
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching comments' 
    });
  }
});

// Delete comment - NEW ENDPOINT
app.delete('/api/articles/:articleId/comments/:commentId', authenticateToken, (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    console.log('🗑️ Deleting comment:', commentId, 'from article:', articleId);

    // Validate article ID first
    if (!validateArticleId(articleId)) {
      console.log('❌ Article not found:', articleId);
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const articleIndex = getArticleIndexById(articleId);
    const article = articlesStorage[articleIndex];
    
    if (!Array.isArray(article.comments)) {
      return res.status(404).json({ 
        success: false,
        message: 'No comments found' 
      });
    }

    const commentIndex = article.comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Comment not found' 
      });
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
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting comment' 
    });
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
    
    res.json({
      success: true,
      data: publishedVideos,
      total: publishedVideos.length
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching videos' 
    });
  }
});

// Create video
app.post('/api/videos', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const userData = MOCK_USERS.find(u => u.id === user.userId);
    
    if (!userData) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    console.log('🎥 Creating video by:', userData.username);

    const video = {
      _id: Date.now().toString(),
      ...req.body,
      createdBy: userData.id,
      createdByUsername: userData.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to storage
    videosStorage.push(video);
    console.log('💾 Video saved. Total videos:', videosStorage.length);

    res.json({
      success: true,
      message: `Video ${video.status === 'draft' ? 'saved as draft' : 'published'} successfully`,
      video: video
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating video' 
    });
  }
});

// Get user's videos for dashboard
app.get('/api/videos/my-videos', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    
    console.log('📹 Fetching videos for user:', user.userId);
    
    // Return user's videos
    const userVideos = videosStorage.filter(video => video.createdBy === user.userId);
    
    res.json({
      success: true,
      data: userVideos,
      total: userVideos.length
    });
  } catch (error) {
    console.error('Get user videos error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching user videos' 
    });
  }
});

// Update video
app.put('/api/videos/:id', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const userData = MOCK_USERS.find(u => u.id === user.userId);
    
    if (!userData) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const videoId = req.params.id;
    console.log('✏️ Updating video:', videoId);

    // Find video index
    const videoIndex = videosStorage.findIndex(video => 
      video._id === videoId && video.createdBy === user.userId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
    }

    // Update video
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
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating video' 
    });
  }
});

// Delete video
app.delete('/api/videos/:id', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const userData = MOCK_USERS.find(u => u.id === user.userId);
    
    if (!userData) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const videoId = req.params.id;
    console.log('🗑️ Deleting video:', videoId);

    // Find video index
    const videoIndex = videosStorage.findIndex(video => 
      video._id === videoId && video.createdBy === user.userId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
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
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting video' 
    });
  }
});

// SEARCH API ROUTE
app.get('/api/search', (req, res) => {
  try {
    const { q: query, type } = req.query;
    console.log('🔍 Search request:', { query, type });

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'Search query is required' 
      });
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
    res.status(500).json({ 
      success: false,
      message: 'Server error while searching' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`
  });
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

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', err);
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

(async () => {
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    // serveStatic(app); // Commented out for production
  }

  console.log('🚀 Starting GlobalPulse News API Server...');
  console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔧 PORT:', process.env.PORT);
  console.log('📰 Pre-loaded articles:', articlesStorage.length);
  console.log('🎬 Pre-loaded videos:', videosStorage.length);
  console.log('👥 Available users:', MOCK_USERS.length);
  
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  
  httpServer.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`✅ Server running on port ${port}`);
    log(`🌐 Health check: http://localhost:${port}/api/health`);
    log(`🔐 Auth endpoints available`);
    log(`📰 Articles API ready with ${articlesStorage.length} articles`);
    log(`🎬 Videos API ready with ${videosStorage.length} videos`);
    log(`🔍 Search API initialized`);
  });
})();