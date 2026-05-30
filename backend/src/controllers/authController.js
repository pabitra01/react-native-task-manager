const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const { generateOtp, hashOtp, verifyOtp, isOtpExpired, getOtpExpiry } = require('../services/otpService');

/**
 * POST /api/auth/signup
 * Register a new user and generate OTP
 */
const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists. Please login instead.',
      });
    }

    // Generate and hash OTP
    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);

    // Create user with OTP
    const user = await User.create({
      email,
      name,
      otp: hashedOtp,
      otp_expires: getOtpExpiry(),
    });

    // In production, send OTP via email here
    // For development, OTP is logged to console by generateOtp()

    res.status(201).json({
      success: true,
      data: {
        message: 'User registered successfully. Please verify your OTP.',
        userId: user.id,
        email: user.email,
        otp, // For demo — remove in production
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Generate OTP for existing user
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email. Please sign up first.',
      });
    }

    // Generate and hash OTP
    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);

    // Update user with new OTP
    await user.update({
      otp: hashedOtp,
      otp_expires: getOtpExpiry(),
    });

    // In production, send OTP via email here

    res.status(200).json({
      success: true,
      data: {
        message: 'OTP sent successfully. Please verify to login.',
        email: user.email,
        otp, // For demo — remove in production
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 * Verify OTP and return JWT
 */
const verifyOtpHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    // Check OTP expiry
    if (isOtpExpired(user.otp_expires)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Verify OTP
    const isValid = await verifyOtp(otp, user.otp);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
      });
    }

    // Clear OTP after successful verification
    await user.update({
      otp: null,
      otp_expires: null,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      data: {
        message: 'OTP verified successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get authenticated user's profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'created_at', 'updated_at'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  verifyOtp: verifyOtpHandler,
  getMe,
};
