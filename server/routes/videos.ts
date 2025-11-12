import express from 'express';
import { Video } from '../models/Video';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    const { platform, search, language = 'en' } = req.query;
    
    let filter: any = { status: 'published' };
    
    if (platform && platform !== 'all') {
      filter.platform = platform;
    }
    
    if (search) {
      filter[`title.${language}`] = { $regex: search, $options: 'i' };
    }

    const videos = await Video.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create video
router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const video = new Video({
      ...req.body,
      createdBy: req.user._id,
    });

    await video.save();
    await video.populate('createdBy', 'username');
    
    res.status(201).json(video);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's videos for dashboard
router.get('/my-videos', auth, async (req: AuthRequest, res) => {
  try {
    const videos = await Video.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;