import React from 'react';
import Icon from '../../../components/AppIcon';

const SubmissionTimeline = ({ timeline }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'processing':
        return { name: 'Clock', color: 'text-warning' };
      case 'failed':
        return { name: 'XCircle', color: 'text-error' };
      default:
        return { name: 'Circle', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Clock" size={20} className="mr-2" />
        Processing Timeline
      </h3>
      
      <div className="space-y-4">
        {timeline.map((event, index) => {
          const icon = getStatusIcon(event.status);
          const isLast = index === timeline.length - 1;
          
          return (
            <div key={index} className="relative">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  event.status === 'completed' ? 'bg-success/10' :
                  event.status === 'processing' ? 'bg-warning/10' :
                  event.status === 'failed' ? 'bg-error/10' : 'bg-muted'
                }`}>
                  <Icon name={icon.name} size={16} className={icon.color} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
                    <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  
                  {event.details && (
                    <div className="mt-2 p-2 bg-muted/20 rounded text-xs text-muted-foreground">
                      {event.details}
                    </div>
                  )}
                </div>
              </div>
              
              {!isLast && (
                <div className="absolute left-4 top-8 w-0.5 h-6 bg-border"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionTimeline;