import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      receipt_submitted: 'Upload',
      receipt_approved: 'CheckCircle',
      receipt_rejected: 'XCircle',
      receipt_flagged: 'AlertTriangle',
      admin_login: 'LogIn',
      bulk_action: 'Layers'
    };
    return iconMap[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      receipt_submitted: 'text-primary',
      receipt_approved: 'text-success',
      receipt_rejected: 'text-destructive',
      receipt_flagged: 'text-warning',
      admin_login: 'text-muted-foreground',
      bulk_action: 'text-secondary'
    };
    return colorMap[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={20} className="text-muted-foreground" />
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
              <Icon name={getActivityIcon(activity.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm text-foreground">
                <span className="font-medium">{activity.user}</span>
                <span className="ml-1">{activity.action}</span>
                {activity.target && (
                  <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded ml-1">
                    {activity.target}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(activity.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;