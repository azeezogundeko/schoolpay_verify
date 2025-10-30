const express = require('express');
const router = express.Router();
const {
  generateCode,
  verifyCode,
  getCodeDetails
} = require('../controllers/paymentCodeController');
const { paymentCodeValidation, validate } = require('../middleware/validator');

// Public routes
router.post('/', paymentCodeValidation, validate, generateCode);
router.get('/:code/verify', verifyCode);
router.get('/:code', getCodeDetails);

module.exports = router;
