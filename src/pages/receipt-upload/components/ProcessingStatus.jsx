import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingStatus = ({ currentStep, steps }) => {
  const defaultSteps = [
    {
      id: 'upload',
      label: 'File Upload',
      description: 'Uploading receipt files',
      status: 'completed'
    },
    {
      id: 'ocr',
      label: 'OCR Extraction',
      description: 'Extracting text from receipt',
      status: 'processing'
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
  ];

  const processSteps = steps || defaultSteps;

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', className: 'text-success' };
      case 'processing':
        return { icon: 'Loader2', className: 'text-primary animate-spin' };
      case 'error':
        return { icon: 'XCircle', className: 'text-error' };
      default:
        return { icon: 'Clock', className: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Processing Status</h3>
          <p className="text-sm text-muted-foreground">
            Your receipt is being processed automatically
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {processSteps.map((step, index) => {
          const statusInfo = getStepIcon(step.status);
          const isActive = step.status === 'processing';
          
          return (
            <div
              key={step.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                isActive ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'
              }`}
            >
              {/* Step Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.status === 'completed' ? 'bg-success/10' :
                step.status === 'processing' ? 'bg-primary/10' :
                step.status === 'error'? 'bg-error/10' : 'bg-muted'
              }`}>
                <Icon 
                  name={statusInfo.icon} 
                  size={20} 
                  className={statusInfo.className}
                />
              </div>

              {/* Step Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-medium ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </h4>
                  {step.status === 'processing' && (
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>

              {/* Step Number */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step.status === 'completed' ? 'bg-success text-success-foreground' :
                step.status === 'processing' ? 'bg-primary text-primary-foreground' :
                step.status === 'error' ? 'bg-error text-error-foreground' :
                'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Processing Time Estimate */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Estimated processing time: 2-3 minutes
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;