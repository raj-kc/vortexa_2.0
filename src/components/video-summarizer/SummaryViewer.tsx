import React, { useState } from 'react';
import { FileText, BookOpen, Search, RotateCcw, Download } from 'lucide-react';
import { GlossaryPopup } from './GlossaryPopup';
import { useApp } from '../../context/AppContext';

interface SummaryViewerProps {
  summary: {
    title: string;
    transcript: string;
    summaries: {
      short: string;
      medium: string;
      research: string;
    };
  };
  onStartOver: () => void;
}

export const SummaryViewer: React.FC<SummaryViewerProps> = ({ summary, onStartOver }) => {
  const [activeView, setActiveView] = useState<'short' | 'medium' | 'research'>('medium');
  const [showTranscript, setShowTranscript] = useState(false);
  const [glossaryData, setGlossaryData] = useState<{
    term: string;
    definition: string;
    position: { x: number; y: number };
    visible: boolean;
  }>({
    term: '',
    definition: '',
    position: { x: 0, y: 0 },
    visible: false
  });

  const { dispatch } = useApp();

  const viewOptions = [
    { key: 'short', label: 'Short Summary', icon: FileText, color: 'from-green-500 to-green-600' },
    { key: 'medium', label: 'Medium Detail', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { key: 'research', label: 'Research Level', icon: Search, color: 'from-purple-500 to-purple-600' }
  ];

  const handleTextSelection = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const selectedText = selection.toString().trim();
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      
      // Mock AI-powered definition
      const mockDefinition = `${selectedText}: An important concept in artificial intelligence and machine learning, referring to advanced computational methods used for pattern recognition and decision-making processes.`;
      
      setGlossaryData({
        term: selectedText,
        definition: mockDefinition,
        position: { x: rect.left, y: rect.bottom + window.scrollY },
        visible: true
      });
    }
  };

  const handleSaveSummary = () => {
    const videoSummary = {
      id: Date.now().toString(),
      title: summary.title,
      summaryType: activeView,
      content: summary.summaries[activeView],
      transcript: summary.transcript,
      createdAt: new Date()
    };
    
    dispatch({ type: 'ADD_VIDEO_SUMMARY', payload: videoSummary });
    alert('Summary saved to your dashboard!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{summary.title}</h2>
            <p className="text-gray-600">AI-powered analysis complete</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showTranscript 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showTranscript ? 'Hide' : 'Show'} Transcript
            </button>
            <button
              onClick={handleSaveSummary}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Save Summary
            </button>
            <button
              onClick={onStartOver}
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Start Over
            </button>
          </div>
        </div>
      </div>

      {/* Summary View Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-1">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.key}
                onClick={() => setActiveView(option.key as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeView === option.key
                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              {viewOptions.find(v => v.key === activeView)?.icon && 
                React.createElement(viewOptions.find(v => v.key === activeView)!.icon, { className: "w-5 h-5 mr-2" })
              }
              {viewOptions.find(v => v.key === activeView)?.label}
            </h3>
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed cursor-text select-text"
              onMouseUp={handleTextSelection}
              dangerouslySetInnerHTML={{ 
                __html: summary.summaries[activeView].replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
              }}
            />
          </div>
        </div>

        {/* Transcript Panel */}
        <div className="lg:col-span-1">
          {showTranscript && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-fit sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Video Transcript</h3>
              <div className="max-h-96 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-3">
                {summary.transcript.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Glossary Popup */}
      <GlossaryPopup
        visible={glossaryData.visible}
        term={glossaryData.term}
        definition={glossaryData.definition}
        position={glossaryData.position}
        onClose={() => setGlossaryData(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
};