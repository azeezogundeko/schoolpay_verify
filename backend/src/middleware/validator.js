const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Payment code validation rules
const paymentCodeValidation = [
  body('studentName')
    .trim()
    .notEmpty().withMessage('Student name is required')
    .isLength({ min: 2 }).withMessage('Student name must be at least 2 characters'),
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required')
    .matches(/^[A-Z0-9-]+$/i).withMessage('Invalid student ID format'),
  body('studentEmail')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('session')
    .trim()
    .notEmpty().withMessage('Session is required')
    .matches(/^\d{4}\/\d{4}$/).withMessage('Invalid session format. Expected: YYYY/YYYY'),
  body('paymentType')
    .optional()
    .trim(),
  body('expectedAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Expected amount must be a positive number')
];

// Receipt upload validation rules
const receiptUploadValidation = [
  body('paymentCode')
    .trim()
    .notEmpty().withMessage('Payment code is required')
    .matches(/^PAY-\d{4}-[A-Z0-9]{6}$/i).withMessage('Invalid payment code format')
];

// Admin login validation rules
const adminLoginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

// Receipt review validation rules
const receiptReviewValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['verified', 'rejected', 'flagged', 'pending']).withMessage('Invalid status'),
  body('adminNotes')
    .optional()
    .trim()
];

module.exports = {
  validate,
  paymentCodeValidation,
  receiptUploadValidation,
  adminLoginValidation,
  receiptReviewValidation
};
