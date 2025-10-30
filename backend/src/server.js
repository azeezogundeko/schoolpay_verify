const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const paymentCodeRoutes = require('./routes/paymentCodeRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for serving uploaded files)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SchoolPay Verify API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/payment-codes', paymentCodeRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('SchoolPay Verify Backend API');
  console.log('='.repeat(50));
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('='.repeat(50));
  console.log('\nAvailable endpoints:');
  console.log('- GET  /health');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/auth/logout');
  console.log('- GET  /api/auth/verify');
  console.log('- POST /api/payment-codes');
  console.log('- GET  /api/payment-codes/:code/verify');
  console.log('- POST /api/receipts');
  console.log('- GET  /api/receipts');
  console.log('- GET  /api/receipts/:id');
  console.log('- PATCH /api/receipts/:id');
  console.log('- POST /api/receipts/bulk-update');
  console.log('- GET  /api/dashboard/metrics');
  console.log('- GET  /api/dashboard/activities');
  console.log('='.repeat(50));
  console.log('\nTo initialize the database, run: npm run init-db');
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;
