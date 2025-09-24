import { Sparkles, Video, Brain, BarChart3, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type NavigationProps = {
  activeModule: 'summarizer' | 'quiz' | 'dashboard';
  setActiveModule: (module: 'summarizer' | 'quiz' | 'dashboard') => void;
  user: { email: string } | null;
  onAuthClick: () => void;
  onLogout: () => void;
};

const navItems = [
  {
    id: 'summarizer',
    label: 'Video Summarizer',
    icon: Video,
    color: 'from-blue-500 to-indigo-500',
    show: () => true,
  },
  {
    id: 'quiz',
    label: 'Adaptive Quiz',
    icon: Brain,
    color: 'from-teal-500 to-teal-600',
    show: () => true,
  },
  // Dashboard removed from main navItems
];

const topics = ['Math', 'Science', 'History', 'English'];
const difficulties = ['Easy', 'Medium', 'Hard'];

function generateQuestions(topic: string, difficulty: string, count: number) {
  // Replace with real question generation logic or API call
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    question: `Sample ${topic} question ${i + 1} (${difficulty})`,
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
  }));
}

type QuizSetupProps = {
  onStartQuiz: (questions: any[]) => void;
};

export const QuizSetup = ({ onStartQuiz }: QuizSetupProps) => {
  const [topic, setTopic] = useState(topics[0]);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [count, setCount] = useState(10);

  const handleStart = () => {
    const questions = generateQuestions(topic, difficulty, count);
    onStartQuiz(questions);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Customize Your Quiz</h2>
      <div className="mb-3">
        <label>Topic:</label>
        <select value={topic} onChange={e => setTopic(e.target.value)} className="ml-2">
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label>Difficulty:</label>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="ml-2">
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label>Number of Questions:</label>
        <input
          type="number"
          min={10}
          max={20}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="ml-2 w-16"
        />
      </div>
      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        onClick={handleStart}
      >
        Start Quiz
      </button>
    </div>
  );
};

export function Navigation({ activeModule, setActiveModule, user, onAuthClick, onLogout }: NavigationProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Learning Suite
              </h1>
              <p className="text-xs text-gray-500">Smart Learning & Assessment</p>
            </div>
          </div>
          {/* Navigation Buttons */}
          <div className="flex space-x-1 items-center">
            {navItems
              .filter(item => item.show())
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id as any)}
                    className={`
                      relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm
                      transition-all duration-300 hover:scale-105
                      ${isActive 
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-500/25` 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:block">{item.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-75"></div>
                    )}
                  </button>
                );
              })}
            {/* Profile Dropdown */}
            {user ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:scale-105 transition"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <UserCircle className="w-7 h-7" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 text-sm text-gray-700 font-semibold">
                      {user.email}
                    </div>
                    <button
                      className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition text-sm`}
                      onClick={() => { setActiveModule('dashboard'); setDropdownOpen(false); }}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" /> Dashboard
                    </button>
                    <button
                      className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 transition text-sm"
                      onClick={() => { onLogout(); setDropdownOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="flex items-center px-4 py-2 rounded-xl bg-white text-indigo-600 font-semibold shadow transition text-sm hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 hover:text-white"
                onClick={onAuthClick}
              >
                <LogIn className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}