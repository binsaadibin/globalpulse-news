import { Response } from "express";
import User from '../../models/User.js';
import { AuthRequest } from '../../middleware/auth.js';

// Get all users with advanced filtering and pagination
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log('📋 Fetching users with filters:', {
      page, limit, role, isActive, search, sortBy, sortOrder
    });

    // Build filter object
    const filter: any = {};
    
    if (role && ['admin', 'editor', 'viewer'].includes(role as string)) {
      filter.role = role;
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const users = await User.find(filter)
      .select('-password -loginAttempts -lockUntil')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / Number(limit));

    console.log(`✅ Found ${users.length} users out of ${totalUsers} total`);

    res.json({
      success: true,
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalUsers,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1
      },
      filters: {
        role: role || 'all',
        isActive: isActive || 'all',
        search: search || ''
      }
    });
  } catch (error: any) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new user with validation
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      role = 'editor',
      permissions = ['create:articles', 'edit:articles'],
      firstName,
      lastName
    } = req.body;

    console.log('👤 Creating new user:', { username, email, role });

    // Validation
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: firstName, lastName, username, email, password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be admin, editor, or viewer'
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    // Create user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      permissions,
      isActive: true,
      isApproved: true
    });

    await user.save();

    // Get user without password
    const userResponse = await User.findById(user._id)
      .select('-password -loginAttempts -lockUntil');

    console.log('✅ User created successfully:', userResponse.username);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error: any) {
    console.error('❌ Create user error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user with comprehensive validation
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      role,
      permissions,
      firstName,
      lastName,
      isActive,
      profile
    } = req.body;

    console.log('✏️ Updating user:', id, { 
      username, email, role, isActive 
    });

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-modification of critical fields
    if (user._id.toString() === req.user?._id.toString()) {
      if (isActive !== undefined && !isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate your own account'
        });
      }
      
      if (role && role !== user.role) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change your own role'
        });
      }
    }

    // Check for duplicate username/email
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: id } },
          { 
            $or: [
              { email: email?.toLowerCase() },
              { username: username?.toLowerCase() }
            ].filter(Boolean)
          }
        ]
      });

      if (existingUser) {
        const field = existingUser.email === email?.toLowerCase() ? 'email' : 'username';
        return res.status(409).json({
          success: false,
          message: `User with this ${field} already exists`
        });
      }
    }

    // Update fields
    const updateData: any = {};
    if (username) updateData.username = username.toLowerCase().trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (role) updateData.role = role;
    if (permissions) updateData.permissions = permissions;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (profile) updateData.profile = { ...user.profile, ...profile };

    // Perform update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password -loginAttempts -lockUntil');

    console.log('✅ User updated successfully:', updatedUser.username);

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('❌ Update user error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Toggle user activation with safety checks
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

    // Toggle activation
    user.isActive = !user.isActive;
    await user.save();

    console.log('✅ User activation toggled:', {
      username: user.username,
      newStatus: user.isActive
    });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('❌ Toggle activation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete user with comprehensive checks
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

    // Prevent deletion of last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last active admin user'
        });
      }
    }

    // Perform deletion
    await User.findByIdAndDelete(id);

    console.log('✅ User deleted successfully:', user.username);

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user statistics
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📊 Getting user statistics');

    const stats = await User.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: 'count' }],
          activeUsers: [{ $match: { isActive: true } }, { $count: 'count' }],
          usersByRole: [
            { $group: { _id: '$role', count: { $sum: 1 } } }
          ],
          recentRegistrations: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            { 
              $project: {
                username: 1,
                email: 1,
                role: 1,
                createdAt: 1
              }
            }
          ],
          loginActivity: [
            { $match: { lastLogin: { $exists: true } } },
            { $sort: { lastLogin: -1 } },
            { $limit: 10 },
            {
              $project: {
                username: 1,
                lastLogin: 1,
                loginCount: 1
              }
            }
          ]
        }
      }
    ]);

    const result = {
      totalUsers: stats[0]?.totalUsers[0]?.count || 0,
      activeUsers: stats[0]?.activeUsers[0]?.count || 0,
      usersByRole: stats[0]?.usersByRole || [],
      recentRegistrations: stats[0]?.recentRegistrations || [],
      loginActivity: stats[0]?.loginActivity || []
    };

    console.log('✅ User statistics retrieved:', result);

    res.json({
      success: true,
      stats: result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics'
    });
  }
};