// server/routes/articles.ts
import express from 'express';
import {
  getArticles,
  createArticle,
  getMyArticles,
  updateArticle,
  deleteArticle,
  getArticleById,
  likeArticle,
  unlikeArticle,
  addComment
} from '../modules/articles/articles.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.post('/:id/like', likeArticle);
router.post('/:id/unlike', unlikeArticle);
router.post('/:id/comments', addComment);

// Protected routes - ADD THIS ROUTE
router.get('/my-articles', authenticateToken, getMyArticles);
router.post('/', authenticateToken, createArticle);
router.put('/:id', authenticateToken, updateArticle);
router.delete('/:id', authenticateToken, deleteArticle);

export default router;