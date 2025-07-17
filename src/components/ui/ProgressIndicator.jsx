import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentStep = 1, 
  totalSteps = 3, 
  steps = [
    { label: 'Generate Code', description: 'Create payment code' },
    { label: 'Upload Receipt', description: 'Submit payment proof' },
    { label: 'Confirmation', description: 'Verify status' }
  ],
  showLabels = true,
  size = 'default' // 'sm', 'default', 'lg'
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-4',
      step: 'w-6 h-6 text-xs',
      line: 'h-0.5',
      label: 'text-xs',
      description: 'text-xs'
    },
    default: {
      container: 'py-6',
      step: 'w-8 h-8 text-sm',
      line: 'h-0.5',
      label: 'text-sm',
      description: 'text-xs'
    },
    lg: {
      container: 'py-8',
      step: 'w-10 h-10 text-base',
      line: 'h-1',
      label: 'text-base',
      description: 'text-sm'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`w-full ${classes.container}`}>
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div key={stepNumber} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`${classes.step} rounded-full flex items-center justify-center font-medium transition-smooth ${
                      isCompleted
                        ? 'bg-success text-success-foreground'
                        : isCurrent
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-opacity-20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <Icon name="Check" size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  
                  {/* Step Labels */}
                  {showLabels && (
                    <div className="mt-2 text-center">
                      <div
                        className={`font-medium ${classes.label} ${
                          isCurrent
                            ? 'text-foreground'
                            : isCompleted
                            ? 'text-success' :'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </div>
                      {step.description && (
                        <div className={`${classes.description} text-muted-foreground mt-1`}>
                          {step.description}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 ${classes.line} mx-4 transition-smooth ${
                      stepNumber < currentStep ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;