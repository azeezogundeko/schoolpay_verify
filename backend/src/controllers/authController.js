const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// Admin login
const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find admin user
    let admin = await db.getAdminByEmail(email);

    // If no admin exists and this is the default admin email, create it
    if (!admin && email === process.env.ADMIN_EMAIL) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      admin = await db.createAdmin({
        email: email,
        password_hash: hashedPassword,
        full_name: 'System Admin',
        role: 'admin'
      });
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!admin.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Generate JWT token
    const expiresIn = rememberMe ? '7d' : process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Update last login
    await db.supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Log activity
    await db.createActivityLog({
      type: 'admin_login',
      user_type: 'admin',
      user_id: admin.id,
      user_name: admin.full_name || admin.email,
      action: 'logged in'
    });

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.full_name,
          role: admin.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

// Admin logout
const logout = async (req, res) => {
  try {
    // Log activity
    await db.createActivityLog({
      type: 'admin_logout',
      user_type: 'admin',
      user_id: req.admin.id,
      user_name: req.admin.email,
      action: 'logged out'
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
};

// Verify token
const verifyToken = async (req, res) => {
  res.json({
    success: true,
    data: {
      admin: req.admin
    }
  });
};

module.exports = {
  login,
  logout,
  verifyToken
};
