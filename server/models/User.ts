import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  isApproved: boolean;
  permissions: string[];
  profile?: {
    avatar?: string;
    bio?: string;
    phone?: string;
  };
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  isLocked(): boolean;
  resetLoginAttempts(): Promise<void>;
}

export interface IUserModel extends Model<IUser> {
  getAdmins(): Promise<IUser[]>;
  getActiveUsers(): Promise<IUser[]>;
  findByEmail(email: string): Promise<IUser | null>;
  isUsernameTaken(username: string): Promise<boolean>;
  isEmailTaken(email: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, IUserModel>({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: { 
    type: String, 
    enum: {
      values: ['admin', 'editor', 'viewer'],
      message: 'Role must be admin, editor, or viewer'
    },
    default: 'viewer'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isApproved: { 
    type: Boolean, 
    default: true 
  },
  permissions: [{
    type: String,
    enum: {
      values: [
        'create:articles', 'edit:articles', 'delete:articles',
        'create:videos', 'edit:videos', 'delete:videos',
        'manage:users'
      ],
      message: 'Invalid permission'
    }
  }],
  profile: {
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number']
    }
  },
  lastLogin: { 
    type: Date, 
    default: null 
  },
  loginAttempts: { 
    type: Number, 
    default: 0,
    min: 0
  },
  lockUntil: { 
    type: Date, 
    default: null 
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      return ret;
    }
  }
});

// Indexes for performance
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, isApproved: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.resetLoginAttempts();
  }
  
  // Increment login attempts
  this.loginAttempts += 1;
  
  // Lock the account if we've reached max attempts and it's not already locked
  if (this.loginAttempts >= 5 && !this.isLocked) {
    this.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  }
  
  await this.save();
};

userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

// Static methods
userSchema.statics.getAdmins = function(): Promise<IUser[]> {
  return this.find({ role: 'admin', isActive: true })
    .select('-password')
    .sort({ createdAt: -1 });
};

userSchema.statics.getActiveUsers = function(): Promise<IUser[]> {
  return this.find({ isActive: true })
    .select('-password')
    .sort({ lastName: 1, firstName: 1 });
};

userSchema.statics.findByEmail = function(email: string): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.isUsernameTaken = async function(username: string): Promise<boolean> {
  const user = await this.findOne({ username: username.toLowerCase() });
  return !!user;
};

userSchema.statics.isEmailTaken = async function(email: string): Promise<boolean> {
  const user = await this.findOne({ email: email.toLowerCase() });
  return !!user;
};

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;