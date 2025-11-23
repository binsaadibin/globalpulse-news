import express from 'express';
import { getVideos, createVideo, getMyVideos, updateVideo, deleteVideo, trackView, getVideoViews, likeVideo, unlikeVideo } from '../modules/videos/videos.controller.js';
import { authenticateToken } from '../middleware/auth.js';
var router = express.Router();
// Public routes
router.get('/', getVideos);
router.post('/:id/view', trackView);
router.get('/:id/views', getVideoViews);
router.post('/:id/like', likeVideo);
router.post('/:id/unlike', unlikeVideo);
// Protected routes
router.post('/', authenticateToken, createVideo);
router.get('/my-videos', authenticateToken, getMyVideos);
router.put('/:id', authenticateToken, updateVideo);
router.delete('/:id', authenticateToken, deleteVideo);
export default router;
