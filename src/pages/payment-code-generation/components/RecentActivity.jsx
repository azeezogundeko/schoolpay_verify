import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = () => {
  const recentActivities = [
    {
      id: 1,
      type: 'success',
      message: 'Payment verified for STU789012',
      time: '2 minutes ago',
      icon: 'CheckCircle'
    },
    {
      id: 2,
      type: 'info',
      message: 'New code generated for STU456789',
      time: '5 minutes ago',
      icon: 'Zap'
    },
    {
      id: 3,
      type: 'success',
      message: 'Receipt approved for STU123456',
      time: '8 minutes ago',
      icon: 'FileCheck'
    },
    {
      id: 4,
      type: 'info',
      message: 'Payment code created for STU987654',
      time: '12 minutes ago',
      icon: 'CreditCard'
    }
  ];

  const getActivityColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'info':
        return 'text-primary';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Activity" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-background rounded-lg border border-border">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-muted ${getActivityColor(activity.type)}`}>
              <Icon name={activity.icon} size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Real-time updates from the verification system
        </p>
      </div>
    </div>
  );
};

export default RecentActivity;