import React, { useState } from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReceiptImageViewer = ({ receipt }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [annotations, setAnnotations] = useState([]);
  const [isAnnotating, setIsAnnotating] = useState(false);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleResetView = () => {
    setZoom(100);
    setRotation(0);
  };

  const handleImageClick = (e) => {
    if (!isAnnotating) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newAnnotation = {
      id: Date.now(),
      x,
      y,
      note: `Annotation ${annotations.length + 1}`
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const removeAnnotation = (id) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Receipt Image</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {zoom}%
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                iconName="ZoomOut"
                iconSize={16}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 300}
                iconName="ZoomIn"
                iconSize={16}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                iconName="RotateCw"
                iconSize={16}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetView}
                iconName="RotateCcw"
                iconSize={16}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={isAnnotating ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAnnotating(!isAnnotating)}
              iconName="Edit3"
              iconPosition="left"
              iconSize={16}
            >
              {isAnnotating ? 'Stop Annotating' : 'Add Annotations'}
            </Button>
            {annotations.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnnotations([])}
                iconName="Trash2"
                iconSize={16}
              />
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 p-4 overflow-auto bg-muted/20">
        <div className="flex items-center justify-center min-h-full">
          <div 
            className="relative inline-block cursor-pointer"
            onClick={handleImageClick}
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
          >
            <Image
              src={receipt.imageUrl}
              alt="Payment Receipt"
              className="max-w-full max-h-full shadow-lg rounded-lg"
            />
            
            {/* Annotations */}
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute w-4 h-4 bg-error rounded-full border-2 border-white shadow-lg cursor-pointer group"
                style={{
                  left: `${annotation.x}%`,
                  top: `${annotation.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeAnnotation(annotation.id);
                }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {annotation.note}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-4 border-t border-border bg-muted/10">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">File Size:</span>
            <span className="ml-2 text-foreground">{receipt.fileSize}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Format:</span>
            <span className="ml-2 text-foreground">{receipt.format}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Dimensions:</span>
            <span className="ml-2 text-foreground">{receipt.dimensions}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Upload Time:</span>
            <span className="ml-2 text-foreground">{receipt.uploadTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptImageViewer;