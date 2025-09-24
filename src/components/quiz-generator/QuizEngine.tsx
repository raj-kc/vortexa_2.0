import React, { useState, useEffect } from 'react';
import { Clock, Flag, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { QuizQuestion, QuizConfig } from './QuizGeneratorModule';

interface QuizEngineProps {
  questions: QuizQuestion[];
  config: QuizConfig;
  onQuizComplete: (answers: Record<string, string>, timeSpent: number) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ questions, config, onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit * 60);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onQuizComplete(answers, timeSpent);
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
          
          <button
            onClick={() => handleFlag(question.id)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-all duration-200 ${
              flaggedQuestions.has(question.id)
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>{flaggedQuestions.has(question.id) ? 'Flagged' : 'Flag'}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {question.question}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {question.difficulty}
            </span>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.type === 'mcq' && question.options && (
            question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  answers[question.id] === option
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[question.id] === option ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                }`}>
                  {answers[question.id] === option && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </label>
            ))
          )}

          {question.type === 'true-false' && (
            ['True', 'False'].map(option => (
              <label
                key={option}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  answers[question.id] === option.toLowerCase()
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.toLowerCase()}
                  checked={answers[question.id] === option.toLowerCase()}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[question.id] === option.toLowerCase() ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                }`}>
                  {answers[question.id] === option.toLowerCase() && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </label>
            ))
          )}

          {(question.type === 'fill-blank' || question.type === 'short-answer') && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Enter your answer here..."
              rows={question.type === 'short-answer' ? 4 : 2}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-sm text-gray-500">
          {Object.keys(answers).length} of {questions.length} answered
        </div>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>Submit Quiz</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};