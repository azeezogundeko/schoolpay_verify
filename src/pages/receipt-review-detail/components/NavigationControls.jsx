import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/ui/Button';

const NavigationControls = ({ currentReceiptId, totalReceipts, onNavigate }) => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (onNavigate) {
      onNavigate('previous');
    }
  };

  const handleNext = () => {
    if (onNavigate) {
      onNavigate('next');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin-dashboard');
  };

  // Mock data for current position
  const currentPosition = 1;
  const hasPrevious = currentPosition > 1;
  const hasNext = currentPosition < totalReceipts;

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        {/* Back to Dashboard */}
        <Button
          variant="outline"
          onClick={handleBackToDashboard}
          iconName="ArrowLeft"
          iconPosition="left"
          iconSize={16}
        >
          Back to Dashboard
        </Button>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-4">
          {/* Position Indicator */}
          <div className="text-sm text-muted-foreground">
            Receipt {currentPosition} of {totalReceipts}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!hasPrevious}
              iconName="ChevronLeft"
              iconSize={16}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!hasNext}
              iconName="ChevronRight"
              iconSize={16}
            />
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="hidden lg:flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
            <span>Previous</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
            <span>Next</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">A</kbd>
            <span>Approve</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">R</kbd>
            <span>Reject</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationControls;