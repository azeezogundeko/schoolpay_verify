const express = require('express');
const router = express.Router();
const {
  uploadReceipt,
  getReceipt,
  getReceiptByReference,
  getReceipts,
  updateReceiptStatus,
  bulkUpdateReceipts
} = require('../controllers/receiptController');
const { upload, handleUploadError } = require('../middleware/upload');
const { receiptUploadValidation, receiptReviewValidation, validate } = require('../middleware/validator');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post(
  '/',
  upload.single('receipt'),
  handleUploadError,
  receiptUploadValidation,
  validate,
  uploadReceipt
);
router.get('/reference/:referenceId', getReceiptByReference);

// Protected routes (Admin only)
router.get('/', verifyToken, isAdmin, getReceipts);
router.get('/:id', verifyToken, isAdmin, getReceipt);
router.patch('/:id', verifyToken, isAdmin, receiptReviewValidation, validate, updateReceiptStatus);
router.post('/bulk-update', verifyToken, isAdmin, bulkUpdateReceipts);

module.exports = router;
