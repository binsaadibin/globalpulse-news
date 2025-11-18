import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';
import AdminSettings from '../models/AdminSettings.js';
import LoginAttempt from '../models/LoginAttempt.js';

const router = express.Router();

// Check if registration is enabled
const checkRegistrationEnabled = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const setting = await AdminSettings.findOne({ settingKey: 'registration_enabled' });
    if (!setting || !setting.isEnabled) {
      return res.status(403).json({
        success: false,
        message: 'New registrations are currently disabled by administrator'
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Register new user (requires admin approval)
router.post('/register', checkRegistrationEnabled, async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user (initially inactive and unapproved)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profile: { firstName, lastName },
      isActive: false,
      isApproved: false,
      role: 'viewer'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please wait for admin approval.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login user
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body;

    // Log login attempt
    const loginAttempt = new LoginAttempt({
      username,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
      success: false
    });

    // Find user
    const user = await User.findOne({
      $or: [{ email: username }, { username }]
    });

    if (!user) {
      loginAttempt.reason = 'User not found';
      await loginAttempt.save();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is approved
    if (!user.isApproved) {
      loginAttempt.reason = 'User not approved';
      await loginAttempt.save();
      
      return res.status(401).json({
        success: false,
        message: 'Your account is pending admin approval'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      loginAttempt.reason = 'User inactive';
      await loginAttempt.save();
      
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      loginAttempt.reason = 'Invalid password';
      await loginAttempt.save();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update user last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expires