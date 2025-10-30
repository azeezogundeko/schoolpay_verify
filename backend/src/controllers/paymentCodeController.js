const { db } = require('../config/database');
const {
  generatePaymentCode,
  generateReferenceId,
  calculateExpirationDate
} = require('../utils/helpers');

// Generate new payment code
const generateCode = async (req, res) => {
  try {
    const {
      studentName,
      studentId,
      studentEmail,
      session,
      paymentType,
      expectedAmount
    } = req.body;

    // Generate unique code and reference
    const code = generatePaymentCode();
    const referenceId = generateReferenceId('REF');
    const expiresAt = calculateExpirationDate(720); // 30 days

    // Create payment code in database
    const paymentCode = await db.createPaymentCode({
      code,
      reference_id: referenceId,
      student_name: studentName,
      student_id: studentId,
      student_email: studentEmail,
      session,
      payment_type: paymentType,
      expected_amount: expectedAmount,
      expires_at: expiresAt,
      status: 'active'
    });

    // Log activity
    await db.createActivityLog({
      type: 'code_generated',
      user_type: 'student',
      user_name: studentName,
      action: 'generated payment code',
      target_type: 'payment_code',
      target_id: paymentCode.id,
      metadata: { code, student_id: studentId }
    });

    res.status(201).json({
      success: true,
      data: {
        code: paymentCode.code,
        referenceId: paymentCode.reference_id,
        studentName: paymentCode.student_name,
        studentId: paymentCode.student_id,
        studentEmail: paymentCode.student_email,
        session: paymentCode.session,
        paymentType: paymentCode.payment_type,
        expectedAmount: paymentCode.expected_amount,
        generatedAt: paymentCode.created_at,
        expiresAt: paymentCode.expires_at,
        status: paymentCode.status
      }
    });

  } catch (error) {
    console.error('Generate code error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate payment code'
    });
  }
};

// Verify payment code
const verifyCode = async (req, res) => {
  try {
    const { code } = req.params;

    const paymentCode = await db.getPaymentCode(code);

    if (!paymentCode) {
      return res.status(404).json({
        success: false,
        error: 'Payment code not found'
      });
    }

    // Check if expired
    const isExpired = new Date(paymentCode.expires_at) < new Date();

    // Check if already used
    const { data: existingReceipt } = await db.supabase
      .from('receipts')
      .select('id')
      .eq('payment_code_id', paymentCode.id)
      .single();

    const isUsed = !!existingReceipt;

    res.json({
      success: true,
      data: {
        valid: paymentCode.status === 'active' && !isExpired && !isUsed,
        code: paymentCode.code,
        studentName: paymentCode.student_name,
        session: paymentCode.session,
        isExpired,
        isUsed,
        expiresAt: paymentCode.expires_at
      }
    });

  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment code'
    });
  }
};

// Get payment code details
const getCodeDetails = async (req, res) => {
  try {
    const { code } = req.params;

    const paymentCode = await db.getPaymentCode(code);

    if (!paymentCode) {
      return res.status(404).json({
        success: false,
        error: 'Payment code not found'
      });
    }

    res.json({
      success: true,
      data: paymentCode
    });

  } catch (error) {
    console.error('Get code details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment code details'
    });
  }
};

module.exports = {
  generateCode,
  verifyCode,
  getCodeDetails
};
