import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilePreview = ({ files, onRemoveFile, processingStatus }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('image')) return 'Image';
    return 'File';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return { icon: 'Loader2', className: 'text-warning animate-spin' };
      case 'processing':
        return { icon: 'Cog', className: 'text-primary animate-spin' };
      case 'success':
        return { icon: 'CheckCircle', className: 'text-success' };
      case 'error':
        return { icon: 'XCircle', className: 'text-error' };
      default:
        return { icon: 'Clock', className: 'text-muted-foreground' };
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Uploaded Files</h3>
      
      <div className="space-y-3">
        {files.map((file, index) => {
          const status = processingStatus[file.name] || 'pending';
          const statusInfo = getStatusIcon(status);
          
          return (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg"
            >
              {/* File Icon */}
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={getFileIcon(file.type)} size={20} className="text-muted-foreground" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <Icon 
                    name={statusInfo.icon} 
                    size={16} 
                    className={statusInfo.className}
                  />
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    status === 'success' ? 'bg-success/10 text-success' :
                    status === 'error' ? 'bg-error/10 text-error' :
                    status === 'processing' ? 'bg-primary/10 text-primary' :
                    status === 'uploading'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                  }`}>
                    {status === 'uploading' ? 'Uploading...' :
                     status === 'processing' ? 'Processing...' :
                     status === 'success' ? 'Processed' :
                     status === 'error'? 'Failed' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              {status !== 'processing' && status !== 'uploading' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
                  iconName="X"
                  iconSize={16}
                  className="text-muted-foreground hover:text-error"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilePreview;