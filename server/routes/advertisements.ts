import express from 'express';
import {
  getAdvertisements,
  getAdvertisementsByPosition,
  createAdvertisement,
  getMyAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  trackAdClick,
  trackAdImpression
} from '../modules/advertisements/advertisements.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAdvertisements);
router.get('/position/:position', getAdvertisementsByPosition);

// Advertisement interaction routes (public)
router.post('/:id/click', trackAdClick);
router.post('/:id/impression', trackAdImpression);

// Protected routes (require authentication)
router.post('/', authenticateToken, createAdvertisement);
router.get('/my-ads', authenticateToken, getMyAdvertisements);
router.put('/:id', authenticateToken, updateAdvertisement);
router.delete('/:id', authenticateToken, deleteAdvertisement);

export default router;