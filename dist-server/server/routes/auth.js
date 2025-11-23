import express from 'express';
import { login, register, getMe } from '../modules/users/users.controller.js';
import { authenticateToken } from '../middleware/auth.js';
var router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken, getMe);
export default router;
