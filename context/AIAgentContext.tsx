import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useRevenueCat } from '@/context/RevenueCatContext';

// Types for AI Agent
interface AIAgentState {
  isActive: boolean;
  isProcessing: boolean;
  currentQuery: string;
  lastResponse: string | null;
  conversationHistory: ConversationEntry[];
  userPreferences: UserPreferences;
  learningInsights: LearningInsight[];
  recommendations: Recommendation[];
}

interface ConversationEntry {
  id: string;
  timestamp: Date;
  isUser: boolean;
  message: string;
  intent?: string;
  entities?: Record<string, any>;
}

interface UserPreferences {
  learningGoals: string[];
  preferredTopics: string[];
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic' | null;
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  studyReminders: boolean;
  dailyLearningTarget: number; // minutes
  preferredStudyTime: string | null;
}

interface LearningInsight {
  id: string;
  type: 'streak' | 'progress' | 'achievement' | 'recommendation' | 'reminder';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface Recommendation {
  id: string;
  type: 'course' | 'resource' | 'coach' | 'learning_path' | 'exercise';
  title: string;
  description: string;
  reason: string;
  itemId: string;
  confidence: number; // 0-1
  timestamp: Date;
}

interface AIAgentContextType extends AIAgentState {
  toggleAgent: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  dismissInsight: (insightId: string) => void;
  getRecommendation: (type: string) => Promise<Recommendation | null>;
  getPersonalizedGreeting: () => string;
  getNextLearningStep: () => Promise<string>;
  analyzeProgress: () => Promise<LearningInsight[]>;
}

// Default values
const defaultUserPreferences: UserPreferences = {
  learningGoals: ['Improve coding skills', 'Learn new technologies'],
  preferredTopics: ['React', 'JavaScript', 'Web Development'],
  learningStyle: null,
  preferredDifficulty: null,
  studyReminders: true,
  dailyLearningTarget: 30,
  preferredStudyTime: null,
};

// Create context
const AIAgentContext = createContext<AIAgentContextType | undefined>(undefined);

export function AIAgentProvider({ children }: { children: React.ReactNode }) {
  const { isPremium } = useRevenueCat();
  const [state, setState] = useState<AIAgentState>({
    isActive: true,
    isProcessing: false,
    currentQuery: '',
    lastResponse: null,
    conversationHistory: [],
    userPreferences: defaultUserPreferences,
    learningInsights: [],
    recommendations: [],
  });

  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('aiAgentState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          
          // Convert string dates back to Date objects
          if (parsedState.conversationHistory) {
            parsedState.conversationHistory = parsedState.conversationHistory.map((entry: any) => ({
              ...entry,
              timestamp: new Date(entry.timestamp),
            }));
          }
          
          if (parsedState.learningInsights) {
            parsedState.learningInsights = parsedState.learningInsights.map((insight: any) => ({
              ...insight,
              timestamp: new Date(insight.timestamp),
            }));
          }
          
          if (parsedState.recommendations) {
            parsedState.recommendations = parsedState.recommendations.map((rec: any) => ({
              ...rec,
              timestamp: new Date(rec.timestamp),
            }));
          }
          
          setState(prevState => ({
            ...prevState,
            ...parsedState,
          }));
        }
        
        // Generate initial insights if none exist
        if (!parsedState?.learningInsights || parsedState.learningInsights.length === 0) {
          generateInitialInsights();
        }
      } catch (error) {
        console.error('Error loading AI agent state:', error);
      }
    };

    loadSavedState();
    
    // Set up periodic insight generation
    const insightInterval = setInterval(() => {
      generatePeriodicInsights();
    }, 3600000); // Every hour
    
    return () => clearInterval(insightInterval);
  }, []);

  // Save state when it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('aiAgentState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving AI agent state:', error);
      }
    };

    saveState();
  }, [state]);

  // Toggle agent active state
  const toggleAgent = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isActive: !prevState.isActive,
    }));
  }, []);

  // Clear conversation history
  const clearConversation = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      conversationHistory: [],
      lastResponse: null,
    }));
  }, []);

  // Update user preferences
  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setState(prevState => ({
      ...prevState,
      userPreferences: {
        ...prevState.userPreferences,
        ...preferences,
      },
    }));
  }, []);

  // Dismiss an insight
  const dismissInsight = useCallback((insightId: string) => {
    setState(prevState => ({
      ...prevState,
      learningInsights: prevState.learningInsights.filter(insight => insight.id !== insightId),
    }));
  }, []);

  // Generate initial insights
  const generateInitialInsights = useCallback(async () => {
    const newInsights: LearningInsight[] = [
      {
        id: `insight_${Date.now()}_1`,
        type: 'recommendation',
        title: 'Welcome to Your Learning Journey',
        description: 'I\'ve analyzed your profile and prepared personalized recommendations to help you achieve your learning goals.',
        priority: 'medium',
        timestamp: new Date(),
      },
      {
        id: `insight_${Date.now()}_2`,
        type: 'reminder',
        title: 'Set Your Learning Goals',
        description: 'Define your learning objectives to get the most personalized experience.',
        priority: 'high',
        timestamp: new Date(),
      },
    ];

    setState(prevState => ({
      ...prevState,
      learningInsights: [...prevState.learningInsights, ...newInsights],
    }));
  }, []);

  // Generate periodic insights
  const generatePeriodicInsights = useCallback(async () => {
    // Only generate new insights if the agent is active
    if (!state.isActive) return;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's learning activity
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id);

      const { data: lessonProgress } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Generate insights based on activity
      const newInsights: LearningInsight[] = [];

      // Check for inactive courses
      if (enrollments && enrollments.length > 0) {
        const inactiveCourses = enrollments.filter(
          e => e.progress_percentage < 100 && 
          (!e.last_accessed_at || new Date(e.last_accessed_at).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000)
        );

        if (inactiveCourses.length > 0) {
          newInsights.push({
            id: `insight_${Date.now()}_inactive`,
            type: 'reminder',
            title: 'Continue Your Learning',
            description: `You have ${inactiveCourses.length} course${inactiveCourses.length > 1 ? 's' : ''} that you haven't worked on recently. Ready to pick up where you left off?`,
            priority: 'medium',
            timestamp: new Date(),
            metadata: {
              courseIds: inactiveCourses.map(c => c.course_id),
            },
          });
        }
      }

      // Check for learning streak
      if (lessonProgress && lessonProgress.length > 0) {
        const recentDates = new Set();
        lessonProgress.forEach(progress => {
          if (progress.completed_at) {
            const date = new Date(progress.completed_at);
            recentDates.add(date.toDateString());
          }
        });

        if (recentDates.size >= 3) {
          newInsights.push({
            id: `insight_${Date.now()}_streak`,
            type: 'streak',
            title: 'Learning Streak!',
            description: `You've been learning consistently for ${recentDates.size} days. Keep up the great work!`,
            priority: 'high',
            timestamp: new Date(),
          });
        }
      }

      // Add premium recommendation for non-premium users
      if (!isPremium) {
        newInsights.push({
          id: `insight_${Date.now()}_premium`,
          type: 'recommendation',
          title: 'Unlock Your Full Potential',
          description: 'Upgrade to Premium to access all courses, coaching sessions, and exclusive content.',
          priority: 'low',
          timestamp: new Date(),
        });
      }

      // Add the new insights
      if (newInsights.length > 0) {
        setState(prevState => ({
          ...prevState,
          learningInsights: [...prevState.learningInsights, ...newInsights],
        }));
      }
    } catch (error) {
      console.error('Error generating periodic insights:', error);
    }
  }, [state.isActive, isPremium]);

  // Get a personalized recommendation
  const getRecommendation = useCallback(async (type: string): Promise<Recommendation | null> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get user's enrollments to see what they're already learning
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];

      // Get courses that match user preferences and aren't already enrolled
      const { data: courses } = await supabase
        .from('courses')
        .select(`
          *,
          categories (name),
          instructors (name, avatar_url)
        `)
        .eq('is_published', true)
        .not('id', 'in', `(${enrolledCourseIds.join(',')})`)
        .order('rating', { ascending: false })
        .limit(5);

      if (!courses || courses.length === 0) return null;

      // Select a course based on user preferences
      const preferredTopics = state.userPreferences.preferredTopics;
      const preferredDifficulty = state.userPreferences.preferredDifficulty;

      let matchedCourses = courses;

      // Filter by topic if preferences exist
      if (preferredTopics && preferredTopics.length > 0) {
        const topicMatches = courses.filter(course => 
          preferredTopics.some(topic => 
            course.title.toLowerCase().includes(topic.toLowerCase()) || 
            course.description.toLowerCase().includes(topic.toLowerCase()) ||
            (course.tags && course.tags.some(tag => 
              preferredTopics.some(topic => tag.toLowerCase().includes(topic.toLowerCase()))
            ))
          )
        );
        
        if (topicMatches.length > 0) {
          matchedCourses = topicMatches;
        }
      }

      // Filter by difficulty if preference exists
      if (preferredDifficulty) {
        const difficultyMatches = matchedCourses.filter(course => 
          course.level === preferredDifficulty
        );
        
        if (difficultyMatches.length > 0) {
          matchedCourses = difficultyMatches;
        }
      }

      // Select a course (randomly from top matches)
      const selectedCourse = matchedCourses[Math.floor(Math.random() * Math.min(3, matchedCourses.length))];

      // Create recommendation
      const recommendation: Recommendation = {
        id: `rec_${Date.now()}`,
        type: 'course',
        title: selectedCourse.title,
        description: selectedCourse.description,
        reason: generateRecommendationReason(selectedCourse, state.userPreferences),
        itemId: selectedCourse.id,
        confidence: 0.85,
        timestamp: new Date(),
      };

      // Add to recommendations list
      setState(prevState => ({
        ...prevState,
        recommendations: [...prevState.recommendations, recommendation],
      }));

      return recommendation;
    } catch (error) {
      console.error('Error getting recommendation:', error);
      return null;
    }
  }, [state.userPreferences]);

  // Generate a reason for the recommendation
  const generateRecommendationReason = (course: any, preferences: UserPreferences): string => {
    const reasons = [
      `This aligns with your interest in ${preferences.preferredTopics[0] || 'technology'}`,
      `This ${course.level} level course matches your preferred difficulty`,
      `This is highly rated (${course.rating}/5) and popular among learners`,
      `This will help you achieve your goal of ${preferences.learningGoals[0] || 'improving your skills'}`,
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  // Get a personalized greeting based on time of day and user data
  const getPersonalizedGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    let timeGreeting = 'Hello';
    
    if (hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour < 18) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }

    // Get a random greeting variation
    const greetings = [
      `${timeGreeting}! Ready to continue your learning journey?`,
      `${timeGreeting}! What would you like to learn today?`,
      `${timeGreeting}! I've prepared some recommendations for you.`,
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }, []);

  // Get the next recommended learning step
  const getNextLearningStep = useCallback(async (): Promise<string> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return "Sign in to get personalized learning recommendations.";

      // Get user's enrollments with progress
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            id, 
            title, 
            duration_minutes
          )
        `)
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false });

      if (!enrollments || enrollments.length === 0) {
        return "Explore our course catalog to start your learning journey.";
      }

      // Find the most recently accessed course with incomplete progress
      const inProgressCourses = enrollments.filter(e => e.progress_percentage < 100);
      
      if (inProgressCourses.length > 0) {
        const mostRecent = inProgressCourses[0];
        return `Continue learning "${mostRecent.courses.title}" (${mostRecent.progress_percentage}% complete)`;
      } else {
        // All courses completed, recommend a new one
        const recommendation = await getRecommendation('course');
        if (recommendation) {
          return `You've completed all your courses! Try "${recommendation.title}"`;
        } else {
          return "You've completed all your courses! Explore our catalog for more.";
        }
      }
    } catch (error) {
      console.error('Error getting next learning step:', error);
      return "I can help you find your next learning opportunity.";
    }
  }, [getRecommendation]);

  // Analyze user progress and generate insights
  const analyzeProgress = useCallback(async (): Promise<LearningInsight[]> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const insights: LearningInsight[] = [];

      // Get user's enrollments
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            id, 
            title, 
            duration_minutes
          )
        `)
        .eq('user_id', user.id);

      // Get lesson progress
      const { data: lessonProgress } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false });

      // Calculate total learning time
      let totalMinutes = 0;
      if (lessonProgress && lessonProgress.length > 0) {
        totalMinutes = lessonProgress.reduce((sum, progress) => {
          return sum + (progress.time_spent_minutes || 0);
        }, 0);
      }

      // Calculate completion rate
      let completionRate = 0;
      if (enrollments && enrollments.length > 0) {
        const totalCourses = enrollments.length;
        const completedCourses = enrollments.filter(e => e.progress_percentage === 100).length;
        completionRate = (completedCourses / totalCourses) * 100;
      }

      // Generate insights based on the data
      if (totalMinutes > 0) {
        insights.push({
          id: `insight_time_${Date.now()}`,
          type: 'progress',
          title: 'Learning Progress',
          description: `You've spent ${totalMinutes} minutes learning. That's ${Math.floor(totalMinutes / 60)} hours of focused study!`,
          priority: 'medium',
          timestamp: new Date(),
        });
      }

      if (completionRate > 0) {
        insights.push({
          id: `insight_completion_${Date.now()}`,
          type: 'progress',
          title: 'Course Completion',
          description: `You've completed ${Math.round(completionRate)}% of your enrolled courses. ${completionRate < 50 ? 'Keep going!' : 'Impressive work!'}`,
          priority: 'medium',
          timestamp: new Date(),
        });
      }

      // Check for recent achievements
      if (lessonProgress && lessonProgress.length > 0) {
        const recentProgress = lessonProgress[0];
        const completionDate = new Date(recentProgress.completed_at);
        const now = new Date();
        const hoursSinceCompletion = (now.getTime() - completionDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceCompletion < 24) {
          insights.push({
            id: `insight_recent_${Date.now()}`,
            type: 'achievement',
            title: 'Recent Progress',
            description: `You completed a lesson ${hoursSinceCompletion < 1 ? 'just now' : `${Math.floor(hoursSinceCompletion)} hours ago`}. Great job maintaining your learning momentum!`,
            priority: 'high',
            timestamp: new Date(),
          });
        }
      }

      return insights;
    } catch (error) {
      console.error('Error analyzing progress:', error);
      return [];
    }
  }, []);

  // Process user message with NLP
  const processMessage = async (message: string) => {
    // In a real implementation, this would use a proper NLP service
    // For this demo, we'll use a simple keyword-based approach
    
    const lowerMessage = message.toLowerCase();
    
    // Detect intent
    let intent = 'general';
    let response = '';
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
      intent = 'get_recommendation';
      const recommendation = await getRecommendation('course');
      if (recommendation) {
        response = `I recommend "${recommendation.title}". ${recommendation.reason}`;
      } else {
        response = "I don't have any specific recommendations right now. Try exploring our featured courses.";
      }
    } else if (lowerMessage.includes('progress') || lowerMessage.includes('how am i doing')) {
      intent = 'check_progress';
      const insights = await analyzeProgress();
      if (insights.length > 0) {
        response = insights.map(insight => insight.description).join(' ');
      } else {
        response = "I don't have enough data to analyze your progress yet. Keep learning and check back later!";
      }
    } else if (lowerMessage.includes('next') || lowerMessage.includes('continue')) {
      intent = 'next_step';
      response = await getNextLearningStep();
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      intent = 'greeting';
      response = getPersonalizedGreeting();
    } else if (lowerMessage.includes('thank')) {
      intent = 'gratitude';
      response = "You're welcome! I'm here to help with your learning journey.";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how do i')) {
      intent = 'help';
      response = "I can help you find courses, track your progress, provide recommendations, and answer questions about your learning journey. What would you like to know?";
    } else {
      // General response
      const generalResponses = [
        "I'm here to help with your learning journey. Try asking for recommendations or checking your progress.",
        "I can help you find the right courses and resources. What are you interested in learning?",
        "I'm your AI learning assistant. I can recommend courses, track progress, and help you achieve your goals.",
      ];
      response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
    
    return { intent, response };
  };

  // Send a message to the AI agent
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage: ConversationEntry = {
      id: `user_${Date.now()}`,
      timestamp: new Date(),
      isUser: true,
      message: message,
    };

    setState(prevState => ({
      ...prevState,
      isProcessing: true,
      conversationHistory: [...prevState.conversationHistory, userMessage],
    }));

    try {
      // Process the message
      const { intent, response } = await processMessage(message);

      // Add AI response to conversation
      const aiResponse: ConversationEntry = {
        id: `ai_${Date.now()}`,
        timestamp: new Date(),
        isUser: false,
        message: response,
        intent,
      };

      setState(prevState => ({
        ...prevState,
        isProcessing: false,
        lastResponse: response,
        conversationHistory: [...prevState.conversationHistory, aiResponse],
      }));
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error response
      const errorResponse: ConversationEntry = {
        id: `error_${Date.now()}`,
        timestamp: new Date(),
        isUser: false,
        message: "I'm sorry, I encountered an error processing your request. Please try again.",
        intent: 'error',
      };

      setState(prevState => ({
        ...prevState,
        isProcessing: false,
        conversationHistory: [...prevState.conversationHistory, errorResponse],
      }));
    }
  }, [processMessage, getPersonalizedGreeting, getNextLearningStep, analyzeProgress, getRecommendation]);

  // Context value
  const value: AIAgentContextType = {
    ...state,
    toggleAgent,
    sendMessage,
    clearConversation,
    updatePreferences,
    dismissInsight,
    getRecommendation,
    getPersonalizedGreeting,
    getNextLearningStep,
    analyzeProgress,
  };

  return (
    <AIAgentContext.Provider value={value}>
      {children}
    </AIAgentContext.Provider>
  );
}

export function useAIAgent() {
  const context = useContext(AIAgentContext);
  if (context === undefined) {
    throw new Error('useAIAgent must be used within an AIAgentProvider');
  }
  return context;
}