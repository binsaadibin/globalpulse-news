import express from 'express';
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  toggleUserActivation, 
  deleteUser,
  getUserStats
} from '../modules/users/admin.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

console.log('🛣️ Loading advanced admin routes...');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Apply rate limiting to admin routes
router.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
}));

// User management routes with advanced features
router.get('/users', getAllUsers); // GET /api/admin/users?page=1&limit=10&role=admin&search=john
router.post('/users', createUser); // POST /api/admin/users
router.put('/users/:id', updateUser); // PUT /api/admin/users/:id
router.patch('/users/:id/toggle-activation', toggleUserActivation); // PATCH /api/admin/users/:id/toggle-activation
router.delete('/users/:id', deleteUser); // DELETE /api/admin/users/:id

// Statistics and analytics
router.get('/stats', getUserStats); // GET /api/admin/stats

// Admin dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // This would typically aggregate data from multiple collections
    res.json({
      success: true,
      dashboard: {
        message: 'Admin dashboard endpoint - extend with your specific metrics',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
});

console.log('✅ Advanced admin routes loaded:');
console.log('   GET    /api/admin/users');
console.log('   POST   /api/admin/users');
console.log('   PUT    /api/admin/users/:id');
console.log('   PATCH  /api/admin/users/:id/toggle-activation');
console.log('   DELETE /api/admin/users/:id');
console.log('   GET    /api/admin/stats');
console.log('   GET    /api/admin/dashboard');

export default router;