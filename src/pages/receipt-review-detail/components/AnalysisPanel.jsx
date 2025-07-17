import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const AnalysisPanel = ({ receipt }) => {
  const [activeTab, setActiveTab] = useState('ocr');

  const tabs = [
    { id: 'ocr', label: 'OCR Results', icon: 'FileText' },
    { id: 'comparison', label: 'Code Comparison', icon: 'GitCompare' },
    { id: 'ai-analysis', label: 'AI Analysis', icon: 'Brain' },
    { id: 'flags', label: 'Flags & Issues', icon: 'AlertTriangle' }
  ];

  const renderOCRResults = () => (
    <div className="space-y-4">
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Extracted Text</h4>
        <div className="bg-background rounded border p-3 font-mono text-sm">
          <pre className="whitespace-pre-wrap text-foreground">
            {receipt.ocrResults.extractedText}
          </pre>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Confidence Score</h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-background rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all"
                style={{ width: `${receipt.ocrResults.confidence}%` }}
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {receipt.ocrResults.confidence}%
            </span>
          </div>
        </div>
        
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Processing Time</h4>
          <p className="text-foreground">{receipt.ocrResults.processingTime}</p>
        </div>
      </div>
    </div>
  );

  const renderCodeComparison = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="Hash" size={16} className="mr-2" />
            Generated Code
          </h4>
          <div className="bg-background rounded border p-3 font-mono text-lg font-bold text-primary">
            {receipt.generatedCode}
          </div>
        </div>
        
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="Scan" size={16} className="mr-2" />
            Extracted Code
          </h4>
          <div className="bg-background rounded border p-3 font-mono text-lg font-bold text-secondary">
            {receipt.extractedCode}
          </div>
        </div>
      </div>
      
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Comparison Result</h4>
        <div className={`flex items-center space-x-2 p-3 rounded-lg ${
          receipt.codeMatch ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
        }`}>
          <Icon 
            name={receipt.codeMatch ? "CheckCircle" : "XCircle"} 
            size={20} 
          />
          <span className="font-medium">
            {receipt.codeMatch ? 'Codes Match' : 'Codes Do Not Match'}
          </span>
        </div>
        
        {!receipt.codeMatch && (
          <div className="mt-3 p-3 bg-error/5 rounded-lg border border-error/20">
            <h5 className="font-medium text-error mb-2">Differences Found:</h5>
            <ul className="text-sm text-error space-y-1">
              {receipt.codeDifferences.map((diff, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="AlertCircle" size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderAIAnalysis = () => (
    <div className="space-y-4">
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Overall Assessment</h4>
        <div className={`p-3 rounded-lg ${
          receipt.aiAnalysis.overallScore >= 80 
            ? 'bg-success/10 text-success' 
            : receipt.aiAnalysis.overallScore >= 60
            ? 'bg-warning/10 text-warning' :'bg-error/10 text-error'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Authenticity Score</span>
            <span className="text-lg font-bold">{receipt.aiAnalysis.overallScore}%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {receipt.aiAnalysis.factors.map((factor, index) => (
          <div key={index} className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-foreground">{factor.name}</h5>
              <span className={`text-sm font-medium ${
                factor.score >= 80 ? 'text-success' : 
                factor.score >= 60 ? 'text-warning' : 'text-error'
              }`}>
                {factor.score}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFlags = () => (
    <div className="space-y-4">
      {receipt.flags.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-4" />
          <h4 className="font-medium text-foreground mb-2">No Issues Found</h4>
          <p className="text-muted-foreground">This receipt passed all automated checks.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {receipt.flags.map((flag, index) => (
            <div key={index} className={`rounded-lg p-4 border ${
              flag.severity === 'high' ?'bg-error/5 border-error/20' 
                : flag.severity === 'medium' ?'bg-warning/5 border-warning/20' :'bg-muted/20 border-border'
            }`}>
              <div className="flex items-start space-x-3">
                <Icon 
                  name={
                    flag.severity === 'high' ? 'AlertTriangle' :
                    flag.severity === 'medium' ? 'AlertCircle' : 'Info'
                  }
                  size={20}
                  className={
                    flag.severity === 'high' ? 'text-error' :
                    flag.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'
                  }
                />
                <div className="flex-1">
                  <h5 className="font-medium text-foreground mb-1">{flag.title}</h5>
                  <p className="text-sm text-muted-foreground mb-2">{flag.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Severity: {flag.severity.toUpperCase()}</span>
                    <span>Detected: {flag.detectedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ocr':
        return renderOCRResults();
      case 'comparison':
        return renderCodeComparison();
      case 'ai-analysis':
        return renderAIAnalysis();
      case 'flags':
        return renderFlags();
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalysisPanel;