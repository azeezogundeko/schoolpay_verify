import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const ActionButtons = ({ referenceId, onCheckStatusLater, onSubmitAnother }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareReference = async () => {
    const shareData = {
      title: 'SchoolPay Verify - Receipt Reference',
      text: `My receipt reference ID: ${referenceId}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`Reference ID: ${referenceId}\nTrack at: ${window.location.origin}/upload-confirmation-status`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onCheckStatusLater}
          iconName="ExternalLink"
          iconPosition="right"
          fullWidth
        >
          Check Status Later
        </Button>
        
        <Button
          variant="default"
          size="lg"
          onClick={onSubmitAnother}
          iconName="Plus"
          iconPosition="left"
          fullWidth
        >
          Submit Another Receipt
        </Button>
      </div>

      {/* Reference ID Actions */}
      <div className="bg-muted rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-3 text-center">
          Save your reference ID for future tracking
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyReference}
            iconName={copied ? "Check" : "Copy"}
            iconPosition="left"
            fullWidth
          >
            {copied ? 'Copied!' : 'Copy Reference ID'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareReference}
            iconName={shared ? "Check" : "Share"}
            iconPosition="left"
            fullWidth
          >
            {shared ? 'Shared!' : 'Share Reference ID'}
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Need help? Contact support at{' '}
          <a href="mailto:support@schoolpayverify.com" className="text-primary hover:underline">
            support@schoolpayverify.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ActionButtons;