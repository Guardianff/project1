import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openAIService } from '@/services/OpenAIService';

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
  isAIGenerating: boolean;
  generateAIResponse: (userInput: string) => Promise<string>;
  appendToLastAIResponse: (content: string) => void;
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
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  // Load conversation history from storage on mount
  useEffect(() => {
    const loadConversationHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('conversationHistory');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          // Convert string dates back to Date objects
          const historyWithDates = parsedHistory.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }));
          setConversationHistory(historyWithDates);
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    };

    loadConversationHistory();
  }, []);

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

  // Save conversation history when it changes
  useEffect(() => {
    const saveConversationHistory = async () => {
      try {
        await AsyncStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
      } catch (error) {
        console.error('Error saving conversation history:', error);
      }
    };

    if (conversationHistory.length > 0) {
      saveConversationHistory();
    }
  }, [conversationHistory]);

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
    AsyncStorage.removeItem('conversationHistory').catch(error => {
      console.error('Error clearing conversation history:', error);
    });
  }, []);

  // Generate AI response using OpenAI API
  const generateAIResponse = useCallback(async (userInput: string): Promise<string> => {
    if (!userInput.trim()) return '';
    
    setIsAIGenerating(true);
    
    try {
      // Create a new conversation entry for the user input
      const userEntry: ConversationEntry = {
        id: `user_${Date.now()}`,
        timestamp: new Date(),
        userInput,
        aiResponse: '',
        context: '',
      };
      
      addConversationEntry(userEntry);
      
      // Prepare messages for OpenAI API
      const messages = [
        {
          role: 'system' as const,
          content: `You are a helpful AI learning assistant. You help users with their learning journey, 
                    provide recommendations, and answer questions about courses and learning materials.
                    The user's learning style is ${userPreferences.learningStyle}.
                    The user's learning goals are: ${userPreferences.learningGoals.join(', ')}.
                    The user's interests are: ${userPreferences.interests.join(', ')}.
                    Be concise, helpful, and friendly in your responses.`
        },
        // Include recent conversation history (last 5 messages)
        ...conversationHistory.slice(-5).flatMap(entry => [
          { role: 'user' as const, content: entry.userInput },
          { role: 'assistant' as const, content: entry.aiResponse }
        ]),
        { role: 'user' as const, content: userInput }
      ];
      
      // Create a placeholder for the AI response
      const aiEntry: ConversationEntry = {
        id: `ai_${Date.now()}`,
        timestamp: new Date(),
        userInput: '',
        aiResponse: '',
        context: JSON.stringify(userPreferences),
      };
      
      addConversationEntry(aiEntry);
      
      // Use streaming response for better user experience
      let fullResponse = '';
      
      await openAIService.generateStreamingChatCompletion(
        messages,
        (chunk) => {
          fullResponse += chunk;
          appendToLastAIResponse(fullResponse);
        },
        {
          temperature: 0.7,
          max_tokens: 1000,
        }
      );
      
      return fullResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Add error message to conversation
      const errorMessage = error instanceof Error 
        ? `Error: ${error.message}` 
        : 'Failed to get AI response. Please try again later.';
      
      appendToLastAIResponse(errorMessage);
      
      return errorMessage;
    } finally {
      setIsAIGenerating(false);
    }
  }, [conversationHistory, userPreferences, addConversationEntry]);

  // Append content to the last AI response in the conversation history
  const appendToLastAIResponse = useCallback((content: string) => {
    setConversationHistory(prev => {
      const newHistory = [...prev];
      const lastEntry = newHistory[newHistory.length - 1];
      
      if (lastEntry && !lastEntry.userInput) {
        // This is an AI response entry
        lastEntry.aiResponse = content;
      }
      
      return newHistory;
    });
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
    isAIGenerating,
    generateAIResponse,
    appendToLastAIResponse,
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