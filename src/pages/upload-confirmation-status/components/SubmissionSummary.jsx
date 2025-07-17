import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SubmissionSummary = ({ receiptData }) => {
  const {
    receiptThumbnail,
    extractedCode,
    studentInfo,
    uploadTime,
    fileSize,
    fileName
  } = receiptData;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-6">Submission Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receipt Preview */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Uploaded Receipt</h4>
          <div className="border border-border rounded-lg p-4 bg-muted">
            <div className="aspect-[3/4] bg-background rounded-lg overflow-hidden mb-3">
              <Image
                src={receiptThumbnail}
                alt="Receipt thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="File" size={16} />
                <span className="truncate">{fileName}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="HardDrive" size={16} />
                <span>{fileSize}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>{uploadTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Information */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Extracted Information</h4>
          
          <div className="space-y-4">
            {/* Payment Code */}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Payment Code</p>
              <p className="font-mono font-semibold text-foreground text-lg">
                {extractedCode || 'Processing...'}
              </p>
            </div>

            {/* Student Information */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Student Details</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="text-sm text-foreground">{studentInfo.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Student ID:</span>
                  <span className="text-sm text-foreground">{studentInfo.studentId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm text-foreground">{studentInfo.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="text-sm text-foreground">{studentInfo.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSummary;