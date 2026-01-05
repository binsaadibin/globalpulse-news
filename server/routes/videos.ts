import express from 'express';
import {
  getVideos,
  createVideo,
  getMyVideos,
  updateVideo,
  deleteVideo,
  trackView,
  getVideoViews,
  likeVideo,
  unlikeVideo,
  getFeaturedVideos,
  getTrendingVideos,
  getLiveVideos,
  getShortsVideos,
  getPopularVideos
} from '../modules/videos/videos.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes - Filter endpoints
router.get('/', getVideos);
router.get('/featured', getFeaturedVideos);
router.get('/trending', getTrendingVideos);
router.get('/live', getLiveVideos);
router.get('/shorts', getShortsVideos);
router.get('/popular', getPopularVideos);

// Video interaction routes (public)
router.post('/:id/view', trackView);
router.get('/:id/views', getVideoViews);
router.post('/:id/like', likeVideo);
router.post('/:id/unlike', unlikeVideo);

// Protected routes (require authentication)
router.post('/', authenticateToken, createVideo);
router.get('/my-videos', authenticateToken, getMyVideos);
router.put('/:id', authenticateToken, updateVideo);
router.delete('/:id', authenticateToken, deleteVideo);

export default router;