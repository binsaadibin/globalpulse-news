import express from 'express';
import { Article } from '../models/Article';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all articles (for home page)
router.get('/', async (req, res) => {
  try {
    const { category, search, language = 'en' } = req.query;
    
    let filter: any = { status: 'published' };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter[`title.${language}`] = { $regex: search, $options: 'i' };
    }

    const articles = await Article.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create article
router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const article = new Article({
      ...req.body,
      createdBy: req.user._id,
    });

    await article.save();
    await article.populate('createdBy', 'username');
    
    res.status(201).json(article);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's articles for dashboard
router.get('/my-articles', auth, async (req: AuthRequest, res) => {
  try {
    const articles = await Article.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;