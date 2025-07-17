import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentWorkflowNav from '../../components/ui/StudentWorkflowNav';
import StatusCard from './components/StatusCard';
import ProgressTracker from './components/ProgressTracker';
import SubmissionSummary from './components/SubmissionSummary';
import ActionButtons from './components/ActionButtons';
import TrustSignals from './components/TrustSignals';
import StatusUpdater from './components/StatusUpdater';

const UploadConfirmationStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from previous page or use mock data
  const submissionData = location.state || {
    referenceId: 'SPV-2025-0717-8429',
    submissionTime: 'July 17, 2025 at 10:01 AM',
    currentStatus: 'processing',
    currentStage: 'ocr'
  };

  const [status, setStatus] = useState(submissionData.currentStatus);
  const [currentStage, setCurrentStage] = useState(submissionData.currentStage);

  // Mock receipt data
  const receiptData = {
    receiptThumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
    extractedCode: status === 'processing' ? null : 'PAY-2025-0717-8429',
    studentInfo: {
      name: 'Sarah Johnson',
      studentId: 'STU-2025-001',
      email: 'sarah.johnson@student.edu',
      phone: '+1 (555) 123-4567'
    },
    uploadTime: submissionData.submissionTime,
    fileSize: '2.4 MB',
    fileName: 'receipt_payment_proof.jpg'
  };

  const handleStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    
    // Update stage based on status
    if (newStatus === 'verified') {
      setCurrentStage('review');
    } else if (newStatus === 'flagged') {
      setCurrentStage('review');
    }
  };

  const handleCheckStatusLater = () => {
    // In a real app, this would show instructions for tracking
    alert(`Save this reference ID: ${submissionData.referenceId}\n\nYou can check your status anytime by visiting our website and entering your reference ID.`);
  };

  const handleSubmitAnother = () => {
    navigate('/payment-code-generation');
  };

  // Auto-redirect if no submission data and not from valid flow
  useEffect(() => {
    if (!location.state && !localStorage.getItem('lastSubmission')) {
      navigate('/payment-code-generation');
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <StudentWorkflowNav />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Receipt Submitted Successfully!
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your payment receipt has been uploaded and is being processed. 
            You can track the verification status using your reference ID below.
          </p>
        </div>

        <div className="space-y-8">
          {/* Status Card */}
          <StatusCard
            referenceId={submissionData.referenceId}
            submissionTime={submissionData.submissionTime}
            currentStatus={status}
          />

          {/* Status Updater */}
          <StatusUpdater
            referenceId={submissionData.referenceId}
            onStatusUpdate={handleStatusUpdate}
            currentStatus={status}
          />

          {/* Progress Tracker */}
          <ProgressTracker currentStage={currentStage} />

          {/* Submission Summary */}
          <SubmissionSummary receiptData={receiptData} />

          {/* Action Buttons */}
          <ActionButtons
            referenceId={submissionData.referenceId}
            onCheckStatusLater={handleCheckStatusLater}
            onSubmitAnother={handleSubmitAnother}
          />

          {/* Trust Signals */}
          <TrustSignals
            processingTime="2-5 minutes"
            securityLevel="Bank-Grade"
          />
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="bg-muted/50 rounded-lg p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                • Your receipt is being processed using advanced OCR technology
              </p>
              <p>
                • AI verification will compare the extracted payment code with our records
              </p>
              <p>
                • If verification is successful, you'll receive confirmation within minutes
              </p>
              <p>
                • Complex cases may require manual review by our admin team (1-24 hours)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadConfirmationStatus;