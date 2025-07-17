import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeaderNav from '../../components/ui/AdminHeaderNav';
import AdminBreadcrumbs from '../../components/ui/AdminBreadcrumbs';
import ReceiptImageViewer from './components/ReceiptImageViewer';
import AnalysisPanel from './components/AnalysisPanel';
import StudentInfoCard from './components/StudentInfoCard';
import SubmissionTimeline from './components/SubmissionTimeline';
import DecisionPanel from './components/DecisionPanel';
import NavigationControls from './components/NavigationControls';
import Icon from '../../components/AppIcon';

const ReceiptReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock receipt data
  const mockReceipt = {
    id: id || 'RCP-2025-001',
    referenceId: 'REF-789123456',
    studentName: 'Sarah Johnson',
    studentId: 'STU-2025-456',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    grade: 'Grade 10 - Section A',
    generatedCode: 'PAY-2025-789123',
    extractedCode: 'PAY-2025-789123',
    codeMatch: true,
    codeDifferences: [],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=800&fit=crop',
    fileSize: '2.4 MB',
    format: 'JPEG',
    dimensions: '1200x1600',
    uploadTime: '2025-01-17 09:45:23',
    status: 'pending',
    submissionDate: '2025-01-17',
    ocrResults: {
      extractedText: `SCHOOL PAYMENT RECEIPT
Payment Code: PAY-2025-789123
Student: Sarah Johnson
Amount: $150.00
Date: January 17, 2025
Transaction ID: TXN-456789
Payment Method: Credit Card
Status: Completed`,
      confidence: 94,
      processingTime: '2.3 seconds'
    },
    aiAnalysis: {
      overallScore: 87,
      factors: [
        {
          name: 'Text Clarity',
          score: 92,
          description: 'Receipt text is clear and easily readable with high OCR confidence'
        },
        {
          name: 'Code Authenticity',
          score: 95,
          description: 'Payment code format matches expected pattern and validates correctly'
        },
        {
          name: 'Document Structure',
          score: 88,
          description: 'Receipt follows standard format with proper headers and sections'
        },
        {
          name: 'Tampering Detection',
          score: 75,
          description: 'Minor inconsistencies in font rendering detected but within acceptable range'
        }
      ]
    },
    flags: [],
    previousActions: [
      {
        adminName: 'John Smith',
        action: 'Requested additional information',
        comments: 'Please provide clearer image of payment code section',
        timestamp: '2025-01-16 14:30:00'
      }
    ]
  };

  const mockTimeline = [
    {
      title: 'Receipt Uploaded',
      description: 'Student uploaded payment receipt image',
      timestamp: '09:45 AM',
      status: 'completed',
      details: 'File: receipt_payment.jpg (2.4 MB)'
    },
    {
      title: 'OCR Processing',
      description: 'Optical Character Recognition completed',
      timestamp: '09:45 AM',
      status: 'completed',
      details: 'Confidence: 94% | Processing time: 2.3s'
    },
    {
      title: 'AI Analysis',
      description: 'Automated verification and fraud detection',
      timestamp: '09:46 AM',
      status: 'completed',
      details: 'Overall score: 87% | No critical issues detected'
    },
    {
      title: 'Admin Review',
      description: 'Pending administrator verification',
      timestamp: '09:46 AM',
      status: 'processing',
      details: 'Assigned to review queue'
    }
  ];

  useEffect(() => {
    // Simulate loading receipt data
    const loadReceipt = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReceipt(mockReceipt);
      setLoading(false);
    };

    loadReceipt();
  }, [id]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case 'a':
          // Quick approve
          break;
        case 'r':
          // Quick reject
          break;
        case 'arrowleft': handleNavigate('previous');
          break;
        case 'arrowright': handleNavigate('next');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleDecision = async (decisionData) => {
    console.log('Decision submitted:', decisionData);
    // Mock API call to submit decision
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update receipt status
    setReceipt(prev => ({
      ...prev,
      status: decisionData.decision === 'approve' ? 'approved' : 
              decisionData.decision === 'reject' ? 'rejected' : 'info-requested',
      lastAction: decisionData
    }));

    // Navigate back to dashboard after successful submission
    if (decisionData.decision !== 'request-info') {
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    }
  };

  const handleNavigate = (direction) => {
    // Mock navigation logic
    console.log(`Navigating to ${direction} receipt`);
    // In real app, this would load the next/previous receipt
  };

  const customBreadcrumbs = [
    { label: 'Dashboard', path: '/admin-dashboard', icon: 'LayoutDashboard' },
    { label: 'Receipt Review', path: '/receipt-review-detail', icon: 'FileText' },
    { label: `Receipt ${receipt?.referenceId || 'Loading...'}`, path: `/receipt-review-detail/${id}`, icon: 'Eye' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeaderNav />
        <div className="pt-16">
          <AdminBreadcrumbs customBreadcrumbs={customBreadcrumbs} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="Loader2" size={48} className="mx-auto text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading receipt details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeaderNav />
        <div className="pt-16">
          <AdminBreadcrumbs customBreadcrumbs={customBreadcrumbs} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <Icon name="FileX" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Receipt Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The receipt you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="text-primary hover:underline"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeaderNav />
      <div className="pt-16">
        <AdminBreadcrumbs customBreadcrumbs={customBreadcrumbs} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Navigation Controls */}
          <div className="mb-6">
            <NavigationControls
              currentReceiptId={receipt.id}
              totalReceipts={25}
              onNavigate={handleNavigate}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Panel - Receipt Image */}
            <div className="lg:col-span-1">
              <ReceiptImageViewer receipt={receipt} />
            </div>

            {/* Right Panel - Analysis */}
            <div className="lg:col-span-1">
              <AnalysisPanel receipt={receipt} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <StudentInfoCard receipt={receipt} />
                <SubmissionTimeline timeline={mockTimeline} />
              </div>
            </div>

            {/* Decision Panel */}
            <div className="lg:col-span-2">
              <DecisionPanel receipt={receipt} onDecision={handleDecision} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptReviewDetail;