import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_secure_jwt_secret_key_change_in_production_2024';

export const authenticateToken = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required',
        code: 'MISSING_TOKEN'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid token payload',
        code: 'INVALID_TOKEN'
      });
    }

    const user = await User.findById(decoded.userId).select('-password -loginAttempts -lockUntil');
    
    if (!user) {
      return res.status(403).json({ 
        success: false,
        message: 'User account not found',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        success: false,
        message: 'Account is deactivated. Please contact administrator.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Account pending approval. Please contact administrator.',
        code: 'ACCOUNT_PENDING_APPROVAL'
      });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(500).json({ 
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: `Insufficient permissions. Required roles: ${roles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

export const optionalAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findById(decoded.userId).select('-password -loginAttempts -lockUntil');
      
      if (user && user.isActive && (user.isApproved || user.role === 'admin')) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional routes
    next();
  }
};