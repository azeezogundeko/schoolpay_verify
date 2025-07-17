import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusCard = ({ referenceId, submissionTime, currentStatus }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return { name: 'Clock', color: 'text-warning' };
      case 'verified':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'flagged':
        return { name: 'AlertTriangle', color: 'text-error' };
      default:
        return { name: 'Clock', color: 'text-warning' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'verified':
        return 'Verified';
      case 'flagged':
        return 'Needs Review';
      default:
        return 'Processing';
    }
  };

  const statusIcon = getStatusIcon(currentStatus);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="text-center">
        {/* Status Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full bg-muted flex items-center justify-center ${statusIcon.color}`}>
            <Icon name={statusIcon.name} size={32} />
          </div>
        </div>

        {/* Status Text */}
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Receipt {getStatusText(currentStatus)}
        </h2>

        {/* Reference ID */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-1">Reference ID</p>
          <p className="text-lg font-mono font-semibold text-foreground">{referenceId}</p>
        </div>

        {/* Submission Time */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Submitted on {submissionTime}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;