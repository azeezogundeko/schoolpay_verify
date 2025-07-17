import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusBadge = ({ status, size = 'default' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const statusConfig = {
    pending: {
      label: 'Pending Review',
      icon: 'Clock',
      className: 'bg-warning/10 text-warning border-warning/20'
    },
    verified: {
      label: 'Verified',
      icon: 'CheckCircle',
      className: 'bg-success/10 text-success border-success/20'
    },
    flagged: {
      label: 'Flagged',
      icon: 'AlertTriangle',
      className: 'bg-error/10 text-error border-error/20'
    },
    rejected: {
      label: 'Rejected',
      icon: 'XCircle',
      className: 'bg-destructive/10 text-destructive border-destructive/20'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center space-x-1 rounded-full border font-medium ${sizeClasses[size]} ${config.className}`}>
      <Icon name={config.icon} size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;