import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActionsPanel = ({ selectedCount, onBulkApprove, onBulkReject, onBulkExport, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="CheckSquare" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {selectedCount} receipt{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="success"
            size="sm"
            onClick={onBulkApprove}
            iconName="Check"
            iconPosition="left"
          >
            Approve All
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkReject}
            iconName="X"
            iconPosition="left"
          >
            Reject All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            iconName="Download"
            iconPosition="left"
          >
            Export Selected
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsPanel;