import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DecisionPanel = ({ receipt, onDecision }) => {
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [requestInfo, setRequestInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const decisionOptions = [
    { value: 'approve', label: 'Approve Payment' },
    { value: 'reject', label: 'Reject Payment' },
    { value: 'request-info', label: 'Request Additional Information' }
  ];

  const handleSubmitDecision = async () => {
    if (!decision || (decision !== 'request-info' && !comments.trim())) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onDecision({
        decision,
        comments: decision === 'request-info' ? requestInfo : comments,
        timestamp: new Date().toISOString(),
        adminId: 'admin-001' // Mock admin ID
      });
    } catch (error) {
      console.error('Error submitting decision:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalate = () => {
    // Mock escalation logic
    console.log('Escalating case to senior administrator');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Gavel" size={20} className="mr-2" />
        Administrative Decision
      </h3>
      
      <div className="space-y-4">
        {/* Decision Selection */}
        <Select
          label="Decision"
          options={decisionOptions}
          value={decision}
          onChange={setDecision}
          placeholder="Select your decision"
          required
        />

        {/* Comments for Approve/Reject */}
        {decision && decision !== 'request-info' && (
          <Input
            label="Comments"
            type="text"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter your comments (required for audit trail)"
            description="This comment will be recorded in the audit log"
            required
          />
        )}

        {/* Request Additional Information Form */}
        {decision === 'request-info' && (
          <div className="space-y-3">
            <Input
              label="Information Request"
              type="text"
              value={requestInfo}
              onChange={(e) => setRequestInfo(e.target.value)}
              placeholder="Specify what additional information is needed"
              description="This message will be sent to the student"
              required
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            onClick={handleSubmitDecision}
            disabled={!decision || (decision !== 'request-info' && !comments.trim()) || isSubmitting}
            loading={isSubmitting}
            iconName={
              decision === 'approve' ? 'CheckCircle' :
              decision === 'reject' ? 'XCircle' : 'MessageSquare'
            }
            iconPosition="left"
            fullWidth
          >
            {decision === 'approve' ? 'Approve Payment' :
             decision === 'reject' ? 'Reject Payment' : 
             decision === 'request-info' ? 'Request Information' : 'Submit Decision'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleEscalate}
            iconName="ArrowUp"
            iconPosition="left"
            fullWidth
          >
            Escalate Case
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDecision('approve');
                setComments('Payment verified successfully through automated checks.');
              }}
              iconName="Zap"
              iconPosition="left"
              iconSize={14}
            >
              Quick Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDecision('reject');
                setComments('Payment code mismatch detected.');
              }}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Quick Reject
            </Button>
          </div>
        </div>

        {/* Previous Actions */}
        {receipt.previousActions && receipt.previousActions.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Previous Actions</h4>
            <div className="space-y-2">
              {receipt.previousActions.map((action, index) => (
                <div key={index} className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {action.adminName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {action.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.action}</p>
                  {action.comments && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      "{action.comments}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionPanel;