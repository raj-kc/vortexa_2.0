import React, { useState, useEffect } from 'react';
import { VideoUpload } from './VideoUpload';
import { SummaryViewer } from './SummaryViewer';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { summarizeYouTube, summarizeLocalVideo, saveSummaryToSupabase } from '../../api/videoSummarizer';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabaseClient';

export const VideoSummarizerModule: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<{
    title: string;
    transcript: string;
    summaries: {
      short: string;
      medium: string;
      research: string;
    };
  } | null>(null);
  const { state } = useApp(); // To get userId if you store it in context
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID from Supabase Auth if not in context
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id ?? null);
    }
    fetchUser();
  }, []);

  const handleVideoProcess = async (videoData: { type: 'file' | 'youtube'; data: string | File }) => {
    setIsProcessing(true);

    let result;
    if (videoData.type === 'youtube') {
      result = await summarizeYouTube(videoData.data as string);
    } else {
      result = await summarizeLocalVideo(videoData.data as File);
    }

    console.log('Summarization result:', result); // Log the result for debugging

    // Save to Supabase
    await saveSummaryToSupabase({
      title: result.title,
      summaryType: videoData.type,
      content: result.summaries.short, // or medium/research as needed
      transcript: result.transcript,
      userId: userId, // Now userId is set
    });

    setSummary(result);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            AI Video Summarizer
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload your videos or paste YouTube URLs to get intelligent summaries with multiple detail levels. 
            Our AI extracts key insights and creates comprehensive summaries tailored to your needs.
          </p>
        </div>

        {!summary && !isProcessing && (
          <VideoUpload onVideoProcess={handleVideoProcess} />
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="lg" />
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Processing Your Video</h3>
            <div className="text-center text-gray-500 space-y-1">
              <p>• Extracting audio and generating transcript</p>
              <p>• Creating AI-powered summaries</p>
              <p>• Building interactive glossary</p>
            </div>
          </div>
        )}

        {summary && !isProcessing && (
          <SummaryViewer 
            summary={summary} 
            onStartOver={() => {
              setSummary(null);
              setIsProcessing(false);
            }}
          />
        )}
      </div>
    </div>
  );
};