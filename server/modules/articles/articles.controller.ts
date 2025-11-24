import { Response } from "express";

// Mock data - using the same structure as videos
const articles: any[] = [
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
    createdBy: '69233afabbee0ece537f7574',
    createdByUsername: 'globalplus',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: true,
    isTrending: false
  }
];

// Get all published articles
export const getArticles = (req: any, res: Response) => {
  try {
    console.log('📰 Fetching published articles');
    const publishedArticles = articles.filter(article => article.status === 'published');
    console.log('✅ Returning', publishedArticles.length, 'published articles');
    res.json(publishedArticles);
  } catch (error) {
    console.error('❌ Get articles error:', error);
    res.status(500).json([]);
  }
};

// Create article
export const createArticle = (req: any, res: Response) => {
  try {
    console.log('📝 CREATE ARTICLE - User:', req.user?.username, 'ID:', req.user?.id);
    
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
    console.error('❌ Create article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating article' 
    });
  }
};

// Get user's articles - SIMPLE AND CLEAN
export const getMyArticles = (req: any, res: Response) => {
  try {
    console.log('📚 GET MY ARTICLES - User:', req.user?.username, 'ID:', req.user?.id);
    
    if (!req.user || !req.user.id) {
      console.log('❌ No user authenticated');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        articles: []
      });
    }

    const userArticles = articles.filter(article => article.createdBy === req.user.id);
    console.log('✅ Found', userArticles.length, 'articles for user', req.user.username);

    res.json(userArticles); // Return array directly, just like getMyVideos
    
  } catch (error) {
    console.error('❌ Get my articles error:', error);
    res.status(500).json([]);
  }
};

// Update article
export const updateArticle = (req: any, res: Response) => {
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

    articles[articleIndex] = {
      ...articles[articleIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Article updated successfully');

    res.json({
      success: true,
      message: `Article ${articles[articleIndex].status === 'draft' ? 'draft updated' : 'updated and published'} successfully`,
      article: articles[articleIndex]
    });
  } catch (error) {
    console.error('❌ Update article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating article' 
    });
  }
};

// Delete article
export const deleteArticle = (req: any, res: Response) => {
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
    console.error('❌ Delete article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting article' 
    });
  }
};

// Get article by ID
export const getArticleById = (req: any, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('📖 Fetching article:', articleId);

    const article = articles.find(article => article._id === articleId);
    
    if (!article) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    // Increment views
    const articleIndex = articles.findIndex(article => article._id === articleId);
    if (articleIndex !== -1) {
      articles[articleIndex].views = (articles[articleIndex].views || 0) + 1;
      articles[articleIndex].updatedAt = new Date().toISOString();
    }

    res.json(article);
  } catch (error) {
    console.error('❌ Get article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching article' 
    });
  }
};

// Like article
export const likeArticle = (req: any, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('❤️ Liking article:', articleId);

    const articleIndex = articles.findIndex(article => article._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const article = articles[articleIndex];
    article.likes = (article.likes || 0) + 1;
    article.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      likes: article.likes,
      hasLiked: true
    });
  } catch (error) {
    console.error('❌ Like article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error liking article' 
    });
  }
};

// Unlike article
export const unlikeArticle = (req: any, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('💔 Unliking article:', articleId);

    const articleIndex = articles.findIndex(article => article._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found' 
      });
    }

    const article = articles[articleIndex];
    article.likes = Math.max(0, (article.likes || 0) - 1);
    article.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      likes: article.likes,
      hasLiked: false
    });
  } catch (error) {
    console.error('❌ Unlike article error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error unliking article' 
    });
  }
};

// Add comment
export const addComment = (req: any, res: Response) => {
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

    const articleIndex = articles.findIndex(article => article._id === articleId);
    
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
    console.error('❌ Add comment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error adding comment' 
    });
  }
};