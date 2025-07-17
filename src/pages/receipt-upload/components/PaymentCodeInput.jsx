import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PaymentCodeInput = ({ 
  paymentCode, 
  onPaymentCodeChange, 
  error, 
  isVerifying,
  verificationStatus 
}) => {
  const getStatusIcon = () => {
    if (isVerifying) {
      return <Icon name="Loader2" size={16} className="text-warning animate-spin" />;
    }
    if (verificationStatus === 'valid') {
      return <Icon name="CheckCircle" size={16} className="text-success" />;
    }
    if (verificationStatus === 'invalid') {
      return <Icon name="XCircle" size={16} className="text-error" />;
    }
    return null;
  };

  const getStatusMessage = () => {
    if (isVerifying) return 'Verifying payment code...';
    if (verificationStatus === 'valid') return 'Payment code verified successfully';
    if (verificationStatus === 'invalid') return 'Invalid payment code format';
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="CreditCard" size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Payment Code Verification
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the payment code you generated earlier to link it with your receipt upload.
            </p>
            
            <div className="relative">
              <Input
                label="Payment Code"
                type="text"
                placeholder="Enter your payment code (e.g., PAY-2025-ABC123)"
                value={paymentCode}
                onChange={(e) => onPaymentCodeChange(e.target.value)}
                error={error}
                required
                className="pr-10"
              />
              
              {/* Status Icon */}
              {getStatusIcon() && (
                <div className="absolute right-3 top-9">
                  {getStatusIcon()}
                </div>
              )}
            </div>

            {/* Status Message */}
            {getStatusMessage() && (
              <div className={`mt-2 text-sm flex items-center space-x-2 ${
                verificationStatus === 'valid' ? 'text-success' :
                verificationStatus === 'invalid'? 'text-error' : 'text-warning'
              }`}>
                <span>{getStatusMessage()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Don't have a payment code?</p>
            <p>
              You need to generate a payment code first before uploading your receipt. 
              <a 
                href="/payment-code-generation" 
                className="text-primary hover:underline ml-1"
              >
                Generate one here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCodeInput;