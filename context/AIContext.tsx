import React, { createContext, useContext, useState, useEffect } from 'react';

type AIContextType = {
  isAIVisible: boolean;
  showAI: () => void;
  hideAI: () => void;
  aiSuggestion: string | null;
  setAISuggestion: (suggestion: string | null) => void;
  userPreferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
};

interface UserPreferences {
  preferredWorkoutTime: string;
  learningGoals: string[];
  currentFocus: 'career' | 'fitness' | 'passion' | 'skills';
  language: string;
  notifications: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isAIVisible, setIsAIVisible] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    preferredWorkoutTime: '7:00 AM',
    learningGoals: ['React Native', 'UI/UX Design', 'Fitness'],
    currentFocus: 'career',
    language: 'English',
    notifications: true,
  });

  const showAI = () => setIsAIVisible(true);
  const hideAI = () => setIsAIVisible(false);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  // Generate AI suggestions based on user activity
  useEffect(() => {
    const suggestions = [
      "Ready for your morning workout? Let's start with a 20-minute HIIT session.",
      "You're 75% through your React Native course. Want to tackle the next lesson?",
      "Time for a quick design challenge! Try creating a mobile app wireframe.",
      "Your weekly goal is almost complete. One more coding session should do it!",
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setAISuggestion(randomSuggestion);
  }, []);

  return (
    <AIContext.Provider value={{
      isAIVisible,
      showAI,
      hideAI,
      aiSuggestion,
      setAISuggestion,
      userPreferences,
      updatePreferences,
    }}>
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