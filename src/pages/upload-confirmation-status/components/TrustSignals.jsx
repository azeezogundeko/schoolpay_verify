import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = ({ processingTime, securityLevel }) => {
  const trustIndicators = [
    {
      icon: 'Shield',
      title: 'Secure Processing',
      description: 'SSL encrypted data transmission'
    },
    {
      icon: 'Clock',
      title: 'Fast Verification',
      description: `Average processing time: ${processingTime}`
    },
    {
      icon: 'CheckCircle',
      title: 'AI Powered',
      description: '99.8% accuracy in receipt validation'
    },
    {
      icon: 'Users',
      title: 'Trusted by Schools',
      description: 'Used by 500+ educational institutions'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Why Trust SchoolPay Verify?
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trustIndicators.map((indicator, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={indicator.icon} size={16} className="text-primary" />
            </div>
            
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">
                {indicator.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {indicator.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Badge */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Lock" size={16} className="text-success" />
          <span className="text-sm text-muted-foreground">
            {securityLevel} Security Level
          </span>
          <Icon name="Award" size={16} className="text-warning" />
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;