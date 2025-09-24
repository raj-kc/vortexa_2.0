import React, { useState } from 'react';
import { Download, FileText, Calendar, Settings, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExportReports: React.FC = () => {
  const [reportType, setReportType] = useState<'performance' | 'summaries' | 'complete'>('complete');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const { state } = useApp();

  const generatePDFReport = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock PDF content generation
    let reportContent = '';
    
    if (reportType === 'performance' || reportType === 'complete') {
      const totalQuizzes = state.quizResults.length;
      const averageScore = totalQuizzes > 0 
        ? Math.round((state.quizResults.reduce((sum, result) => sum + (result.score / result.totalQuestions * 100), 0) / totalQuizzes))
        : 0;
      
      reportContent += `
PERFORMANCE REPORT
==================

Summary Statistics:
- Total Quizzes Completed: ${totalQuizzes}
- Average Score: ${averageScore}%
- Total Learning Time: ${Math.floor(state.quizResults.reduce((sum, result) => sum + result.timeSpent, 0) / 3600)}h

Quiz Results:
${state.quizResults.map(result => `
- ${result.title}: ${Math.round((result.score / result.totalQuestions) * 100)}% (${result.score}/${result.totalQuestions})
  Date: ${result.createdAt.toLocaleDateString()}
  Time: ${Math.floor(result.timeSpent / 60)}m ${result.timeSpent % 60}s
  Difficulty: ${result.difficulty}
`).join('')}
      `;
    }
    
    if (reportType === 'summaries' || reportType === 'complete') {
      reportContent += `
VIDEO SUMMARIES REPORT
======================

Total Summaries: ${state.videoSummaries.length}

Summary Details:
${state.videoSummaries.map(summary => `
- ${summary.title}
  Type: ${summary.summaryType}
  Date: ${summary.createdAt.toLocaleDateString()}
  Content Length: ${summary.content.length} characters
`).join('')}
      `;
    }
    
    if (reportType === 'complete') {
      reportContent += `
LEARNING INSIGHTS
=================

Strengths:
- ${state.quizResults.length > 0 && state.quizResults.reduce((sum, result) => sum + (result.score / result.totalQuestions * 100), 0) / state.quizResults.length >= 80 ? 'Consistently high performance' : 'Active participation in learning'}
- Regular engagement with content

Areas for Improvement:
- ${state.quizResults.length > 0 && state.quizResults.reduce((sum, result) => sum + (result.score / result.totalQuestions * 100), 0) / state.quizResults.length < 70 ? 'Focus on fundamental concepts' : 'Continue current learning approach'}

Recommendations:
- ${state.videoSummaries.length === 0 ? 'Try the video summarizer feature for enhanced learning' : 'Continue using video summaries effectively'}
- ${state.quizResults.every(r => r.difficulty === 'easy') && state.quizResults.length > 0 ? 'Challenge yourself with harder difficulty levels' : 'Maintain balanced difficulty progression'}
      `;
    }
    
    // Create a blob with the report content
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setGeneratedReport(url);
    setIsGenerating(false);
  };

  const downloadReport = () => {
    if (generatedReport) {
      const link = document.createElement('a');
      link.href = generatedReport;
      link.download = `learning-report-${reportType}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(generatedReport);
      setGeneratedReport(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-orange-100 rounded-xl">
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Export Reports</h3>
            <p className="text-gray-600">Generate detailed PDF reports of your learning progress</p>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Report Type */}
          <div className="space-y-4">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Settings className="w-4 h-4" />
              <span>Report Type</span>
            </label>
            <div className="space-y-3">
              {[
                { value: 'performance', label: 'Quiz Performance Only', desc: 'Scores, timing, and analytics' },
                { value: 'summaries', label: 'Video Summaries Only', desc: 'All saved video summaries' },
                { value: 'complete', label: 'Complete Report', desc: 'Everything + insights' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    reportType === option.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={option.value}
                    checked={reportType === option.value}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
                    reportType === option.value ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                  }`}>
                    {reportType === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm opacity-70 mt-1">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>Date Range</span>
            </label>
            <div className="space-y-3">
              {[
                { value: 'week', label: 'Last 7 Days', desc: 'Recent activity only' },
                { value: 'month', label: 'Last 30 Days', desc: 'Past month overview' },
                { value: 'all', label: 'All Time', desc: 'Complete history' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    dateRange === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="dateRange"
                    value={option.value}
                    checked={dateRange === option.value}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
                    dateRange === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {dateRange === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm opacity-70 mt-1">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Data Preview */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h4 className="font-medium text-gray-800 mb-4">Report Preview</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{state.quizResults.length} Quiz Results</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>{state.videoSummaries.length} Video Summaries</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              <span>Performance Analytics</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center space-y-4">
          {!generatedReport && (
            <button
              onClick={generatePDFReport}
              disabled={isGenerating || (state.quizResults.length === 0 && state.videoSummaries.length === 0)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Generate PDF Report
                </>
              )}
            </button>
          )}

          {generatedReport && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Report Generated Successfully!</span>
              </div>
              <button
                onClick={downloadReport}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Report
              </button>
            </div>
          )}

          {state.quizResults.length === 0 && state.videoSummaries.length === 0 && (
            <p className="text-sm text-gray-500">
              No data available for report generation. Complete some quizzes or create video summaries first.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};