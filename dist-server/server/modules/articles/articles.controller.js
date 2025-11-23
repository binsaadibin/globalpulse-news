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
import { articles } from '../../db/mockData.js';
export var getArticles = function (req, res) {
    try {
        console.log('📰 Fetching published articles');
        var publishedArticles = articles
            .filter(function (article) { return article.status === 'published'; })
            .map(function (article) { return (__assign(__assign({}, article), { views: article.views || 0, likes: article.likes || 0, comments: article.comments || [], readTime: article.readTime || '5 min read' })); });
        console.log('📊 Returning', publishedArticles.length, 'published articles');
        res.json(publishedArticles);
    }
    catch (error) {
        console.error('Get articles error:', error);
        res.json([]);
    }
};
export var createArticle = function (req, res) {
    try {
        console.log('📝 Creating article by:', req.user.username);
        var article = __assign(__assign({ _id: Date.now().toString() }, req.body), { views: 0, likes: 0, comments: [], readTime: req.body.readTime || '5 min read', createdBy: req.user.id, createdByUsername: req.user.username, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        articles.push(article);
        console.log('💾 Article saved. Total articles:', articles.length);
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
};
export var getMyArticles = function (req, res) {
    try {
        console.log('📚 Fetching articles for user:', req.user.username);
        var userArticles = articles
            .filter(function (article) { return article.createdBy === req.user.id; })
            .map(function (article) { return (__assign(__assign({}, article), { views: article.views || 0, likes: article.likes || 0, comments: article.comments || [] })); });
        console.log('📊 Returning', userArticles.length, 'articles for user');
        res.json(userArticles);
    }
    catch (error) {
        console.error('Get my articles error:', error);
        res.json([]);
    }
};
export var updateArticle = function (req, res) {
    try {
        var articleId_1 = req.params.id;
        console.log('✏️ Updating article:', articleId_1);
        var articleIndex = articles.findIndex(function (article) {
            return article._id === articleId_1 && article.createdBy === req.user.id;
        });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var updatedArticle = __assign(__assign(__assign({}, articles[articleIndex]), req.body), { updatedAt: new Date().toISOString() });
        articles[articleIndex] = updatedArticle;
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
};
export var deleteArticle = function (req, res) {
    try {
        var articleId_2 = req.params.id;
        console.log('🗑️ Deleting article:', articleId_2);
        var articleIndex = articles.findIndex(function (article) {
            return article._id === articleId_2 && article.createdBy === req.user.id;
        });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var deletedArticle = articles.splice(articleIndex, 1)[0];
        console.log('✅ Article deleted. Total articles:', articles.length);
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
};
export var getArticleById = function (req, res) {
    try {
        var articleId_3 = req.params.id;
        console.log('📖 Fetching article:', articleId_3);
        var article = articles.find(function (a) { return a._id === articleId_3; });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        article.views = (article.views || 0) + 1;
        article.updatedAt = new Date().toISOString();
        var enhancedArticle = __assign(__assign({}, article), { views: article.views || 0, likes: article.likes || 0, comments: article.comments || [], readTime: article.readTime || '5 min read', hasLiked: false });
        res.json(enhancedArticle);
    }
    catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export var likeArticle = function (req, res) {
    try {
        var articleId_4 = req.params.id;
        console.log('❤️ Liking article:', articleId_4);
        var articleIndex = articles.findIndex(function (a) { return a._id === articleId_4; });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var article = articles[articleIndex];
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
};
export var unlikeArticle = function (req, res) {
    try {
        var articleId_5 = req.params.id;
        console.log('💔 Unliking article:', articleId_5);
        var articleIndex = articles.findIndex(function (a) { return a._id === articleId_5; });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var article = articles[articleIndex];
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
};
export var addComment = function (req, res) {
    try {
        var articleId_6 = req.params.id;
        var _a = req.body, text = _a.text, user = _a.user;
        console.log('💬 Adding comment to article:', articleId_6);
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }
        var articleIndex = articles.findIndex(function (a) { return a._id === articleId_6; });
        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }
        var article = articles[articleIndex];
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
};
