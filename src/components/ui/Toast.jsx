import React, { useEffect } from 'react';
import Icon from '../AppIcon';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: 'CheckCircle',
    error: 'XCircle',
    warning: 'AlertTriangle',
    info: 'Info'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg border shadow-lg ${typeStyles[type]} animate-in slide-in-from-top-5 duration-300`}
      role="alert"
    >
      <Icon
        name={icons[type]}
        size={20}
        className={`flex-shrink-0 mt-0.5 ${iconColors[type]}`}
      />
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  );
};

export default Toast;
