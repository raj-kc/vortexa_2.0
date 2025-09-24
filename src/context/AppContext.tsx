import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface VideoSummary {
  id: string;
  title: string;
  summaryType: 'short' | 'medium' | 'research';
  content: string;
  transcript: string;
  createdAt: Date;
}

interface QuizResult {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number;
  answers: QuizAnswer[];
  createdAt: Date;
}

interface QuizAnswer {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface AppState {
  videoSummaries: VideoSummary[];
  quizResults: QuizResult[];
  currentUser: {
    difficultyLevel: 'easy' | 'medium' | 'hard';
    streakCount: number;
  };
}

type AppAction = 
  | { type: 'ADD_VIDEO_SUMMARY'; payload: VideoSummary }
  | { type: 'ADD_QUIZ_RESULT'; payload: QuizResult }
  | { type: 'UPDATE_DIFFICULTY'; payload: 'easy' | 'medium' | 'hard' }
  | { type: 'UPDATE_STREAK'; payload: number };

const initialState: AppState = {
  videoSummaries: [],
  quizResults: [],
  currentUser: {
    difficultyLevel: 'medium',
    streakCount: 0
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_VIDEO_SUMMARY':
      return {
        ...state,
        videoSummaries: [...state.videoSummaries, action.payload]
      };
    case 'ADD_QUIZ_RESULT':
      return {
        ...state,
        quizResults: [...state.quizResults, action.payload]
      };
    case 'UPDATE_DIFFICULTY':
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          difficultyLevel: action.payload
        }
      };
    case 'UPDATE_STREAK':
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          streakCount: action.payload
        }
      };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};