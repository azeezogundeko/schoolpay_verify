import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const StatusUpdater = ({ referenceId, onStatusUpdate, currentStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [updateInterval, setUpdateInterval] = useState(null);

  // Simulate real-time status updates
  useEffect(() => {
    if (currentStatus === 'processing') {
      const interval = setInterval(() => {
        setIsUpdating(true);
        
        // Simulate API call delay
        setTimeout(() => {
          setIsUpdating(false);
          setLastUpdated(new Date());
          
          // Simulate status progression (for demo purposes)
          const random = Math.random();
          if (random > 0.7) {
            onStatusUpdate('verified');
            clearInterval(interval);
          } else if (random < 0.1) {
            onStatusUpdate('flagged');
            clearInterval(interval);
          }
        }, 1000);
      }, 30000); // Check every 30 seconds

      setUpdateInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [currentStatus, onStatusUpdate]);

  const handleManualRefresh = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      setIsUpdating(false);
      setLastUpdated(new Date());
      
      // Simulate potential status change
      const random = Math.random();
      if (random > 0.8) {
        onStatusUpdate('verified');
      } else if (random < 0.1) {
        onStatusUpdate('flagged');
      }
    }, 1500);
  };

  const formatLastUpdated = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleTimeString();
    }
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-primary animate-pulse' : 'bg-success'}`} />
          <span className="text-sm text-muted-foreground">
            {isUpdating ? 'Checking for updates...' : `Last updated: ${formatLastUpdated(lastUpdated)}`}
          </span>
        </div>
        
        <button
          onClick={handleManualRefresh}
          disabled={isUpdating}
          className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-hover disabled:opacity-50"
        >
          <Icon 
            name="RefreshCw" 
            size={16} 
            className={isUpdating ? 'animate-spin' : ''} 
          />
          <span>Refresh</span>
        </button>
      </div>
      
      {currentStatus === 'processing' && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            Status updates automatically every 30 seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusUpdater;