import { Response } from "express";
import User from '../../models/User.js';
import { AuthRequest } from '../../middleware/auth.js';

// Get all users (for admin)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📋 Fetching all users');
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users' 
    });
  }
};

// Create new user (admin only)
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password, role, permissions, firstName, lastName } = req.body;
    console.log('👤 Creating user:', username);

    // Validation
    if (!username || !email || !password || !firstName || !lastName) {
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

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: role || 'editor',
      permissions: permissions || ['create:articles', 'edit:articles'],
      isActive: true,
      isApproved: true
    });

    await user.save();

    // Return user without password
    const userResponse = await User.findById(user._id).select('-password');

    console.log('✅ User created successfully');

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
};

// Update user
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, role, permissions, firstName, lastName, isActive } = req.body;
    console.log('✏️ Updating user:', id);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check for duplicate username/email
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: id } },
          { $or: [{ email: email?.toLowerCase() }, { username: username?.toLowerCase() }] }
        ]
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }
    }

    // Update fields
    if (username) user.username = username.toLowerCase();
    if (email) user.email = email.toLowerCase();
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;
    if (permissions) user.permissions = permissions;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');

    console.log('✅ User updated successfully');

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Toggle user activation
export const toggleUserActivation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log('🔧 Toggling user activation:', id);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-deactivation
    if (user._id.toString() === req.user?._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    console.log('✅ User activation toggled:', user.isActive);

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    });
  } catch (error: any) {
    console.error('Toggle activation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting user:', id);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user?._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(id);

    console.log('✅ User deleted successfully');

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};