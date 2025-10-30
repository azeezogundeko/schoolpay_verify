const express = require('express');
const router = express.Router();
const { login, logout, verifyToken } = require('../controllers/authController');
const { adminLoginValidation, validate } = require('../middleware/validator');
const { verifyToken: verifyTokenMiddleware } = require('../middleware/auth');

// Public routes
router.post('/login', adminLoginValidation, validate, login);

// Protected routes
router.post('/logout', verifyTokenMiddleware, logout);
router.get('/verify', verifyTokenMiddleware, verifyToken);

module.exports = router;
