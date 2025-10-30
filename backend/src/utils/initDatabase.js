const { supabase } = require('../config/database');
require('dotenv').config();

const SQL_SCHEMA = `
-- Payment Codes Table
CREATE TABLE IF NOT EXISTS payment_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  reference_id VARCHAR(50) UNIQUE NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(50) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  session VARCHAR(20) NOT NULL,
  payment_type VARCHAR(100),
  expected_amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'active',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Receipts Table
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id VARCHAR(50) UNIQUE NOT NULL,
  payment_code_id UUID REFERENCES payment_codes(id),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  extracted_text TEXT,
  ai_analysis JSONB,
  extracted_amount DECIMAL(10, 2),
  extracted_date DATE,
  confidence_score DECIMAL(5, 2),
  is_urgent BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  user_type VARCHAR(20) NOT NULL,
  user_id UUID,
  user_name VARCHAR(255),
  action TEXT NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_codes_code ON payment_codes(code);
CREATE INDEX IF NOT EXISTS idx_payment_codes_student_id ON payment_codes(student_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payment_code_id ON receipts(payment_code_id);
CREATE INDEX IF NOT EXISTS idx_receipts_status ON receipts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_payment_codes_updated_at ON payment_codes;
CREATE TRIGGER update_payment_codes_updated_at BEFORE UPDATE ON payment_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_receipts_updated_at ON receipts;
CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON receipts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function initDatabase() {
  try {
    console.log('Initializing database schema...');

    // Note: Supabase doesn't support raw SQL execution via the JS client
    // You need to run this SQL directly in the Supabase SQL editor
    // Or use a PostgreSQL client

    console.log('\n==============================================');
    console.log('DATABASE SCHEMA');
    console.log('==============================================');
    console.log('\nPlease run the following SQL in your Supabase SQL Editor:');
    console.log('\n' + SQL_SCHEMA);
    console.log('\n==============================================\n');

    console.log('After running the SQL, the database will be ready.');
    console.log('\nYou can access the Supabase SQL Editor at:');
    console.log('https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql\n');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase, SQL_SCHEMA };
