import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFilesSelected, isUploading, uploadProgress }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelected(files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : isUploading
            ? 'border-warning bg-warning/5' :'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          {/* Upload Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isDragOver
              ? 'bg-primary text-primary-foreground'
              : isUploading
              ? 'bg-warning text-warning-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
            <Icon 
              name={isUploading ? "Loader2" : "Upload"} 
              size={32} 
              className={isUploading ? "animate-spin" : ""}
            />
          </div>

          {/* Upload Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isUploading ? 'Uploading Files...' : 'Upload Receipt'}
            </h3>
            <p className="text-muted-foreground">
              {isDragOver
                ? 'Drop your files here' :'Drag & drop your receipt files here, or click to browse'
              }
            </p>
          </div>

          {/* Browse Button */}
          {!isUploading && (
            <Button
              variant="outline"
              onClick={handleBrowseClick}
              iconName="FolderOpen"
              iconPosition="left"
              iconSize={16}
            >
              Browse Files
            </Button>
          )}

          {/* Upload Progress */}
          {isUploading && uploadProgress > 0 && (
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="text-foreground font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Supported Formats */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported formats: JPG, PNG, PDF</p>
            <p>Maximum file size: 10MB per file</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;