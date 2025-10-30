import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentWorkflowNav from '../../components/ui/StudentWorkflowNav';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import UploadZone from './components/UploadZone';
import FilePreview from './components/FilePreview';
import PaymentCodeInput from './components/PaymentCodeInput';
import ProcessingStatus from './components/ProcessingStatus';
import ErrorHandler from './components/ErrorHandler';
import { paymentCodeAPI, receiptAPI } from '../../services/api';
import { formatErrorMessage } from '../../utils/apiHelpers';

const ReceiptUpload = () => {
  const navigate = useNavigate();
  
  // Form state
  const [paymentCode, setPaymentCode] = useState('');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Validation state
  const [paymentCodeError, setPaymentCodeError] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeVerificationStatus, setCodeVerificationStatus] = useState(null);

  // Mock processing steps
  const [processingSteps, setProcessingSteps] = useState([
    {
      id: 'upload',
      label: 'File Upload',
      description: 'Uploading receipt files',
      status: 'pending'
    },
    {
      id: 'ocr',
      label: 'OCR Extraction',
      description: 'Extracting text from receipt',
      status: 'pending'
    },
    {
      id: 'ai_analysis',
      label: 'AI Analysis',
      description: 'Analyzing payment information',
      status: 'pending'
    },
    {
      id: 'verification',
      label: 'Verification',
      description: 'Matching payment code',
      status: 'pending'
    }
  ]);

  // Validate payment code format
  const validatePaymentCode = (code) => {
    const codePattern = /^PAY-\d{4}-[A-Z0-9]{6}$/;
    return codePattern.test(code);
  };

  // Handle payment code change with validation
  const handlePaymentCodeChange = async (value) => {
    setPaymentCode(value);
    setPaymentCodeError('');
    setCodeVerificationStatus(null);

    if (value.length > 0 && validatePaymentCode(value)) {
      setIsVerifyingCode(true);

      try {
        // Verify with API
        const response = await paymentCodeAPI.verify(value);
        if (response.success && response.data.valid) {
          setCodeVerificationStatus('valid');
        } else {
          setCodeVerificationStatus('invalid');
          setPaymentCodeError('Payment code not found or already used');
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        setCodeVerificationStatus('invalid');
        setPaymentCodeError('Unable to verify payment code');
      } finally {
        setIsVerifyingCode(false);
      }
    } else if (value.length >= 10 && !validatePaymentCode(value)) {
      setCodeVerificationStatus('invalid');
      setPaymentCodeError('Invalid payment code format. Expected format: PAY-YYYY-XXXXXX');
    }
  };

  // Validate file before upload
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (file.size > maxSize) {
      return { valid: false, error: { type: 'file_too_large', details: `File size: ${(file.size / 1024 / 1024).toFixed(2)}MB` } };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: { type: 'unsupported_format', details: `File type: ${file.type}` } };
    }

    return { valid: true };
  };

  // Handle file selection
  const handleFilesSelected = (selectedFiles) => {
    setError(null);

    // Validate each file
    const validFiles = [];
    for (const file of selectedFiles) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }
      validFiles.push(file);
    }

    // Add valid files (only support one file for now)
    setFiles(validFiles.slice(0, 1));
  };

  // Remove file from list
  const handleRemoveFile = (index) => {
    const fileToRemove = files[index];
    setFiles(prev => prev.filter((_, i) => i !== index));
    
    // Remove from processing status
    setProcessingStatus(prev => {
      const updated = { ...prev };
      delete updated[fileToRemove.name];
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!paymentCode) {
      setPaymentCodeError('Payment code is required');
      return;
    }

    if (!validatePaymentCode(paymentCode)) {
      setPaymentCodeError('Please enter a valid payment code');
      return;
    }

    if (files.length === 0) {
      setError({ type: 'no_files', details: 'Please upload at least one receipt file' });
      return;
    }

    // Start processing
    setIsProcessing(true);
    setIsUploading(true);
    setUploadProgress(0);

    // Update processing steps
    const steps = [...processingSteps];
    steps[0].status = 'processing'; // Upload started
    setProcessingSteps(steps);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('receipt', files[0]);
      formData.append('paymentCode', paymentCode);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload receipt
      const response = await receiptAPI.upload(formData);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        // Update all steps to completed
        const completedSteps = steps.map(step => ({ ...step, status: 'completed' }));
        setProcessingSteps(completedSteps);

        // Update file status
        setProcessingStatus({ [files[0].name]: 'success' });

        // Wait a moment then navigate
        setTimeout(() => {
          navigate('/upload-confirmation-status', {
            state: {
              paymentCode,
              files: files,
              referenceId: response.data.referenceId,
              status: response.data.status,
              analysisData: response.data.analysis
            }
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError({
        type: 'upload_failed',
        details: formatErrorMessage(error)
      });

      // Reset processing steps
      const failedSteps = processingSteps.map(step => ({ ...step, status: 'pending' }));
      setProcessingSteps(failedSteps);
      setProcessingStatus({ [files[0].name]: 'error' });
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsProcessing(false);
    
    // Reset processing status
    const resetStatus = {};
    files.forEach(file => {
      resetStatus[file.name] = 'pending';
    });
    setProcessingStatus(resetStatus);
    
    // Reset processing steps
    setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
  };

  // Check if form is ready for submission
  const isFormReady = paymentCode && 
                     codeVerificationStatus === 'valid' && 
                     files.length > 0 && 
                     !isUploading && 
                     !isProcessing;

  return (
    <div className="min-h-screen bg-background">
      <StudentWorkflowNav />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={2} />

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Upload Receipt
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your payment receipt and enter your payment code for verification. 
            Our AI system will automatically process and verify your submission.
          </p>
        </div>

        <div className="space-y-8">
          {/* Payment Code Input */}
          <PaymentCodeInput
            paymentCode={paymentCode}
            onPaymentCodeChange={handlePaymentCodeChange}
            error={paymentCodeError}
            isVerifying={isVerifyingCode}
            verificationStatus={codeVerificationStatus}
          />

          {/* Error Handler */}
          <ErrorHandler
            error={error}
            onRetry={handleRetry}
            onDismiss={() => setError(null)}
          />

          {/* Upload Zone */}
          <div className="space-y-6">
            <UploadZone
              onFilesSelected={handleFilesSelected}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />

            {/* File Preview */}
            <FilePreview
              files={files}
              onRemoveFile={handleRemoveFile}
              processingStatus={processingStatus}
            />
          </div>

          {/* Processing Status */}
          {(isProcessing || Object.values(processingStatus).some(status => status === 'processing')) && (
            <ProcessingStatus
              currentStep={2}
              steps={processingSteps}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate('/payment-code-generation')}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={16}
            >
              Back to Code Generation
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleRetry}
                disabled={!files.length || isUploading || isProcessing}
                iconName="RotateCcw"
                iconPosition="left"
                iconSize={16}
              >
                Reset
              </Button>

              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={!isFormReady}
                loading={isProcessing || isUploading}
                iconName="Upload"
                iconPosition="left"
                iconSize={16}
              >
                {isProcessing ? 'Processing...' : 'Submit for Verification'}
              </Button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-muted/50 border border-border rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="HelpCircle" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Make sure your receipt clearly shows the payment amount and date</p>
                <p>• Ensure the payment code matches exactly with what you generated</p>
                <p>• Supported formats: JPG, PNG, PDF (max 10MB per file)</p>
                <p>• Processing typically takes 2-3 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceiptUpload;