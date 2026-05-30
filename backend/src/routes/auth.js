const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { signupValidation, loginValidation, verifyOtpValidation } = require('../utils/validators');

// POST /api/auth/signup — Register new user, generates OTP
router.post('/signup', signupValidation, authController.signup);

// POST /api/auth/login — Generate OTP for existing user
router.post('/login', loginValidation, authController.login);

// POST /api/auth/verify-otp — Verify OTP and return JWT
router.post('/verify-otp', verifyOtpValidation, authController.verifyOtp);

// GET /api/auth/me — Get authenticated user profile (requires JWT)
router.get('/me', authenticate, authController.getMe);

module.exports = router;
