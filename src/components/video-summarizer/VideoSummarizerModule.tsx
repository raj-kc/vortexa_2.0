import React, { useState } from 'react';
import { VideoUpload } from './VideoUpload';
import { SummaryViewer } from './SummaryViewer';
import { LoadingSpinner } from '../ui/LoadingSpinner';

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

  const handleVideoProcess = async (videoData: { type: 'file' | 'youtube'; data: string | File }) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI-generated content
    const mockSummary = {
      title: videoData.type === 'youtube' ? 'YouTube Video Analysis' : 'Uploaded Video Analysis',
      transcript: `This is a comprehensive transcript of the video content. The speaker discusses various important concepts related to artificial intelligence, machine learning, and their applications in modern technology. The content covers fundamental principles, practical implementations, and future possibilities in the field.

Key points discussed include:
- Introduction to AI fundamentals
- Machine learning algorithms and their applications  
- Neural networks and deep learning concepts
- Real-world use cases and implementations
- Future trends and developments
- Ethical considerations in AI development`,
      summaries: {
        short: `• AI fundamentals and core concepts
• Machine learning algorithms overview
• Neural networks introduction
• Practical applications in technology
• Future trends and ethical considerations`,
        medium: `This video provides a comprehensive overview of artificial intelligence and machine learning technologies. The presenter begins with fundamental AI concepts, explaining how machines can be trained to recognize patterns and make decisions.

The discussion covers various machine learning algorithms, including supervised and unsupervised learning approaches. Neural networks are introduced as powerful tools for complex pattern recognition, with examples of their use in image recognition and natural language processing.

Practical applications are highlighted across industries, from healthcare diagnostics to autonomous vehicles. The video concludes with thoughts on future developments and the importance of ethical AI development.`,
        research: `This comprehensive analysis explores the current state and future prospects of artificial intelligence and machine learning technologies. The content provides an in-depth examination of fundamental concepts, methodologies, and applications.

**Fundamental Concepts:**
The video establishes a strong foundation in AI principles, covering the evolution from rule-based systems to modern machine learning approaches. Key concepts include pattern recognition, decision-making algorithms, and the role of data in training intelligent systems.

**Technical Deep Dive:**
Machine learning algorithms are categorized into supervised, unsupervised, and reinforcement learning paradigms. Supervised learning techniques such as linear regression, decision trees, and support vector machines are discussed with their respective strengths and limitations.

Neural networks receive particular attention, with explanations of perceptrons, multi-layer networks, and deep learning architectures. The discussion includes convolutional neural networks for image processing and recurrent neural networks for sequential data analysis.

**Industry Applications:**
Real-world implementations span multiple sectors:
- Healthcare: Diagnostic imaging and drug discovery
- Finance: Fraud detection and algorithmic trading
- Transportation: Autonomous vehicles and route optimization
- Technology: Natural language processing and recommendation systems

**Future Considerations:**
The analysis concludes with forward-looking perspectives on AI development, including quantum computing integration, explainable AI, and the critical importance of ethical frameworks in AI deployment.

**Related Resources:**
- "Deep Learning" by Ian Goodfellow
- "Pattern Recognition and Machine Learning" by Christopher Bishop
- Stanford CS229 Machine Learning Course
- MIT 6.034 Artificial Intelligence Course`
      }
    };
    
    setSummary(mockSummary);
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