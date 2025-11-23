import express from 'express';
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  toggleUserActivation, 
  deleteUser 
} from '../modules/users/admin.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

// User management routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/toggle-activation', toggleUserActivation);
router.delete('/users/:id', deleteUser);

export default router;