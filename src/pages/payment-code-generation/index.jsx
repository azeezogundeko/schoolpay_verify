import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import StudentWorkflowNav from '../../components/ui/StudentWorkflowNav';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import StudentInfoForm from './components/StudentInfoForm';
import GeneratedCodeDisplay from './components/GeneratedCodeDisplay';
import TrustSignals from './components/TrustSignals';
import RecentActivity from './components/RecentActivity';
import HelpSection from './components/HelpSection';
import Icon from '../../components/AppIcon';

const PaymentCodeGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);

  const generateUniqueCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `PAY${timestamp}${random}`.toUpperCase().substr(0, 12);
  };

  const generateReferenceId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 3);
    return `REF${timestamp}${random}`.toUpperCase();
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const code = generateUniqueCode();
      const referenceId = generateReferenceId();
      const generatedAt = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const codeData = {
        ...formData,
        code,
        referenceId,
        generatedAt,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };

      setGeneratedCode(codeData);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setGeneratedCode(null);
  };

  return (
    <>
      <Helmet>
        <title>Generate Payment Code - SchoolPay Verify</title>
        <meta name="description" content="Generate unique payment codes for school fee verification. Quick, secure, and mobile-friendly payment code generation system." />
        <meta name="keywords" content="school payment, payment code, student fees, payment verification" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <StudentWorkflowNav />
        
        <main className="pt-16">
          {/* Progress Indicator */}
          <div className="bg-card border-b border-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <ProgressIndicator 
                currentStep={1} 
                totalSteps={3}
                steps={[
                  { label: 'Generate Code', description: 'Create payment code' },
                  { label: 'Upload Receipt', description: 'Submit payment proof' },
                  { label: 'Confirmation', description: 'Verify status' }
                ]}
                showLabels={true}
                size="default"
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    School Payment Verification
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6">
                    Generate a unique payment code to verify your school fee payments quickly and securely.
                  </p>
                </div>

                {/* Main Form or Code Display */}
                {!generatedCode ? (
                  <StudentInfoForm 
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                  />
                ) : (
                  <GeneratedCodeDisplay 
                    codeData={generatedCode}
                    onStartOver={handleStartOver}
                  />
                )}

                {/* Trust Signals - Show only when form is visible */}
                {!generatedCode && (
                  <TrustSignals />
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <RecentActivity />

                {/* Help Section */}
                <HelpSection />

                {/* Contact Info */}
                <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon name="Phone" size={20} className="text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Need Help?</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Support Hours: 9 AM - 6 PM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Mail" size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">support@schoolpay.edu</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="GraduationCap" size={20} color="white" />
                  </div>
                  <span className="text-lg font-semibold text-foreground">SchoolPay Verify</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Secure and efficient payment verification system for educational institutions.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-hover">How it Works</a></li>
                  <li><a href="#" className="hover:text-foreground transition-hover">Support</a></li>
                  <li><a href="#" className="hover:text-foreground transition-hover">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-foreground transition-hover">Terms of Service</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3">Security</h4>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Shield" size={12} />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Lock" size={12} />
                    <span>Secure</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} SchoolPay Verify. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PaymentCodeGeneration;