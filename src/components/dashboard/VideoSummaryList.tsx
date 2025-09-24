import React from 'react';
import { Calendar, FileText, Eye, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VideoSummaryList: React.FC = () => {
  const { state } = useApp();

  if (state.videoSummaries.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
        <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Video Summaries Yet</h3>
        <p className="text-gray-500 mb-6">
          Start by uploading a video or providing a YouTube URL in the Video Summarizer module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Video Summaries</h3>
        <p className="text-gray-600 mb-6">
          {state.videoSummaries.length} summary{state.videoSummaries.length !== 1 ? 'ies' : ''} saved
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {state.videoSummaries.map((summary) => (
            <div
              key={summary.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2">{summary.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{summary.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      summary.summaryType === 'short' ? 'bg-green-100 text-green-700' :
                      summary.summaryType === 'medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {summary.summaryType}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                {summary.content.substring(0, 200)}...
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Transcript: {summary.transcript.length} characters
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};