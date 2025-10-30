const path = require('path');
const fs = require('fs').promises;
const { db } = require('../config/database');
const { analyzeReceipt, simulateOCR } = require('../services/aiService');
const { generateReferenceId, shouldFlagReceipt } = require('../utils/helpers');

// Upload receipt
const uploadReceipt = async (req, res) => {
  try {
    const { paymentCode } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Verify payment code exists and is valid
    const paymentCodeData = await db.getPaymentCode(paymentCode);

    if (!paymentCodeData) {
      // Clean up uploaded file
      await fs.unlink(file.path);
      return res.status(404).json({
        success: false,
        error: 'Invalid payment code'
      });
    }

    // Check if payment code is expired
    if (new Date(paymentCodeData.expires_at) < new Date()) {
      await fs.unlink(file.path);
      return res.status(400).json({
        success: false,
        error: 'Payment code has expired'
      });
    }

    // Check if receipt already exists for this payment code
    const { data: existingReceipt } = await db.supabase
      .from('receipts')
      .select('id')
      .eq('payment_code_id', paymentCodeData.id)
      .maybeSingle();

    if (existingReceipt) {
      await fs.unlink(file.path);
      return res.status(400).json({
        success: false,
        error: 'Receipt already submitted for this payment code'
      });
    }

    // Generate reference ID
    const referenceId = generateReferenceId('RCP');

    // Analyze receipt with AI
    let analysisResult;
    try {
      analysisResult = await analyzeReceipt(file.path, paymentCodeData);
    } catch (aiError) {
      console.error('AI Analysis failed, using fallback:', aiError);
      analysisResult = await simulateOCR(file.path);
    }

    const analysisData = analysisResult.data;

    // Determine if receipt should be flagged
    const { shouldFlag, concerns } = shouldFlagReceipt(analysisData, paymentCodeData);

    // Determine initial status
    let initialStatus = 'pending';
    if (shouldFlag) {
      initialStatus = 'flagged';
    } else if (analysisData.confidenceScore >= 90 && analysisData.matchesExpected) {
      initialStatus = 'verified'; // Auto-verify high confidence matches
    }

    // Create receipt record
    const receipt = await db.createReceipt({
      reference_id: referenceId,
      payment_code_id: paymentCodeData.id,
      file_url: file.path,
      file_name: file.originalname,
      file_size: file.size,
      file_type: file.mimetype,
      status: initialStatus,
      extracted_text: analysisData.extractedText,
      ai_analysis: analysisData,
      extracted_amount: analysisData.amount,
      extracted_date: analysisData.date,
      confidence_score: analysisData.confidenceScore,
      is_urgent: shouldFlag && analysisData.confidenceScore < 50
    });

    // Log activity
    await db.createActivityLog({
      type: 'receipt_submitted',
      user_type: 'student',
      user_name: paymentCodeData.student_name,
      action: 'submitted receipt',
      target_type: 'receipt',
      target_id: receipt.id,
      metadata: {
        reference_id: referenceId,
        payment_code: paymentCode,
        status: initialStatus
      }
    });

    // If flagged, log the concerns
    if (shouldFlag) {
      await db.createActivityLog({
        type: 'receipt_flagged',
        user_type: 'system',
        user_name: 'AI System',
        action: 'flagged receipt for review',
        target_type: 'receipt',
        target_id: receipt.id,
        metadata: { concerns }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        id: receipt.id,
        referenceId: receipt.reference_id,
        status: receipt.status,
        confidenceScore: receipt.confidence_score,
        extractedAmount: receipt.extracted_amount,
        extractedDate: receipt.extracted_date,
        isUrgent: receipt.is_urgent,
        concerns: shouldFlag ? concerns : [],
        analysis: analysisData,
        createdAt: receipt.created_at
      }
    });

  } catch (error) {
    console.error('Upload receipt error:', error);

    // Clean up file if it exists
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload receipt'
    });
  }
};

// Get receipt by ID
const getReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = await db.getReceipt(id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        error: 'Receipt not found'
      });
    }

    res.json({
      success: true,
      data: receipt
    });

  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get receipt'
    });
  }
};

// Get receipt by reference ID
const getReceiptByReference = async (req, res) => {
  try {
    const { referenceId } = req.params;

    const { data: receipt, error } = await db.supabase
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
      .eq('reference_id', referenceId)
      .single();

    if (error || !receipt) {
      return res.status(404).json({
        success: false,
        error: 'Receipt not found'
      });
    }

    res.json({
      success: true,
      data: receipt
    });

  } catch (error) {
    console.error('Get receipt by reference error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get receipt'
    });
  }
};

// Get all receipts (with filters)
const getReceipts = async (req, res) => {
  try {
    const {
      status,
      session,
      search,
      fromDate,
      toDate,
      sortColumn,
      sortDirection,
      page,
      limit
    } = req.query;

    const filters = {
      status,
      session,
      search,
      fromDate,
      toDate,
      sortColumn: sortColumn || 'created_at',
      sortDirection: sortDirection || 'desc',
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 25
    };

    const { data, count } = await db.getReceipts(filters);

    res.json({
      success: true,
      data: {
        receipts: data,
        pagination: {
          total: count,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(count / filters.limit)
        }
      }
    });

  } catch (error) {
    console.error('Get receipts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get receipts'
    });
  }
};

// Update receipt status
const updateReceiptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Get existing receipt
    const existingReceipt = await db.getReceipt(id);

    if (!existingReceipt) {
      return res.status(404).json({
        success: false,
        error: 'Receipt not found'
      });
    }

    // Update receipt
    const updateData = {
      status,
      reviewed_by: req.admin.id,
      reviewed_at: new Date().toISOString()
    };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    const updatedReceipt = await db.updateReceipt(id, updateData);

    // Log activity
    await db.createActivityLog({
      type: `receipt_${status}`,
      user_type: 'admin',
      user_id: req.admin.id,
      user_name: req.admin.email,
      action: `${status} receipt`,
      target_type: 'receipt',
      target_id: id,
      metadata: {
        reference_id: updatedReceipt.reference_id,
        previous_status: existingReceipt.status,
        new_status: status
      }
    });

    res.json({
      success: true,
      data: updatedReceipt
    });

  } catch (error) {
    console.error('Update receipt status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update receipt status'
    });
  }
};

// Bulk update receipts
const bulkUpdateReceipts = async (req, res) => {
  try {
    const { ids, status, adminNotes } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid receipt IDs'
      });
    }

    const updateData = {
      status,
      reviewed_by: req.admin.id,
      reviewed_at: new Date().toISOString()
    };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    const updatedReceipts = await db.bulkUpdateReceipts(ids, updateData);

    // Log activity
    await db.createActivityLog({
      type: 'bulk_action',
      user_type: 'admin',
      user_id: req.admin.id,
      user_name: req.admin.email,
      action: `bulk ${status} ${ids.length} receipts`,
      metadata: {
        receipt_ids: ids,
        status,
        count: ids.length
      }
    });

    res.json({
      success: true,
      data: {
        updatedCount: updatedReceipts.length,
        receipts: updatedReceipts
      }
    });

  } catch (error) {
    console.error('Bulk update receipts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update receipts'
    });
  }
};

module.exports = {
  uploadReceipt,
  getReceipt,
  getReceiptByReference,
  getReceipts,
  updateReceiptStatus,
  bulkUpdateReceipts
};
