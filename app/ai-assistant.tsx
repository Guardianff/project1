import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Target, Briefcase, Dumbbell, Heart, BookOpen, Calendar, Settings, MessageCircle, Mic, Send, Sparkles, TrendingUp, Clock, Zap, Globe, Moon, Sun, Volume2, VolumeX, Download, Upload, Search, FileText, ChartBar as BarChart3, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info, Lightbulb, Brain, Keyboard, Eye, Type, Palette } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useAI } from '@/context/AIContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Animated, { FadeInUp, FadeInRight, SlideInUp, SlideInDown } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action' | 'error';
}

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  enabled: boolean;
}

interface UserSettings {
  language: string;
  voiceEnabled: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  notifications: boolean;
  accessibility: {
    screenReader: boolean;
    highContrast: boolean;
    largeText: boolean;
    keyboardNavigation: boolean;
  };
}

export default function AIAssistantScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { aiSuggestion, userPreferences, updatePreferences } = useAI();
  
  // State management
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'tasks' | 'settings'>('home');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Array<{id: string; title: string; completed: boolean; priority: 'low' | 'medium' | 'high'}>>([]);
  const [reminders, setReminders] = useState<Array<{id: string; title: string; time: string; enabled: boolean}>>([]);
  
  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    language: 'en',
    voiceEnabled: true,
    darkMode: isDarkMode,
    fontSize: 'medium',
    autoSave: true,
    notifications: true,
    accessibility: {
      screenReader: false,
      highContrast: false,
      largeText: false,
      keyboardNavigation: false,
    }
  });

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const chatInputRef = useRef<TextInput>(null);

  // AI Features
  const aiFeatures: AIFeature[] = [
    {
      id: 'nlp',
      title: 'Natural Language Processing',
      description: 'Understand and respond in conversational language',
      icon: <Brain size={24} color="white" />,
      color: '#8B5CF6',
      enabled: true,
    },
    {
      id: 'voice',
      title: 'Voice Recognition',
      description: 'Speak naturally and get voice responses',
      icon: <Volume2 size={24} color="white" />,
      color: '#06B6D4',
      enabled: settings.voiceEnabled,
    },
    {
      id: 'automation',
      title: 'Task Automation',
      description: 'Automate repetitive tasks and workflows',
      icon: <Zap size={24} color="white" />,
      color: '#10B981',
      enabled: true,
    },
    {
      id: 'search',
      title: 'Smart Search',
      description: 'Find information quickly with AI-powered search',
      icon: <Search size={24} color="white" />,
      color: '#F59E0B',
      enabled: true,
    },
    {
      id: 'analytics',
      title: 'Progress Analytics',
      description: 'Track and analyze your learning progress',
      icon: <BarChart3 size={24} color="white" />,
      color: '#EF4444',
      enabled: true,
    },
    {
      id: 'personalization',
      title: 'Smart Personalization',
      description: 'Adaptive interface based on your preferences',
      icon: <Palette size={24} color="white" />,
      color: '#EC4899',
      enabled: true,
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      id: 'goal',
      title: 'Set a Goal',
      subtitle: 'Create your next milestone',
      icon: <Target size={32} color="white" />,
      gradient: ['#8B5CF6', '#EC4899'],
      action: () => handleQuickAction('goal'),
    },
    {
      id: 'career',
      title: 'Career Growth',
      subtitle: 'Advance your professional skills',
      icon: <Briefcase size={32} color="white" />,
      gradient: ['#3B82F6', '#06B6D4'],
      action: () => handleQuickAction('career'),
    },
    {
      id: 'fitness',
      title: 'Fitness Plan',
      subtitle: 'Stay healthy and strong',
      icon: <Dumbbell size={32} color="white" />,
      gradient: ['#10B981', '#22C55E'],
      action: () => handleQuickAction('fitness'),
    },
    {
      id: 'passion',
      title: 'Passion Project',
      subtitle: 'Explore your creative side',
      icon: <Heart size={32} color="white" />,
      gradient: ['#F59E0B', '#EF4444'],
      action: () => handleQuickAction('passion'),
    },
    {
      id: 'skills',
      title: 'Learn Skills',
      subtitle: 'Master new abilities',
      icon: <BookOpen size={32} color="white" />,
      gradient: ['#6366F1', '#8B5CF6'],
      action: () => handleQuickAction('skills'),
    },
    {
      id: 'plan',
      title: 'Daily Plan',
      subtitle: 'Review today\'s schedule',
      icon: <Calendar size={32} color="white" />,
      gradient: ['#14B8A6', '#06B6D4'],
      action: () => handleQuickAction('plan'),
    },
  ];

  // AI Insights
  const insights = [
    {
      id: 1,
      title: 'Streak Alert!',
      message: 'You\'re on a 7-day learning streak. Keep it going!',
      icon: <TrendingUp size={20} color={colors.success[500]} />,
      color: colors.success[500],
      type: 'success' as const,
    },
    {
      id: 2,
      title: 'Perfect Timing',
      message: `It's ${userPreferences.preferredWorkoutTime} - your ideal workout time!`,
      icon: <Clock size={20} color={colors.primary[500]} />,
      color: colors.primary[500],
      type: 'info' as const,
    },
    {
      id: 3,
      title: 'Quick Win',
      message: 'Complete one more lesson to reach your weekly goal.',
      icon: <Zap size={20} color={colors.warning[500]} />,
      color: colors.warning[500],
      type: 'warning' as const,
    },
  ];

  // Effects
  useEffect(() => {
    // Auto-save functionality
    if (settings.autoSave) {
      const saveData = () => {
        console.log('Auto-saving user data...');
      };
      const interval = setInterval(saveData, 30000); // Save every 30 seconds
      return () => clearInterval(interval);
    }
  }, [settings.autoSave]);

  useEffect(() => {
    // Scroll to bottom when new chat messages are added
    if (chatMessages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages]);

  // Handlers
  const handleQuickAction = (actionId: string) => {
    const actionMessages = {
      goal: "I'd love to help you set a new goal! What area would you like to focus on?",
      career: "Let's work on your career development. What specific skills or roles interest you?",
      fitness: "Time to get moving! What type of workout are you in the mood for today?",
      passion: "Exciting! What passion project has been on your mind lately?",
      skills: "Learning new skills is fantastic! What would you like to master next?",
      plan: "Let me help you organize your day. Here's what I recommend based on your goals..."
    };

    addChatMessage(actionMessages[actionId as keyof typeof actionMessages], false, 'suggestion');
    setActiveTab('chat');
  };

  const addChatMessage = (text: string, isUser: boolean, type: ChatMessage['type'] = 'text') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      type,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
      addChatMessage(chatMessage, true);
      setChatMessage('');
      
      // Simulate AI typing
      setIsTyping(true);
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "I understand what you're looking for. Let me help you with that!",
          "That's a great question! Based on your learning history, I'd recommend...",
          "I can definitely assist with that. Here are some personalized suggestions:",
          "Excellent choice! Let me create a customized plan for you.",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, false);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleVoiceInput = () => {
    if (!settings.voiceEnabled) {
      Alert.alert('Voice Disabled', 'Please enable voice input in settings to use this feature.');
      return;
    }

    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setChatMessage("How can I improve my React Native skills?");
        setIsListening(false);
      }, 2000);
    }
  };

  const addTask = (title: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addReminder = (title: string, time: string) => {
    const newReminder = {
      id: Date.now().toString(),
      title,
      time,
      enabled: true,
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportData = () => {
    const data = {
      chatMessages,
      tasks,
      reminders,
      settings,
      userPreferences,
    };
    
    if (Platform.OS === 'web') {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ai-assistant-data.json';
      link.click();
      URL.revokeObjectURL(url);
    }
    
    Alert.alert('Export Complete', 'Your data has been exported successfully!');
  };

  const importData = () => {
    Alert.alert('Import Data', 'This feature allows you to import previously exported data.');
  };

  // Render functions
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'chat':
        return renderChatTab();
      case 'tasks':
        return renderTasksTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderHomeTab();
    }
  };

  const renderHomeTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* AI Suggestion Banner */}
      {aiSuggestion && (
        <Animated.View 
          entering={SlideInUp.delay(200).duration(500)}
          style={[styles.suggestionBanner, { backgroundColor: colors.primary[50] }]}
        >
          <View style={styles.suggestionContent}>
            <View style={[styles.suggestionIcon, { backgroundColor: colors.primary[500] }]}>
              <Sparkles size={20} color="white" />
            </View>
            <View style={styles.suggestionText}>
              <Text style={[styles.suggestionTitle, { color: colors.primary[700] }]}>
                AI Suggestion
              </Text>
              <Text style={[styles.suggestionMessage, { color: colors.primary[600] }]}>
                {aiSuggestion}
              </Text>
            </View>
          </View>
          <Button
            title="Let's Go"
            variant="primary"
            size="small"
            onPress={() => handleQuickAction('goal')}
            style={styles.suggestionButton}
          />
        </Animated.View>
      )}

      {/* Quick Actions Grid */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <Animated.View
              key={action.id}
              entering={FadeInRight.delay(400 + index * 100).duration(500)}
              style={[styles.actionCard, { width: (screenWidth - 60) / 2 }]}
            >
              <TouchableOpacity
                style={styles.actionCardContent}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <View style={[styles.actionCardBackground, { 
                  backgroundColor: action.gradient[0] 
                }]}>
                  <View style={styles.actionCardIcon}>
                    {action.icon}
                  </View>
                  <Text style={styles.actionCardTitle}>{action.title}</Text>
                  <Text style={styles.actionCardSubtitle}>{action.subtitle}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* AI Features */}
      <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Features</Text>
        <View style={styles.featuresGrid}>
          {aiFeatures.map((feature, index) => (
            <Animated.View
              key={feature.id}
              entering={FadeInUp.delay(600 + index * 100).duration(500)}
              style={[styles.featureCard, { backgroundColor: colors.background }]}
            >
              <View style={styles.featureHeader}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  {feature.icon}
                </View>
                <Badge 
                  label={feature.enabled ? 'Active' : 'Disabled'} 
                  variant={feature.enabled ? 'success' : 'neutral'} 
                  size="small" 
                />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {feature.description}
              </Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* AI Insights */}
      <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Insights</Text>
        {insights.map((insight, index) => (
          <Animated.View
            key={insight.id}
            entering={FadeInUp.delay(800 + index * 100).duration(500)}
            style={[styles.insightCard, { backgroundColor: colors.background }]}
          >
            <View style={styles.insightContent}>
              <View style={[styles.insightIcon, { backgroundColor: `${insight.color}15` }]}>
                {insight.icon}
              </View>
              <View style={styles.insightText}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>
                  {insight.title}
                </Text>
                <Text style={[styles.insightMessage, { color: colors.textSecondary }]}>
                  {insight.message}
                </Text>
              </View>
              <View style={styles.insightActions}>
                {insight.type === 'success' && <CheckCircle size={16} color={insight.color} />}
                {insight.type === 'warning' && <AlertCircle size={16} color={insight.color} />}
                {insight.type === 'info' && <Info size={16} color={insight.color} />}
              </View>
            </View>
          </Animated.View>
        ))}
      </Animated.View>
    </ScrollView>
  );

  const renderChatTab = () => (
    <KeyboardAvoidingView 
      style={styles.chatContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatMessages} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatMessagesContent}
      >
        {chatMessages.map((message, index) => (
          <Animated.View
            key={message.id}
            entering={FadeInUp.delay(index * 50).duration(300)}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage
            ]}
          >
            <View style={[
              styles.messageBubble,
              {
                backgroundColor: message.isUser 
                  ? colors.primary[500] 
                  : message.type === 'suggestion'
                    ? colors.warning[50]
                    : message.type === 'error'
                      ? colors.error[50]
                      : colors.neutral[100]
              }
            ]}>
              <Text style={[
                styles.messageText,
                {
                  color: message.isUser 
                    ? 'white' 
                    : message.type === 'suggestion'
                      ? colors.warning[700]
                      : message.type === 'error'
                        ? colors.error[700]
                        : colors.text
                }
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.messageTime,
                {
                  color: message.isUser 
                    ? 'rgba(255,255,255,0.7)' 
                    : colors.textSecondary
                }
              ]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </Animated.View>
        ))}
        
        {isTyping && (
          <Animated.View 
            entering={FadeInUp.duration(300)}
            style={[styles.messageContainer, styles.aiMessage]}
          >
            <View style={[styles.messageBubble, { backgroundColor: colors.neutral[100] }]}>
              <Text style={[styles.messageText, { color: colors.text }]}>AI is typing...</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.chatInputContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.chatInput, { backgroundColor: colors.neutral[50] }]}>
          <TextInput
            ref={chatInputRef}
            style={[styles.chatTextInput, { color: colors.text }]}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.neutral[400]}
            value={chatMessage}
            onChangeText={setChatMessage}
            multiline
            maxLength={500}
          />
          <View style={styles.chatActions}>
            <TouchableOpacity 
              style={[
                styles.chatActionButton,
                isListening && { backgroundColor: colors.error[500] }
              ]}
              onPress={handleVoiceInput}
            >
              <Mic size={20} color={isListening ? 'white' : colors.neutral[500]} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.chatActionButton, 
                { backgroundColor: chatMessage.trim() ? colors.primary[500] : colors.neutral[200] }
              ]}
              onPress={handleSendMessage}
              disabled={!chatMessage.trim()}
            >
              <Send size={20} color={chatMessage.trim() ? 'white' : colors.neutral[400]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const renderTasksTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Task Management */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tasks & Reminders</Text>
          <Button
            title="Add Task"
            variant="primary"
            size="small"
            onPress={() => addTask('New task from AI assistant')}
          />
        </View>

        {/* Tasks List */}
        <View style={styles.tasksList}>
          {tasks.map((task, index) => (
            <Animated.View
              key={task.id}
              entering={FadeInUp.delay(index * 100).duration(400)}
              style={[styles.taskItem, { backgroundColor: colors.background }]}
            >
              <TouchableOpacity
                style={styles.taskContent}
                onPress={() => toggleTask(task.id)}
              >
                <View style={[
                  styles.taskCheckbox,
                  {
                    backgroundColor: task.completed ? colors.success[500] : 'transparent',
                    borderColor: task.completed ? colors.success[500] : colors.neutral[300]
                  }
                ]}>
                  {task.completed && <CheckCircle size={16} color="white" />}
                </View>
                <Text style={[
                  styles.taskTitle,
                  {
                    color: task.completed ? colors.textSecondary : colors.text,
                    textDecorationLine: task.completed ? 'line-through' : 'none'
                  }
                ]}>
                  {task.title}
                </Text>
                <Badge
                  label={task.priority}
                  variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'neutral'}
                  size="small"
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Reminders */}
        <View style={styles.remindersSection}>
          <Text style={[styles.subsectionTitle, { color: colors.text }]}>Reminders</Text>
          <Button
            title="Add Reminder"
            variant="outline"
            size="small"
            onPress={() => addReminder('Study React Native', '7:00 PM')}
            style={styles.addReminderButton}
          />
          
          {reminders.map((reminder, index) => (
            <Animated.View
              key={reminder.id}
              entering={FadeInUp.delay(index * 100).duration(400)}
              style={[styles.reminderItem, { backgroundColor: colors.neutral[50] }]}
            >
              <View style={styles.reminderContent}>
                <Text style={[styles.reminderTitle, { color: colors.text }]}>{reminder.title}</Text>
                <Text style={[styles.reminderTime, { color: colors.textSecondary }]}>{reminder.time}</Text>
              </View>
              <Badge
                label={reminder.enabled ? 'Active' : 'Disabled'}
                variant={reminder.enabled ? 'success' : 'neutral'}
                size="small"
              />
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Progress Tracking */}
      <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Progress Tracking</Text>
        <View style={[styles.progressCard, { backgroundColor: colors.background }]}>
          <View style={styles.progressItem}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Tasks Completed Today</Text>
            <Text style={[styles.progressValue, { color: colors.text }]}>
              {tasks.filter(t => t.completed).length} / {tasks.length}
            </Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Weekly Goal Progress</Text>
            <Text style={[styles.progressValue, { color: colors.text }]}>75%</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Learning Streak</Text>
            <Text style={[styles.progressValue, { color: colors.text }]}>7 days</Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );

  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* User Preferences */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
        
        <View style={[styles.settingsCard, { backgroundColor: colors.background }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Language</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Choose your preferred language
              </Text>
            </View>
            <TouchableOpacity style={[styles.settingValue, { backgroundColor: colors.neutral[100] }]}>
              <Globe size={16} color={colors.neutral[600]} />
              <Text style={[styles.settingValueText, { color: colors.text }]}>English</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Voice Input</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Enable voice recognition and text-to-speech
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.settingToggle,
                { backgroundColor: settings.voiceEnabled ? colors.primary[500] : colors.neutral[200] }
              ]}
              onPress={() => updateSetting('voiceEnabled', !settings.voiceEnabled)}
            >
              <View style={[
                styles.settingToggleThumb,
                {
                  backgroundColor: 'white',
                  transform: [{ translateX: settings.voiceEnabled ? 20 : 2 }]
                }
              ]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Toggle between light and dark themes
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.settingToggle,
                { backgroundColor: isDarkMode ? colors.primary[500] : colors.neutral[200] }
              ]}
              onPress={toggleTheme}
            >
              <View style={[
                styles.settingToggleThumb,
                {
                  backgroundColor: 'white',
                  transform: [{ translateX: isDarkMode ? 20 : 2 }]
                }
              ]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Auto-Save</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Automatically save your progress
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.settingToggle,
                { backgroundColor: settings.autoSave ? colors.primary[500] : colors.neutral[200] }
              ]}
              onPress={() => updateSetting('autoSave', !settings.autoSave)}
            >
              <View style={[
                styles.settingToggleThumb,
                {
                  backgroundColor: 'white',
                  transform: [{ translateX: settings.autoSave ? 20 : 2 }]
                }
              ]} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Accessibility */}
      <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Accessibility</Text>
        
        <View style={[styles.settingsCard, { backgroundColor: colors.background }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Screen Reader Support</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Enhanced compatibility with screen readers
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.settingToggle,
                { backgroundColor: settings.accessibility.screenReader ? colors.primary[500] : colors.neutral[200] }
              ]}
              onPress={() => updateSetting('accessibility', {
                ...settings.accessibility,
                screenReader: !settings.accessibility.screenReader
              })}
            >
              <View style={[
                styles.settingToggleThumb,
                {
                  backgroundColor: 'white',
                  transform: [{ translateX: settings.accessibility.screenReader ? 20 : 2 }]
                }
              ]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>High Contrast</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Increase contrast for better visibility
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.settingToggle,
                { backgroundColor: settings.accessibility.highContrast ? colors.primary[500] : colors.neutral[200] }
              ]}
              onPress={() => updateSetting('accessibility', {
                ...settings.accessibility,
                highContrast: !settings.accessibility.highContrast
              })}
            >
              <View style={[
                styles.settingToggleThumb,
                {
                  backgroundColor: 'white',
                  transform: [{ translateX: settings.accessibility.highContrast ? 20 : 2 }]
                }
              ]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Large Text</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Increase text size for better readability
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.settingToggle,
                { backgroundColor: settings.accessibility.largeText ? colors.primary[500] : colors.neutral[200] }
              ]}
              onPress={() => updateSetting('accessibility', {
                ...settings.accessibility,
                largeText: !settings.accessibility.largeText
              })}
            >
              <View style={[
                styles.settingToggleThumb,
                {
                  backgroundColor: 'white',
                  transform: [{ translateX: settings.accessibility.largeText ? 20 : 2 }]
                }
              ]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Keyboard Navigation</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Enable full keyboard navigation support
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.settingToggle,
                { backgroundColor: settings.accessibility.keyboardNavigation ? colors.primary[500] : colors.neutral[200] }
              ]}
              onPress={() => updateSetting('accessibility', {
                ...settings.accessibility,
                keyboardNavigation: !settings.accessibility.keyboardNavigation
              })}
            >
              <View style={[
                styles.settingToggleThumb,
                {
                  backgroundColor: 'white',
                  transform: [{ translateX: settings.accessibility.keyboardNavigation ? 20 : 2 }]
                }
              ]} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Data Management */}
      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
        
        <View style={styles.dataActions}>
          <Button
            title="Export Data"
            variant="outline"
            icon={<Download size={16} color={colors.primary[500]} />}
            iconPosition="left"
            onPress={exportData}
            style={styles.dataActionButton}
          />
          <Button
            title="Import Data"
            variant="outline"
            icon={<Upload size={16} color={colors.primary[500]} />}
            iconPosition="left"
            onPress={importData}
            style={styles.dataActionButton}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.duration(400)}
          style={[styles.header, { borderBottomColor: colors.divider }]}
        >
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => router.back()}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={[styles.headerIcon, { backgroundColor: colors.primary[50] }]}>
              <Sparkles size={24} color={colors.primary[500]} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>AI Assistant</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Your intelligent learning companion
            </Text>
          </View>
          
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>

        {/* Tab Navigation */}
        <Animated.View 
          entering={SlideInDown.delay(200).duration(400)}
          style={[styles.tabNavigation, { backgroundColor: colors.neutral[50] }]}
        >
          {[
            { id: 'home', label: 'Home', icon: <Sparkles size={20} /> },
            { id: 'chat', label: 'Chat', icon: <MessageCircle size={20} /> },
            { id: 'tasks', label: 'Tasks', icon: <CheckCircle size={20} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                activeTab === tab.id && { backgroundColor: colors.primary[500] }
              ]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              {React.cloneElement(tab.icon, {
                color: activeTab === tab.id ? 'white' : colors.neutral[600]
              })}
              <Text style={[
                styles.tabLabel,
                {
                  color: activeTab === tab.id ? 'white' : colors.neutral[600]
                }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Tab Content */}
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  settingsButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  suggestionBanner: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  suggestionMessage: {
    fontSize: 14,
  },
  suggestionButton: {
    marginLeft: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  actionCard: {
    marginBottom: 16,
  },
  actionCardContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionCardBackground: {
    padding: 20,
    height: 140,
    justifyContent: 'space-between',
  },
  actionCardIcon: {
    alignSelf: 'flex-start',
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  featuresGrid: {
    paddingHorizontal: 20,
  },
  featureCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  insightCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightMessage: {
    fontSize: 14,
  },
  insightActions: {
    marginLeft: 12,
  },
  // Chat Tab Styles
  chatContainer: {
    flex: 1,
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatMessagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  chatInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 12,
    padding: 12,
  },
  chatTextInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  chatActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  // Tasks Tab Styles
  tasksList: {
    marginBottom: 24,
  },
  taskItem: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    marginRight: 12,
  },
  remindersSection: {
    marginTop: 24,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  addReminderButton: {
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  reminderTime: {
    fontSize: 14,
  },
  progressCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Settings Tab Styles
  settingsCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  settingValueText: {
    fontSize: 14,
    marginLeft: 6,
  },
  settingToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  settingToggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  dataActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  dataActionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});