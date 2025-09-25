import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: 'customer' | 'driver' | 'restaurant' | 'admin';
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    dietaryRestrictions: string[];
    favoriteCuisines: string[];
  };
  addresses: Array<{
    type: 'home' | 'work' | 'other';
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    isDefault: boolean;
  }>;
  paymentMethods: Array<{
    type: 'card' | 'wallet' | 'bank';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
  }>;
  refreshTokens: string[];
  otp?: {
    code: string;
    expiresAt: Date;
    type: 'email_verification' | 'phone_verification' | 'password_reset';
  };
  twoFactorSecret?: string;
  isTwoFactorEnabled: boolean;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateRefreshToken(): string;
  removeRefreshToken(token: string): void;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
  },
  profileImage: {
    type: String,
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['customer', 'driver', 'restaurant', 'admin'],
    default: 'customer',
  },
  preferences: {
    language: {
      type: String,
      default: 'en',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
    dietaryRestrictions: [{
      type: String,
      trim: true,
    }],
    favoriteCuisines: [{
      type: String,
      trim: true,
    }],
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  }],
  paymentMethods: [{
    type: {
      type: String,
      enum: ['card', 'wallet', 'bank'],
      required: true,
    },
    last4: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    expiryMonth: {
      type: Number,
      min: 1,
      max: 12,
    },
    expiryYear: {
      type: Number,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  }],
  refreshTokens: [{
    type: String,
  }],
  otp: {
    code: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
    },
    type: {
      type: String,
      enum: ['email_verification', 'phone_verification', 'password_reset'],
    },
  },
  twoFactorSecret: {
    type: String,
    trim: true,
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.refreshTokens;
      delete ret.otp;
      delete ret.twoFactorSecret;
      return ret;
    },
  },
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function(): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  this.refreshTokens.push(token);
  
  // Keep only last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
  
  return token;
};

// Remove refresh token
UserSchema.methods.removeRefreshToken = function(token: string): void {
  this.refreshTokens = this.refreshTokens.filter(t => t !== token);
};

export default mongoose.model<IUser>('User', UserSchema);

