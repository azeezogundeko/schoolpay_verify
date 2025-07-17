import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressTracker = ({ currentStage }) => {
  const stages = [
    {
      id: 'upload',
      title: 'Receipt Uploaded',
      description: 'File successfully received',
      estimatedTime: 'Completed',
      icon: 'Upload'
    },
    {
      id: 'ocr',
      title: 'OCR Processing',
      description: 'Extracting payment code from receipt',
      estimatedTime: '1-2 minutes',
      icon: 'Scan'
    },
    {
      id: 'ai_verification',
      title: 'AI Verification',
      description: 'Comparing codes and validating authenticity',
      estimatedTime: '2-3 minutes',
      icon: 'Brain'
    },
    {
      id: 'review',
      title: 'Final Review',
      description: 'Admin verification if needed',
      estimatedTime: '1-24 hours',
      icon: 'UserCheck'
    }
  ];

  const getStageStatus = (stageId) => {
    const stageOrder = ['upload', 'ocr', 'ai_verification', 'review'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stageIndex = stageOrder.indexOf(stageId);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-6">Processing Status</h3>
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          
          return (
            <div key={stage.id} className="flex items-start space-x-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-smooth ${
                    status === 'completed'
                      ? 'bg-success text-success-foreground'
                      : status === 'current' ?'bg-primary text-primary-foreground ring-2 ring-primary ring-opacity-20' :'bg-muted text-muted-foreground'
                  }`}
                >
                  {status === 'completed' ? (
                    <Icon name="Check" size={20} />
                  ) : status === 'current' ? (
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                  ) : (
                    <Icon name={stage.icon} size={20} />
                  )}
                </div>
                
                {index < stages.length - 1 && (
                  <div
                    className={`w-0.5 h-12 mt-2 transition-smooth ${
                      status === 'completed' ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                )}
              </div>

              {/* Stage Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`font-medium ${
                      status === 'current' ?'text-foreground'
                        : status === 'completed' ?'text-success' :'text-muted-foreground'
                    }`}
                  >
                    {stage.title}
                  </h4>
                  
                  {status === 'current' && (
                    <span className="text-xs text-primary font-medium">
                      {stage.estimatedTime}
                    </span>
                  )}
                  
                  {status === 'completed' && (
                    <span className="text-xs text-success font-medium">
                      {stage.estimatedTime}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;