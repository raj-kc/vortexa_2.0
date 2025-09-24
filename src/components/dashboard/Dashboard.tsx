import React, { useState } from 'react';
import { VideoSummaryList } from './VideoSummaryList';
import { QuizHistoryList } from './QuizHistoryList';
import { PerformanceCharts } from './PerformanceCharts';
import { ExportReports } from './ExportReports';
import { Video, Brain, TrendingUp, Download } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summaries' | 'quizzes' | 'analytics' | 'reports'>('analytics');

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { id: 'summaries', label: 'Video Summaries', icon: Video, color: 'from-purple-500 to-purple-600' },
    { id: 'quizzes', label: 'Quiz History', icon: Brain, color: 'from-teal-500 to-teal-600' },
    { id: 'reports', label: 'Reports', icon: Download, color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-4">
            Learning Dashboard
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Track your learning progress, review past summaries and quiz results, and get insights 
            into your performance with detailed analytics and exportable reports.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'analytics' && <PerformanceCharts />}
          {activeTab === 'summaries' && <VideoSummaryList />}
          {activeTab === 'quizzes' && <QuizHistoryList />}
          {activeTab === 'reports' && <ExportReports />}
        </div>
      </div>
    </div>
  );
};