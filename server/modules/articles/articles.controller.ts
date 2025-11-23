import { Response } from "express";
import { articles } from '../../db/mockData.js';

export const getArticles = (req: any, res: Response) => {
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
    res.json([]);
  }
};

export const createArticle = (req: any, res: Response) => {
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyArticles = (req: any, res: Response) => {
  try {
    console.log('📚 Fetching articles for user:', req.user.username);
    
    const userArticles = articles
      .filter(article => article.createdBy === req.user.id)
      .map(article => ({
        ...article,
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || []
      }));
    
    console.log('📊 Returning', userArticles.length, 'articles for user');
    res.json(userArticles);
  } catch (error) {
    console.error('Get my articles error:', error);
    res.json([]);
  }
};

export const updateArticle = (req: any, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('✏️ Updating article:', articleId);

    const articleIndex = articles.findIndex(article => 
      article._id === articleId && article.createdBy === req.user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteArticle = (req: any, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('🗑️ Deleting article:', articleId);

    const articleIndex = articles.findIndex(article => 
      article._id === articleId && article.createdBy === req.user.id
    );

    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const getArticleById = (req: any, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('📖 Fetching article:', articleId);

    const article = articles.find(a => a._id === articleId);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const likeArticle = (req: any, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('❤️ Liking article:', articleId);

    const articleIndex = articles.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const unlikeArticle = (req: any, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('💔 Unliking article:', articleId);

    const articleIndex = articles.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const addComment = (req: any, res: Response) => {
  try {
    const articleId = req.params.id;
    const { text, user } = req.body;
    
    console.log('💬 Adding comment to article:', articleId);

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const articleIndex = articles.findIndex(a => a._id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
};