import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AIContextType {
  isAIVisible: boolean;
  showAI: () => void;
  hideAI: () => void;
  toggleAI: () => void;
  aiSuggestion: string | null;
  setAISuggestion: (suggestion: string | null) => void;
  userPreferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  aiFeatures: AIFeatures;
  updateAIFeatures: (features: Partial<AIFeatures>) => void;
  conversationHistory: ConversationEntry[];
  addConversationEntry: (entry: ConversationEntry) => void;
  clearConversationHistory: () => void;
}

interface UserPreferences {
  preferredWorkoutTime: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  goals: string[];
  interests: string[];
  language: string;
  notifications: boolean;
  currentFocus: string;
  learningGoals: string[];
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
}

interface AIFeatures {
  naturalLanguageProcessing: boolean;
  voiceRecognition: boolean;
  taskAutomation: boolean;
  smartSearch: boolean;
  progressAnalytics: boolean;
  personalization: boolean;
  multiLanguageSupport: boolean;
  contextAwareness: boolean;
  predictiveText: boolean;
  smartNotifications: boolean;
}

interface ConversationEntry {
  id: string;
  timestamp: Date;
  userInput: string;
  aiResponse: string;
  context: string;
  actionTaken?: string;
}

const defaultPreferences: UserPreferences = {
  preferredWorkoutTime: '7:00 AM',
  learningStyle: 'visual',
  goals: ['Learn React Native', 'Improve Fitness', 'Career Growth'],
  interests: ['Technology', 'Health', 'Design'],
  language: 'en',
  notifications: true,
  currentFocus: 'development',
  learningGoals: ['Master React Native', 'Learn UI/UX Design'],
  timezone: 'UTC',
  workingHours: {
    start: '9:00 AM',
    end: '5:00 PM',
  },
};

const defaultAIFeatures: AIFeatures = {
  naturalLanguageProcessing: true,
  voiceRecognition: true,
  taskAutomation: true,
  smartSearch: true,
  progressAnalytics: true,
  personalization: true,
  multiLanguageSupport: true,
  contextAwareness: true,
  predictiveText: true,
  smartNotifications: true,
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isAIVisible, setIsAIVisible] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const [aiFeatures, setAIFeatures] = useState<AIFeatures>(defaultAIFeatures);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);

  // Initialize AI suggestions based on time and user preferences
  useEffect(() => {
    const generateTimedSuggestions = () => {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour >= 7 && hour <= 9 && userPreferences.preferredWorkoutTime.includes('7:00')) {
        setAISuggestion("Perfect time for your morning workout! Ready to start your fitness routine?");
      } else if (hour >= 9 && hour <= 11) {
        setAISuggestion("Great time to tackle that React Native lesson you've been working on!");
      } else if (hour >= 14 && hour <= 16) {
        setAISuggestion("Afternoon energy boost! How about a quick skill-building session?");
      } else if (hour >= 19 && hour <= 21) {
        setAISuggestion("Evening reflection time. Want to review your daily progress?");
      }
    };

    generateTimedSuggestions();
    const interval = setInterval(generateTimedSuggestions, 3600000); // Check every hour

    return () => clearInterval(interval);
  }, [userPreferences.preferredWorkoutTime]);

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

  const updateAIFeatures = useCallback((newFeatures: Partial<AIFeatures>) => {
    setAIFeatures(prev => ({ ...prev, ...newFeatures }));
  }, []);

  const addConversationEntry = useCallback((entry: ConversationEntry) => {
    setConversationHistory(prev => [...prev, entry]);
  }, []);

  const clearConversationHistory = useCallback(() => {
    setConversationHistory([]);
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
    aiFeatures,
    updateAIFeatures,
    conversationHistory,
    addConversationEntry,
    clearConversationHistory,
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