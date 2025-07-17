import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const InstitutionalBranding = () => {
  return (
    <div className="text-center space-y-6">
      {/* Main Logo */}
      <Link to="/payment-code-generation" className="inline-flex items-center space-x-3">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <Icon name="GraduationCap" size={28} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">SchoolPay Verify</h1>
          <p className="text-sm text-muted-foreground">Administrator Portal</p>
        </div>
      </Link>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Secure access to the payment verification management system. 
          Please sign in with your administrator credentials.
        </p>
      </div>

      {/* Institution Info */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Building2" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Springfield Educational District</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={14} />
            <span>Springfield, IL 62701</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={14} />
            <span>(217) 555-0100</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Globe" size={14} />
            <span>www.springfield.edu</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={14} />
            <span>15,000+ Students</span>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={14} className="text-success" />
          <span>Secure</span>
        </div>
        <span>•</span>
        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={14} className="text-success" />
          <span>Encrypted</span>
        </div>
        <span>•</span>
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalBranding;