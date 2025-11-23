import express from 'express';
import { login, register, getMe } from '../modules/users/users.controller.js'; // ← Use users controller, not auth
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken, getMe);

export default router;