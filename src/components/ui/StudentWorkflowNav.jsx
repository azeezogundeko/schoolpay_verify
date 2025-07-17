import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const StudentWorkflowNav = () => {
  const location = useLocation();
  
  const getProgressStep = () => {
    switch (location.pathname) {
      case '/payment-code-generation':
        return 1;
      case '/receipt-upload':
        return 2;
      case '/upload-confirmation-status':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = getProgressStep();
  const totalSteps = 3;

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/payment-code-generation" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">SchoolPay</span>
              <span className="text-xs text-muted-foreground -mt-1">Verify</span>
            </div>
          </Link>

          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-smooth ${
                      step <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step < currentStep ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-1 transition-smooth ${
                        step < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="sm:hidden flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-smooth"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Start Over Button */}
          {currentStep > 1 && (
            <Link
              to="/payment-code-generation"
              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-hover"
            >
              <Icon name="RotateCcw" size={16} />
              <span className="hidden sm:inline">Start Over</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentWorkflowNav;