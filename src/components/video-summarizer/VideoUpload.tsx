import React, { useState } from 'react';
import { Upload, Link, Play, FileVideo } from 'lucide-react';

interface VideoUploadProps {
  onVideoProcess: (videoData: { type: 'file' | 'youtube'; data: string | File }) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoProcess }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'youtube'>('upload');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      onVideoProcess({ type: 'file', data: file });
    }
  };

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeUrl.trim()) {
      onVideoProcess({ type: 'youtube', data: youtubeUrl });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-5 h-5 inline mr-2" />
            Upload Video File
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === 'youtube'
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-b-2 border-red-500'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Link className="w-5 h-5 inline mr-2" />
            YouTube URL
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'upload' ? (
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                  <FileVideo className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Drop your video here or click to browse
                  </p>
                  <p className="text-gray-500 mb-4">
                    Supports MP4, AVI, MOV, and other video formats
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Video File
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleYoutubeSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full w-fit mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Analyze YouTube Video
                </h3>
                <p className="text-gray-500">
                  Paste a YouTube URL to generate AI summaries
                </p>
              </div>

              <div className="space-y-4">
                <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700">
                  YouTube URL
                </label>
                <input
                  type="url"
                  id="youtube-url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg"
                />
                <button
                  type="submit"
                  disabled={!youtubeUrl.trim()}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  Process YouTube Video
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};