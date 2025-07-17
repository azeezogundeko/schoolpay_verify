import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Authentication',
      description: 'Multi-factor authentication available'
    },
    {
      icon: 'Eye',
      title: 'Privacy Protected',
      description: 'FERPA compliant data handling'
    },
    {
      icon: 'CheckCircle',
      title: 'SOC 2 Certified',
      description: 'Audited security controls'
    }
  ];

  const complianceBadges = [
    {
      name: 'FERPA',
      description: 'Family Educational Rights and Privacy Act Compliant'
    },
    {
      name: 'COPPA',
      description: 'Children\'s Online Privacy Protection Act Compliant'
    },
    {
      name: 'SOC 2',
      description: 'Service Organization Control 2 Type II Certified'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Shield" size={20} className="text-success" />
          <span>Security Features</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-card rounded-lg border border-border">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name={feature.icon} size={16} className="text-success" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Badges */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Award" size={20} className="text-primary" />
          <span>Compliance & Certifications</span>
        </h3>
        <div className="space-y-3">
          {complianceBadges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary-foreground">{badge.name}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{badge.name} Compliant</h4>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-success/5 rounded-lg border border-success/20 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
          <div>
            <h4 className="text-sm font-medium text-foreground">System Status: Operational</h4>
            <p className="text-xs text-muted-foreground">All systems running normally</p>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default SecurityBadges;