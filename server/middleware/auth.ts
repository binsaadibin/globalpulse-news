import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_here_change_in_production';

export interface AuthRequest extends Request {
  user?: any; // Change to any to include both id and userId
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('🔐 JWT Decoded:', decoded); // Debug log
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(403).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        success: false,
        message: 'Account is deactivated' 
      });
    }

    // FIX: Set both id and userId for compatibility
    req.user = {
      ...user.toObject(),
      id: user._id.toString(), // Add id field for compatibility
      userId: user._id.toString() // Keep userId for existing code
    };

    console.log('✅ User set in request:', { 
      id: req.user.id, 
      userId: req.user.userId,
      username: req.user.username 
    });

    next();
  } catch (error) {
    console.error('❌ JWT verification error:', error);
    return res.status(403).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};