import React from 'react';
import { TrendingUp, Target, Clock, Award, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PerformanceCharts: React.FC = () => {
  const { state } = useApp();

  // Calculate statistics
  const totalQuizzes = state.quizResults.length;
  const totalSummaries = state.videoSummaries.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round((state.quizResults.reduce((sum, result) => sum + (result.score / result.totalQuestions * 100), 0) / totalQuizzes))
    : 0;
  const totalLearningTime = state.quizResults.reduce((sum, result) => sum + result.timeSpent, 0);
  const streak = state.currentUser.streakCount;

  // Mock performance data for charts
  const mockPerformanceData = [
    { date: '2024-01-01', score: 75 },
    { date: '2024-01-08', score: 82 },
    { date: '2024-01-15', score: 78 },
    { date: '2024-01-22', score: 89 },
    { date: '2024-01-29', score: 91 },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-700">{averageScore}%</span>
          </div>
          <h3 className="font-semibold text-blue-800">Average Score</h3>
          <p className="text-sm text-blue-600 mt-1">
            {totalQuizzes} quiz{totalQuizzes !== 1 ? 'zes' : ''} completed
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-500 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-teal-700">{totalSummaries}</span>
          </div>
          <h3 className="font-semibold text-teal-800">Video Summaries</h3>
          <p className="text-sm text-teal-600 mt-1">
            Total content analyzed
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-purple-700">
              {Math.floor(totalLearningTime / 3600)}h
            </span>
          </div>
          <h3 className="font-semibold text-purple-800">Learning Time</h3>
          <p className="text-sm text-purple-600 mt-1">
            Total time spent
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-orange-700">{streak}</span>
          </div>
          <h3 className="font-semibold text-orange-800">Current Streak</h3>
          <p className="text-sm text-orange-600 mt-1">
            Days of consistent learning
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Performance Trends
          </h3>
        </div>

        {totalQuizzes > 0 ? (
          <div className="space-y-6">
            {/* Simple Performance Visualization */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Recent Quiz Scores</h4>
              <div className="space-y-3">
                {state.quizResults.slice(-5).map((result, index) => {
                  const percentage = Math.round((result.score / result.totalQuestions) * 100);
                  return (
                    <div key={result.id} className="flex items-center space-x-4">
                      <div className="w-24 text-sm text-gray-600">
                        {result.createdAt.toLocaleDateString()}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              percentage >= 80 ? 'bg-green-500' :
                              percentage >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-sm font-medium text-gray-700">
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Quiz Difficulty Distribution</h4>
              <div className="grid grid-cols-3 gap-4">
                {['easy', 'medium', 'hard'].map(difficulty => {
                  const count = state.quizResults.filter(r => r.difficulty === difficulty).length;
                  const percentage = totalQuizzes > 0 ? (count / totalQuizzes * 100) : 0;
                  
                  return (
                    <div key={difficulty} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${
                        difficulty === 'easy' ? 'text-green-600' :
                        difficulty === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {count}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">{difficulty}</div>
                      <div className="text-xs text-gray-500">{percentage.toFixed(0)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No Performance Data Yet</h4>
            <p className="text-gray-500">
              Complete some quizzes to see your performance trends and analytics.
            </p>
          </div>
        )}
      </div>

      {/* Learning Insights */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Learning Insights</h3>
        
        {totalQuizzes > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-700 mb-4">Strengths</h4>
              <div className="space-y-2">
                {averageScore >= 80 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Consistently high performance</span>
                  </div>
                )}
                {totalSummaries > 0 && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Active in video analysis</span>
                  </div>
                )}
                {totalQuizzes >= 5 && (
                  <div className="flex items-center space-x-2 text-purple-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Regular quiz participation</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-4">Recommendations</h4>
              <div className="space-y-2">
                {averageScore < 70 && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Focus on fundamental concepts</span>
                  </div>
                )}
                {totalSummaries === 0 && (
                  <div className="flex items-center space-x-2 text-teal-600">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-sm">Try the video summarizer feature</span>
                  </div>
                )}
                {state.quizResults.every(r => r.difficulty === 'easy') && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Challenge yourself with harder quizzes</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Complete your first quiz to get personalized learning insights and recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};