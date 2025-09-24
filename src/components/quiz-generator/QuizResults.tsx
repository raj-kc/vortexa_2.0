import React from 'react';
import { Trophy, Clock, Target, BookOpen, Download, RotateCcw, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuizResultsProps {
  results: {
    score: number;
    totalQuestions: number;
    timeSpent: number;
    detailedResults: Array<{
      question: any;
      userAnswer: string;
      isCorrect: boolean;
      timeSpent: number;
    }>;
  };
  onStartOver: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ results, onStartOver }) => {
  const { dispatch } = useApp();
  const percentage = Math.round((results.score / results.totalQuestions) * 100);
  
  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-green-600';
    if (percentage >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getPerformanceText = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Great';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const handleSaveResults = () => {
    const quizResult = {
      id: Date.now().toString(),
      title: 'Quiz Results',
      score: results.score,
      totalQuestions: results.totalQuestions,
      difficulty: 'medium' as const,
      timeSpent: results.timeSpent,
      answers: results.detailedResults.map(r => ({
        questionId: r.question.id,
        question: r.question.question,
        userAnswer: r.userAnswer,
        correctAnswer: r.question.correctAnswer,
        isCorrect: r.isCorrect,
        timeSpent: r.timeSpent
      })),
      createdAt: new Date()
    };
    
    dispatch({ type: 'ADD_QUIZ_RESULT', payload: quizResult });
    alert('Quiz results saved to your dashboard!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overall Results */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${getPerformanceColor(percentage)} rounded-full mb-4`}>
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-lg text-gray-600">
            {getPerformanceText(percentage)} - You scored {percentage}%
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{results.score}</div>
            <div className="text-sm text-blue-600">Correct Answers</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl">
            <BookOpen className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-teal-700">{results.totalQuestions}</div>
            <div className="text-sm text-teal-600">Total Questions</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{Math.floor(results.timeSpent / 60)}m</div>
            <div className="text-sm text-purple-600">Time Taken</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">{percentage}%</div>
            <div className="text-sm text-orange-600">Accuracy</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleSaveResults}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Save Results</span>
          </button>
          
          <button
            onClick={onStartOver}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Take Another Quiz</span>
          </button>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Detailed Results</h3>
        
        <div className="space-y-4">
          {results.detailedResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-l-4 ${
                result.isCorrect 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 mb-2">
                    {index + 1}. {result.question.question}
                  </p>
                  
                  <div className="space-y-1 text-sm">
                    <div className={`${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      <strong>Your Answer:</strong> {result.userAnswer || 'No answer'}
                    </div>
                    
                    {!result.isCorrect && (
                      <div className="text-green-700">
                        <strong>Correct Answer:</strong> {result.question.correctAnswer}
                      </div>
                    )}
                    
                    <div className="text-gray-600">
                      <strong>Explanation:</strong> {result.question.explanation}
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    result.isCorrect 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.timeSpent}s
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Strengths</h4>
            <div className="space-y-2">
              {percentage >= 80 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Excellent overall performance</span>
                </div>
              )}
              {results.detailedResults.filter(r => r.isCorrect && r.timeSpent <= 30).length > 0 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Quick and accurate responses</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Areas for Improvement</h4>
            <div className="space-y-2">
              {percentage < 70 && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Focus on fundamental concepts</span>
                </div>
              )}
              {results.detailedResults.some(r => r.timeSpent > 60) && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Work on response speed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};