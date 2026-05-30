const bcrypt = require('bcryptjs');

const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP string
 */
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Log OTP to console in development mode for easy testing
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n🔑 [DEV] Generated OTP: ${otp}\n`);
  }

  return otp;
};

/**
 * Hash an OTP using bcryptjs
 * @param {string} otp - Plain text OTP
 * @returns {Promise<string>} Hashed OTP
 */
const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

/**
 * Verify an OTP against its hash
 * @param {string} otp - Plain text OTP
 * @param {string} hashedOtp - Hashed OTP to compare against
 * @returns {Promise<boolean>} Whether the OTP matches
 */
const verifyOtp = async (otp, hashedOtp) => {
  return bcrypt.compare(otp, hashedOtp);
};

/**
 * Check if an OTP has expired
 * @param {Date} otpExpires - The expiry timestamp
 * @returns {boolean} Whether the OTP is expired
 */
const isOtpExpired = (otpExpires) => {
  if (!otpExpires) return true;
  return new Date() > new Date(otpExpires);
};

/**
 * Get OTP expiry date (10 minutes from now)
 * @returns {Date} Expiry date
 */
const getOtpExpiry = () => {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};

module.exports = {
  generateOtp,
  hashOtp,
  verifyOtp,
  isOtpExpired,
  getOtpExpiry,
};
