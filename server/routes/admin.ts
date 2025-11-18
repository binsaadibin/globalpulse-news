import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AdminSettings from '../models/AdminSettings.js';
import LoginAttempt from '../models/LoginAttempt.js';

const router = express.Router();

// Admin middleware
const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all users (admin only)
router.get('/users', requireAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Approve user (admin only)
router.patch('/users/:id/approve', requireAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isApproved: true,
        isActive: true 
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User approved successfully',
      user
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve user'
    });
  }
});

// Deactivate user (admin only)
router.patch('/users/:id/deactivate', requireAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deactivated successfully',
      user
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user'
    });
  }
});

// Update user role (admin only)
router.patch('/users/:id/role', requireAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
});

// Get admin settings
router.get('/settings', requireAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const settings = await AdminSettings.find();
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Update admin settings
router.patch('/settings/:key', requireAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const { settingValue, isEnabled } = req.body;
    
    const setting = await AdminSettings.findOneAndUpdate(
      { settingKey: req.params.key },
      { settingValue, isEnabled },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Setting updated successfully',
      setting
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update setting'
    });
  }
});

// Get login attempts (admin only)
router.get('/login-attempts', requireAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const attempts = await LoginAttempt.find()
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await LoginAttempt.countDocuments();

    res.json({
      success: true,
      attempts,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Get login attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch login attempts'
    });
  }
});

export default router;