const { db } = require('../config/database');

// Get dashboard metrics
const getMetrics = async (req, res) => {
  try {
    const metrics = await db.getMetrics();

    res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get metrics'
    });
  }
};

// Get recent activities
const getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await db.getRecentActivities(limit);

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get activities'
    });
  }
};

module.exports = {
  getMetrics,
  getActivities
};
