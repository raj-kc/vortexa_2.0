import { Sparkles, Video, Brain, BarChart3, LogIn, LogOut } from 'lucide-react';

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
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    color: 'from-purple-500 to-pink-500',
    show: (user: any) => !!user,
  },
];

export function Navigation({ activeModule, setActiveModule, user, onAuthClick, onLogout }: NavigationProps) {
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
          <div className="flex space-x-1">
            {navItems
              .filter(item => item.show(user))
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
            {/* Auth Buttons */}
            {user ? (
              <>
                <span className="ml-4 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-xs hidden sm:inline-block">
                  {user.email}
                </span>
                <button
                  className="ml-2 flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 font-semibold hover:from-gray-300 hover:to-gray-400 transition text-sm"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
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