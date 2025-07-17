import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Secure & Encrypted',
      description: 'All data protected with SSL encryption'
    },
    {
      icon: 'Clock',
      title: 'Instant Generation',
      description: 'Get your payment code in seconds'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified System',
      description: 'Trusted by thousands of students'
    },
    {
      icon: 'Smartphone',
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Why Choose SchoolPay Verify?</h3>
        <p className="text-sm text-muted-foreground">Trusted payment verification system for students</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trustFeatures.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature.icon} size={16} color="white" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={12} />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Award" size={12} />
            <span>Verified Platform</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={12} />
            <span>10,000+ Students</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;