const crypto = require('crypto');

// Generate unique payment code
function generatePaymentCode() {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PAY-${year}-${random}`;
}

// Generate reference ID
function generateReferenceId(prefix = 'REF') {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Calculate expiration date (24 hours from now by default)
function calculateExpirationDate(hours = 24) {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Validate payment code format
function validatePaymentCodeFormat(code) {
  const pattern = /^PAY-\d{4}-[A-Z0-9]{6}$/;
  return pattern.test(code);
}

// Check if payment code is expired
function isPaymentCodeExpired(expiresAt) {
  return new Date(expiresAt) < new Date();
}

// Sanitize filename
function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
}

// Calculate confidence level based on score
function getConfidenceLevel(score) {
  if (score >= 90) return 'high';
  if (score >= 70) return 'medium';
  if (score >= 50) return 'low';
  return 'very_low';
}

// Determine if receipt should be flagged
function shouldFlagReceipt(analysisData, paymentCodeData) {
  const concerns = [];

  // Check confidence score
  if (analysisData.confidenceScore < 70) {
    concerns.push('Low confidence score in receipt analysis');
  }

  // Check amount match
  if (paymentCodeData.expected_amount && analysisData.amount) {
    const difference = Math.abs(analysisData.amount - paymentCodeData.expected_amount);
    const percentDiff = (difference / paymentCodeData.expected_amount) * 100;

    if (percentDiff > 10) {
      concerns.push(`Amount mismatch: Expected ${paymentCodeData.expected_amount}, Found ${analysisData.amount}`);
    }
  }

  // Check if AI flagged concerns
  if (analysisData.concerns && analysisData.concerns.length > 0) {
    concerns.push(...analysisData.concerns);
  }

  // Check if matches expected
  if (analysisData.matchesExpected === false) {
    concerns.push('Receipt does not match expected payment details');
  }

  return {
    shouldFlag: concerns.length > 0,
    concerns: concerns
  };
}

// Parse date string to ISO format
function parseDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString();
  } catch (error) {
    return null;
  }
}

module.exports = {
  generatePaymentCode,
  generateReferenceId,
  calculateExpirationDate,
  formatCurrency,
  validatePaymentCodeFormat,
  isPaymentCodeExpired,
  sanitizeFilename,
  getConfidenceLevel,
  shouldFlagReceipt,
  parseDate
};
