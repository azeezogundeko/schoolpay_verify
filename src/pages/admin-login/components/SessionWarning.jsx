import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SessionWarning = ({ isVisible, onExtend, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onLogout]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-modal max-w-md w-full p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Clock" size={20} className="text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Session Expiring Soon
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Your session will expire in <span className="font-mono font-medium text-warning">{formatTime(timeLeft)}</span>. 
              Would you like to extend your session?
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="default"
                size="sm"
                onClick={onExtend}
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
              >
                Extend Session
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                iconName="LogOut"
                iconPosition="left"
                iconSize={16}
              >
                Logout Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;