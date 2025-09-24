import React, { useState } from 'react';
import { Brain, FileText, User, Settings, Play, Zap } from 'lucide-react';
import { QuizConfig, QuizQuestion } from './QuizGeneratorModule';
import { useApp } from '../../context/AppContext';

interface QuizSetupProps {
  onQuizStart: (config: QuizConfig, questions: QuizQuestion[]) => void;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({ onQuizStart }) => {
  const [source, setSource] = useState<'video-summary' | 'custom-topic' | 'manual'>('custom-topic');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);
  
  const { state } = useApp();

  const generateQuestions = (config: QuizConfig): QuizQuestion[] => {
    // Mock AI-generated questions based on the config
    const mockQuestions: QuizQuestion[] = [
      {
        id: '1',
        type: 'mcq',
        question: 'What is the primary purpose of machine learning algorithms?',
        options: ['Data storage', 'Pattern recognition and prediction', 'File compression', 'Network security'],
        correctAnswer: 'Pattern recognition and prediction',
        explanation: 'Machine learning algorithms are designed to identify patterns in data and make predictions or decisions based on those patterns.',
        difficulty: config.difficulty
      },
      {
        id: '2',
        type: 'true-false',
        question: 'Neural networks are inspired by the structure of the human brain.',
        correctAnswer: 'true',
        explanation: 'Neural networks are indeed modeled after the biological neural networks found in animal brains, particularly the interconnected structure of neurons.',
        difficulty: config.difficulty
      },
      {
        id: '3',
        type: 'mcq',
        question: 'Which of the following is NOT a type of machine learning?',
        options: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Static learning'],
        correctAnswer: 'Static learning',
        explanation: 'Static learning is not a recognized type of machine learning. The main types are supervised, unsupervised, and reinforcement learning.',
        difficulty: config.difficulty
      },
      {
        id: '4',
        type: 'fill-blank',
        question: 'Deep learning is a subset of _____ learning that uses multiple layers in neural networks.',
        correctAnswer: 'machine',
        explanation: 'Deep learning is a specialized area of machine learning that uses neural networks with multiple hidden layers.',
        difficulty: config.difficulty
      },
      {
        id: '5',
        type: 'short-answer',
        question: 'Explain the difference between supervised and unsupervised learning.',
        correctAnswer: 'Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data.',
        explanation: 'Supervised learning requires input-output pairs for training, while unsupervised learning discovers hidden patterns without labeled examples.',
        difficulty: config.difficulty
      }
    ];

    return mockQuestions.slice(0, config.questionCount);
  };

  const handleStartQuiz = () => {
    if (!topic.trim() && source === 'custom-topic') {
      alert('Please enter a topic for the quiz');
      return;
    }

    const config: QuizConfig = {
      source,
      topic: topic || 'General Knowledge',
      difficulty,
      questionCount,
      timeLimit
    };

    const questions = generateQuestions(config);
    onQuizStart(config, questions);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-8">
          {/* Quiz Source Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-teal-600" />
              Quiz Source
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSource('video-summary')}
                disabled={state.videoSummaries.length === 0}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  source === 'video-summary'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : state.videoSummaries.length === 0
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">From Video Summary</p>
                <p className="text-sm opacity-70 mt-1">
                  {state.videoSummaries.length === 0 ? 'No summaries available' : `${state.videoSummaries.length} summaries`}
                </p>
              </button>

              <button
                onClick={() => setSource('custom-topic')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  source === 'custom-topic'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Custom Topic</p>
                <p className="text-sm opacity-70 mt-1">Enter any topic</p>
              </button>

              <button
                onClick={() => setSource('manual')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  source === 'manual'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <User className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Manual Creation</p>
                <p className="text-sm opacity-70 mt-1">Create your own</p>
              </button>
            </div>
          </div>

          {/* Topic Input */}
          {source === 'custom-topic' && (
            <div className="mb-6">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Topic
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Artificial Intelligence, Machine Learning, Data Science..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {/* Video Summary Selection */}
          {source === 'video-summary' && state.videoSummaries.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Video Summary
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a summary...</option>
                {state.videoSummaries.map(summary => (
                  <option key={summary.id} value={summary.title}>
                    {summary.title} ({summary.summaryType})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quiz Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Settings className="w-4 h-4 inline mr-1" />
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Start Quiz Button */}
          <div className="text-center">
            <button
              onClick={handleStartQuiz}
              disabled={source === 'custom-topic' && !topic.trim()}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
            >
              <Play className="w-5 h-5 mr-2" />
              Generate and Start Quiz
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Anti-cheating measures will be active during the quiz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};