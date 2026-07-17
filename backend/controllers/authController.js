import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// Helper to sign JWT
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    console.log('🔴 Register raw request payload:', req.rawBody || req.body);
    const { name, email, password } = req.body;

    // Check duplicate
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // Create user
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return successResponse(res, { token, user }, 'User registered successfully', 201);
  } catch (error) {
    console.error('🔴 Register error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    next(error);
  }
};

/**
 * Log in existing user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user (explicitly select password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Match password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    // Convert user to object without password for output
    const userJson = user.toJSON();

    return successResponse(res, { token, user: userJson }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Get logged-in user profile
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, req.user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile details
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name) {
      user.name = name;
    }

    // Handle password change validation
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Old password is required to change password', 400);
      }
      
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Invalid current password', 401);
      }

      if (newPassword.length < 6) {
        return errorResponse(res, 'New password must be at least 6 characters', 400);
      }

      user.password = newPassword;
    }

    await user.save();
    const updatedUser = user.toJSON();

    return successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
