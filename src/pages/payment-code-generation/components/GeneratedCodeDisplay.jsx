import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GeneratedCodeDisplay = ({ codeData, onStartOver }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleUploadReceipt = () => {
    // Store the code data for the next step
    localStorage.setItem('paymentCodeData', JSON.stringify(codeData));
    navigate('/receipt-upload');
  };

  const getQRCodeUrl = (code) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(code)}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} color="white" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Payment Code Generated!</h2>
        <p className="text-muted-foreground">Your unique payment code is ready to use</p>
      </div>

      {/* Code Display */}
      <div className="bg-background rounded-lg border-2 border-primary p-6 mb-6">
        <div className="text-center">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Payment Code
          </label>
          <div className="text-3xl font-mono font-bold text-primary mb-4 tracking-wider">
            {codeData.code}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            iconName={copied ? "Check" : "Copy"}
            iconPosition="left"
            className="mb-4"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-lg border border-border">
            <img
              src={getQRCodeUrl(codeData.code)}
              alt="Payment Code QR"
              className="w-48 h-48 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Scan this QR code or use the code above for payment
        </div>
      </div>

      {/* Code Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="User" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Student Details</span>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="font-medium">Name:</span> {codeData.studentName}</p>
            <p><span className="font-medium">ID:</span> {codeData.studentId}</p>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Payment Details</span>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="font-medium">Amount:</span> ${codeData.paymentAmount.toFixed(2)}</p>
            <p><span className="font-medium">Purpose:</span> {codeData.paymentPurpose}</p>
          </div>
        </div>
      </div>

      {/* Reference Info */}
      <div className="bg-background rounded-lg border border-border p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-foreground">Reference ID:</span>
            <p className="text-muted-foreground font-mono">{codeData.referenceId}</p>
          </div>
          <div>
            <span className="font-medium text-foreground">Generated:</span>
            <p className="text-muted-foreground">{codeData.generatedAt}</p>
          </div>
        </div>
      </div>

      {/* Expiration Timer */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Clock" size={16} className="text-warning" />
          <span className="text-sm font-medium text-foreground">Code Expires In</span>
        </div>
        <div className="text-2xl font-mono font-bold text-warning">
          {formatTime(timeRemaining)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Complete your payment before the code expires
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={handleUploadReceipt}
          iconName="Upload"
          iconPosition="left"
        >
          Upload Payment Receipt
        </Button>

        <Button
          variant="outline"
          size="default"
          fullWidth
          onClick={onStartOver}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Generate New Code
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Next Steps:</p>
            <ol className="space-y-1 text-xs list-decimal list-inside">
              <li>Make your payment using the code above</li>
              <li>Keep your payment receipt/screenshot</li>
              <li>Upload the receipt for verification</li>
              <li>Wait for admin approval confirmation</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedCodeDisplay;