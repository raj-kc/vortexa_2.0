import React from 'react';
import { Calendar, Clock, Target, Trophy, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuizHistoryList: React.FC = () => {
  const { state } = useApp();

  if (state.quizResults.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
        <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quiz Results Yet</h3>
        <p className="text-gray-500 mb-6">
          Take your first quiz in the Adaptive Quiz module to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quiz History</h3>
        <p className="text-gray-600 mb-6">
          {state.quizResults.length} quiz{state.quizResults.length !== 1 ? 'zes' : ''} completed
        </p>

        <div className="space-y-4">
          {state.quizResults.map((result) => {
            const percentage = Math.round((result.score / result.totalQuestions) * 100);
            const getPerformanceColor = (percentage: number) => {
              if (percentage >= 80) return 'text-green-600 bg-green-100';
              if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
              return 'text-red-600 bg-red-100';
            };

            return (
              <div
                key={result.id}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h4 className="font-semibold text-gray-800">{result.title}</h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(percentage)}`}>
                        {percentage}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-teal-500" />
                        <span>{result.score}/{result.totalQuestions}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${
                          result.difficulty === 'easy' ? 'bg-green-500' :
                          result.difficulty === 'medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <span className="capitalize">{result.difficulty}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>{result.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};