import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorHandler = ({ error, onRetry, onDismiss }) => {
  const getErrorDetails = (errorType) => {
    switch (errorType) {
      case 'file_too_large':
        return {
          icon: 'AlertTriangle',
          title: 'File Too Large',
          message: 'The selected file exceeds the 10MB size limit. Please choose a smaller file or compress your image.',
          color: 'warning'
        };
      case 'unsupported_format':
        return {
          icon: 'FileX',
          title: 'Unsupported Format',
          message: 'Please upload files in JPG, PNG, or PDF format only.',
          color: 'error'
        };
      case 'network_error':
        return {
          icon: 'Wifi',
          title: 'Network Error',
          message: 'Unable to upload files due to network issues. Please check your connection and try again.',
          color: 'error'
        };
      case 'processing_failed':
        return {
          icon: 'AlertCircle',
          title: 'Processing Failed',
          message: 'We encountered an issue while processing your receipt. Please try uploading again.',
          color: 'error'
        };
      case 'invalid_payment_code':
        return {
          icon: 'XCircle',
          title: 'Invalid Payment Code',
          message: 'The payment code you entered is not valid or has expired. Please check and try again.',
          color: 'error'
        };
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Upload Error',
          message: 'An unexpected error occurred. Please try again.',
          color: 'error'
        };
    }
  };

  if (!error) return null;

  const errorDetails = getErrorDetails(error.type);

  return (
    <div className={`border rounded-lg p-6 ${
      errorDetails.color === 'warning' ?'bg-warning/5 border-warning/20' :'bg-error/5 border-error/20'
    }`}>
      <div className="flex items-start space-x-4">
        {/* Error Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          errorDetails.color === 'warning' ?'bg-warning/10' :'bg-error/10'
        }`}>
          <Icon 
            name={errorDetails.icon} 
            size={20} 
            className={errorDetails.color === 'warning' ? 'text-warning' : 'text-error'}
          />
        </div>

        {/* Error Content */}
        <div className="flex-1">
          <h3 className={`font-semibold mb-2 ${
            errorDetails.color === 'warning' ? 'text-warning' : 'text-error'
          }`}>
            {errorDetails.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {errorDetails.message}
          </p>

          {/* Error Details */}
          {error.details && (
            <div className="text-xs text-muted-foreground mb-4 p-3 bg-muted/50 rounded border">
              <strong>Technical Details:</strong> {error.details}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                iconName="RotateCcw"
                iconPosition="left"
                iconSize={16}
              >
                Try Again
              </Button>
            )}
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Help Links */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm">
          <a 
            href="/payment-code-generation" 
            className="text-primary hover:underline flex items-center space-x-1"
          >
            <Icon name="ArrowLeft" size={14} />
            <span>Back to Code Generation</span>
          </a>
          <span className="text-muted-foreground">•</span>
          <button className="text-primary hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;