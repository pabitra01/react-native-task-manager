const { body } = require('express-validator');

const signupValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

const verifyOtpValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
];

const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),
];

const updateProjectValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),
];

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('due_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date (YYYY-MM-DD)'),
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Status must be either "pending" or "completed"'),
  body('due_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date (YYYY-MM-DD)'),
];

module.exports = {
  signupValidation,
  loginValidation,
  verifyOtpValidation,
  createProjectValidation,
  updateProjectValidation,
  createTaskValidation,
  updateTaskValidation,
};
