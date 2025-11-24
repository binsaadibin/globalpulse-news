import { Response } from "express";

// Mock data - replace with your actual data source
const articles = [
  {
    _id: '1',
    title: { 
      en: 'Welcome to GlobalPulse News', 
      ar: 'مرحبا بكم في GlobalPulse News', 
      ur: 'GlobalPulse News میں خوش آمدید' 
    },
    description: { 
      en: 'Introduction to GlobalPulse News platform', 
      ar: 'مقدمة في منصة GlobalPulse News', 
      ur: 'GlobalPulse News پلیٹ فارم کا تعارف' 
    },
    content: { 
      en: 'This is the first article on our new platform...', 
      ar: 'هذه هي المقالة الأولى على منصتنا الجديدة...', 
      ur: 'یہ ہمارے نئے پلیٹ فارم کا پہلا مضمون ہے...' 
    },
    category: 'technology',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop',
    views: 150,
    likes: 25,
    comments: [],
    readTime: '3 min read',
    createdBy: '1',
    createdByUsername: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: true,
    isTrending: false
  },
  {
    _id: '2', 
    title: { 
      en: 'Getting Started with Content Creation', 
      ar: 'بدء إنشاء المحتوى', 
      ur: 'مواد کی تخلیق کے ساتھ آغاز' 
    },
    description: { 
      en: 'Guide for new content creators', 
      ar: 'دليل لمنشئي المحتوى الجدد', 
      ur: 'نئے مواد تخلیق کاروں کے لیے گائیڈ' 
    },
    content: { 
      en: 'Learn how to create amazing content on our platform...', 
      ar: 'تعلم كيفية إنشاء محتوى رائع على منصتنا...', 
      ur: 'ہمارے پلیٹ فارم پر حیرت انگیز مواد بنانے کا طریقہ سیکھیں...' 
    },
    category: 'technology',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    views: 89,
    likes: 12,
    comments: [],
    readTime: '5 min read',
    createdBy: '2',
    createdByUsername: 'john_doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: false,
    isTrending: true
  },
  {
    _id: '3',
    title: { 
      en: 'The Future of Artificial Intelligence', 
      ar: 'مستقبل الذكاء الاصطناعي', 
      ur: 'مصنوعی ذہانت کا مستقبل' 
    },
    description: { 
      en: 'Exploring the latest advancements in AI technology', 
      ar: 'استكشاف أحدث التطورات في تكنولوجيا الذكاء الاصطناعي', 
      ur: 'AI ٹیکنالوجی میں تازہ ترین ترقیات کی دریافت' 
    },
    content: { 
      en: 'Artificial intelligence is transforming industries worldwide...', 
      ar: 'الذكاء الاصطناعي يحول الصناعات في جميع أنحاء العالم...', 
      ur: 'مصنوعی ذہاعت دنیا بھر کی صنعتوں کو تبدیل کر رہی ہے...' 
    },
    category: 'technology',
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    views: 0,
    likes: 0,
    comments: [],
    readTime: '7 min read',
    createdBy: '1',
    createdByUsername: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: false,
    isTrending: false
  }
];

export const getArticles = (req, res) => {
  try {
    console.log('📰 Fetching published articles');
    
    const publishedArticles = articles
      .filter(article => article.status === 'published')
      .map(article => ({
        ...article,
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || [],
        readTime: article.readTime || '5 min read'
      }));
    
    console.log('📊 Returning', publishedArticles.length, 'published articles');
    res.json(publishedArticles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json([]);
  }
};

export const getMyArticles = async (req, res) => {
  try {
    console.log('📚 GET MY ARTICLES - User:', req.user?.username, 'ID:', req.user?.id);
    
    if (!req.user || !req.user.id) {
      console.log('❌ No user authenticated');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        articles: [],
        count: 0
      });
    }

    const userArticles = articles.filter(article => {
      const matches = article.createdBy === req.user.id;
      console.log(`📝 Article ${article._id}: createdBy=${article.createdBy}, user=${req.user.id}, matches=${matches}`);
      return matches;
    });

    console.log(`✅ Found ${userArticles.length} articles for user ${req.user.username}`);
    
    res.json({
      success: true,
      articles: userArticles,
      count: userArticles.length
    });
  } catch (error) {
    console.error('❌ Get my articles error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user articles',
      articles: [],
      count: 0
    });
  }
};

export const createArticle = (req, res) => {
  try {
    console.log('📝 Creating article by:', req.user.username);

    const article = {
      _id: Date.now().toString(),
      ...req.body,
      views: 0,
      likes: 0,
      comments: [],
      readTime: req.body.readTime || '5 min read',
      createdBy: req.user.id,
      createdByUsername: req.user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    articles.push(article);
    console.log('💾 Article saved. Total articles:', articles.length);

    res.json({
      success: true,
      message: `Article ${article.status === 'draft' ? 'saved as draft' : 'published'} successfully`,
      article: article
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating article'
    });
  }
};

export const updateArticle = (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('✏️ Updating article:', articleId);

    const articleIndex = articles.findIndex(article => 
      article._id === articleId && article.createdBy === req.user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const updatedArticle = {
      ...articles[articleIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    articles[articleIndex] = updatedArticle;

    console.log('✅ Article updated successfully');

    res.json({
      success: true,
      message: `Article ${updatedArticle.status === 'draft' ? 'draft updated' : 'updated and published'} successfully`,
      article: updatedArticle
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating article'
    });
  }
};

export const deleteArticle = (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('🗑️ Deleting article:', articleId);

    const articleIndex = articles.findIndex(article => 
      article._id === articleId && article.createdBy === req.user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const deletedArticle = articles.splice(articleIndex, 1)[0];
    console.log('✅ Article deleted. Total articles:', articles.length);

    res.json({
      success: true,
      message: 'Article deleted successfully',
      article: deletedArticle
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting article'
    });
  }
};

export const getArticleById = (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('📖 Fetching article:', articleId);

    const article = articles.find(a => a._id === articleId);
    
    if (!article) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

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
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching article'
    });
  }
};

export const likeArticle = (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('❤️ Liking article:', articleId);

    const articleIndex = articles.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const article = articles[articleIndex];
    
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
      message: 'Server error liking article'
    });
  }
};

export const unlikeArticle = (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('💔 Unliking article:', articleId);

    const articleIndex = articles.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const article = articles[articleIndex];
    
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
      message: 'Server error unliking article'
    });
  }
};

export const addComment = (req, res) => {
  try {
    const articleId = req.params.id;
    const { text, user } = req.body;
    
    console.log('💬 Adding comment to article:', articleId);

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Comment text is required' 
      });
    }

    const articleIndex = articles.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const article = articles[articleIndex];
    
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
      message: 'Server error adding comment'
    });
  }
};