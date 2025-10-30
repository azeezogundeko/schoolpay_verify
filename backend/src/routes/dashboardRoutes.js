const express = require('express');
const router = express.Router();
const { getMetrics, getActivities } = require('../controllers/dashboardController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Protected routes (Admin only)
router.get('/metrics', verifyToken, isAdmin, getMetrics);
router.get('/activities', verifyToken, isAdmin, getActivities);

module.exports = router;
