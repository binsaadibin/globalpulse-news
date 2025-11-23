import { Response } from "express";
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { AuthRequest } from '../../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_here_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Initialize default admin users
export const initializeDefaultUsers = async () => {
  try {
    const defaultUsers = [
      {
        firstName: 'Global',
        lastName: 'Admin',
        username: 'globalplus',
        email: 'admin@globalpulse.com',
        password: 'globalplus@4455',
        role: 'admin' as const,
        permissions: ['all'],
        isActive: true,
        isApproved: true
      },
      {
        firstName: 'Global',
        lastName: 'News',
        username: 'globalnews',
        email: 'news@globalpulse.com',
        password: 'globalnews@4455',
        role: 'admin' as const,
        permissions: ['all'],
        isActive: true,
        isApproved: true
      },
      {
        firstName: 'Haroon',
        lastName: 'Osmani',
        username: 'haroonosmani',
        email: 'haroon@globalpulse.com',
        password: 'haroon@1324',
        role: 'editor' as const,
        permissions: ['create:articles', 'edit:articles', 'create:videos', 'edit:videos'],
        isActive: true,
        isApproved: true
      }
    ];

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ 
        $or: [
          { email: userData.email },
          { username: userData.username }
        ] 
      });

      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created default user: ${userData.username}`);
      } else {
        // Update existing user to ensure correct permissions
        await User.findOneAndUpdate(
          { username: userData.username },
          { 
            ...userData,
            password: existingUser.password // Keep existing password
          }
        );
        console.log(`✅ Updated default user: ${userData.username}`);
      }
    }

    console.log('✅ Default users initialization completed');
  } catch (error) {
    console.error('❌ Error initializing default users:', error);
  }
};

// User login
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('🔐 Login attempt:', username);

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is inactive:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Account is deactivated. Please contact administrator.' 
      });
    }

    // Check if user is approved
    if (!user.isApproved && user.role !== 'admin') {
      console.log('❌ User account not approved:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Account pending approval. Please contact administrator.' 
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    console.log('✅ Login successful for:', username);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
        firstName: user.firstName,
        lastName: user.lastName,
        lastLogin: user.lastLogin
      },
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// User registration
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    console.log('👤 Registration attempt:', username);

    // Validation
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user (initially inactive until admin approval)
    const user = new User({
      firstName,
      lastName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: 'viewer',
      isActive: true, // Auto-activate for now, can change to false for admin approval
      isApproved: true, // Auto-approve for now
      permissions: ['read:articles', 'read:videos']
    });

    await user.save();

    console.log('✅ User registered successfully:', username);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Get current user
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
        firstName: user.firstName,
        lastName: user.lastName,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};