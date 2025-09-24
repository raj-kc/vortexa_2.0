import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { VideoSummarizerModule } from './components/video-summarizer/VideoSummarizerModule';
import { QuizGeneratorModule } from './components/quiz-generator/QuizGeneratorModule';
import { Dashboard } from './components/dashboard/Dashboard';
import { AppProvider } from './context/AppContext';
import { useEnsureUser } from './hooks/useEnsureUser';
import { supabase } from './supabaseClient';
import AuthForm from './components/AuthForm';
import { signOut } from './api/auth';

function App() {
  const [activeModule, setActiveModule] = useState<'summarizer' | 'quiz' | 'dashboard'>('summarizer');
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEnsureUser();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => getUser());
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setActiveModule('summarizer');
    window.location.reload(); // Refresh the page after logout
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'summarizer':
        return <VideoSummarizerModule />;
      case 'quiz':
        return <QuizGeneratorModule />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <VideoSummarizerModule />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          user={user && user.email ? { email: user.email } : null}
          onAuthClick={() => setShowAuth(true)}
          onLogout={handleLogout}
        />
        <main className="transition-all duration-500 ease-in-out">
          {renderActiveModule()}
        </main>
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={() => setShowAuth(false)}
              >
                ×
              </button>
              <AuthForm />
            </div>
          </div>
        )}
      </div>
    </AppProvider>
  );
}

export default App;