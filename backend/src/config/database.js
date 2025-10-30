const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

// Database helper functions
const db = {
  // Payment Codes
  async createPaymentCode(data) {
    const { data: result, error } = await supabase
      .from('payment_codes')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getPaymentCode(code) {
    const { data, error } = await supabase
      .from('payment_codes')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getPaymentCodeById(id) {
    const { data, error } = await supabase
      .from('payment_codes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Receipts
  async createReceipt(data) {
    const { data: result, error } = await supabase
      .from('receipts')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getReceipt(id) {
    const { data, error } = await supabase
      .from('receipts')
      .select(`
        *,
        payment_codes (
          code,
          student_name,
          student_id,
          student_email,
          session,
          expected_amount
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getReceipts(filters = {}) {
    let query = supabase
      .from('receipts')
      .select(`
        *,
        payment_codes (
          code,
          student_name,
          student_id,
          student_email,
          session,
          expected_amount
        )
      `, { count: 'exact' });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.session) {
      query = query.eq('payment_codes.session', filters.session);
    }
    if (filters.search) {
      query = query.or(`reference_id.ilike.%${filters.search}%,payment_codes.student_name.ilike.%${filters.search}%`);
    }
    if (filters.fromDate) {
      query = query.gte('created_at', filters.fromDate);
    }
    if (filters.toDate) {
      query = query.lte('created_at', filters.toDate);
    }

    // Sorting
    const sortColumn = filters.sortColumn || 'created_at';
    const sortDirection = filters.sortDirection || 'desc';
    query = query.order(sortColumn, { ascending: sortDirection === 'asc' });

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count };
  },

  async updateReceipt(id, data) {
    const { data: result, error } = await supabase
      .from('receipts')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async bulkUpdateReceipts(ids, data) {
    const { data: result, error } = await supabase
      .from('receipts')
      .update(data)
      .in('id', ids)
      .select();

    if (error) throw error;
    return result;
  },

  // Admin Users
  async createAdmin(data) {
    const { data: result, error } = await supabase
      .from('admin_users')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getAdminByEmail(email) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Activity Logs
  async createActivityLog(data) {
    const { data: result, error } = await supabase
      .from('activity_logs')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getRecentActivities(limit = 10) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Metrics
  async getMetrics() {
    const { data: receipts, error: receiptsError } = await supabase
      .from('receipts')
      .select('status');

    if (receiptsError) throw receiptsError;

    const total = receipts.length;
    const pending = receipts.filter(r => r.status === 'pending').length;
    const verified = receipts.filter(r => r.status === 'verified').length;
    const flagged = receipts.filter(r => r.status === 'flagged').length;
    const rejected = receipts.filter(r => r.status === 'rejected').length;

    return {
      total,
      pending,
      verified,
      flagged,
      rejected
    };
  }
};

module.exports = { supabase, db };
