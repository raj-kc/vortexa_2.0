import React, { useState } from 'react';
import { QuizSetup } from './QuizSetup';
import { QuizEngine } from './QuizEngine';
import { QuizResults } from './QuizResults';
import { AntiCheatWrapper } from './AntiCheatWrapper';

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'fill-blank' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizConfig {
  source: 'video-summary' | 'custom-topic' | 'manual';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timeLimit: number;
}

export const QuizGeneratorModule: React.FC = () => {
  const [quizState, setQuizState] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<{
    score: number;
    totalQuestions: number;
    timeSpent: number;
    detailedResults: Array<{
      question: QuizQuestion;
      userAnswer: string;
      isCorrect: boolean;
      timeSpent: number;
    }>;
  } | null>(null);

  const handleQuizSetup = (config: QuizConfig, generatedQuestions: QuizQuestion[]) => {
    setQuizConfig(config);
    setQuestions(generatedQuestions);
    setQuizState('quiz');
  };

  const handleQuizComplete = (answers: Record<string, string>, timeSpent: number) => {
    setUserAnswers(answers);
    
    // Calculate results
    const detailedResults = questions.map(question => ({
      question,
      userAnswer: answers[question.id] || '',
      isCorrect: answers[question.id] === question.correctAnswer,
      timeSpent: Math.floor(Math.random() * 30) + 10 // Mock time per question
    }));
    
    const score = detailedResults.filter(result => result.isCorrect).length;
    
    setQuizResults({
      score,
      totalQuestions: questions.length,
      timeSpent,
      detailedResults
    });
    
    setQuizState('results');
  };

  const handleStartOver = () => {
    setQuizState('setup');
    setQuizConfig(null);
    setQuestions([]);
    setUserAnswers({});
    setQuizResults(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-4">
            AI Adaptive Quiz Generator
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate intelligent quizzes that adapt to your performance. Our AI creates questions from video summaries 
            or custom topics, with built-in anti-cheating measures and detailed performance analytics.
          </p>
        </div>

        {quizState === 'setup' && <QuizSetup onQuizStart={handleQuizSetup} />}
        
        {quizState === 'quiz' && quizConfig && (
          <AntiCheatWrapper onViolation={() => alert('Anti-cheat violation detected!')}>
            <QuizEngine 
              questions={questions}
              config={quizConfig}
              onQuizComplete={handleQuizComplete}
            />
          </AntiCheatWrapper>
        )}
        
        {quizState === 'results' && quizResults && (
          <QuizResults 
            results={quizResults}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  );
};