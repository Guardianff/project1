import React, { createContext, useContext, useState, useCallback } from 'react';

interface AIContextType {
  isAIVisible: boolean;
  showAI: () => void;
  hideAI: () => void;
  toggleAI: () => void;
  aiSuggestion: string | null;
  setAISuggestion: (suggestion: string | null) => void;
  userPreferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

interface UserPreferences {
  preferredWorkoutTime: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  goals: string[];
  interests: string[];
  language: string;
  notifications: boolean;
}

const defaultPreferences: UserPreferences = {
  preferredWorkoutTime: '7:00 AM',
  learningStyle: 'visual',
  goals: [],
  interests: [],
  language: 'en',
  notifications: true,
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isAIVisible, setIsAIVisible] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);

  const showAI = useCallback(() => {
    setIsAIVisible(true);
  }, []);

  const hideAI = useCallback(() => {
    setIsAIVisible(false);
  }, []);

  const toggleAI = useCallback(() => {
    setIsAIVisible(prev => !prev);
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  const value: AIContextType = {
    isAIVisible,
    showAI,
    hideAI,
    toggleAI,
    aiSuggestion,
    setAISuggestion,
    userPreferences,
    updatePreferences,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}