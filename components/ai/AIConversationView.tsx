import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Send, Mic, Sparkles, User, Bot } from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useAIAgent } from '@/context/AIAgentContext';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

interface AIConversationViewProps {
  placeholder?: string;
  showWelcomeMessage?: boolean;
  maxHeight?: number | string;
  style?: any;
}

export function AIConversationView({
  placeholder = 'Ask me anything...',
  showWelcomeMessage = true,
  maxHeight,
  style,
}: AIConversationViewProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const {
    conversationHistory,
    isProcessing,
    sendMessage,
    getPersonalizedGreeting,
  } = useAIAgent();
  
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (conversationHistory.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversationHistory]);
  
  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    sendMessage(inputText);
    setInputText('');
  };
  
  const handleVoiceInput = () => {
    // Toggle voice recording
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // In a real implementation, this would start voice recording
      // For this demo, we'll simulate voice input after a delay
      setTimeout(() => {
        setInputText('What courses do you recommend for me?');
        setIsRecording(false);
      }, 2000);
    }
  };
  
  const renderMessage = (entry: any, index: number) => {
    const isUser = entry.isUser;
    const isLastMessage = index === conversationHistory.length - 1;
    
    return (
      <Animated.View
        key={entry.id}
        entering={isUser ? FadeInUp.duration(300) : FadeInDown.duration(300)}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        <View style={[
          styles.avatarContainer,
          { backgroundColor: isUser ? colors.primary[100] : colors.neutral[100] }
        ]}>
          {isUser ? (
            <User size={16} color={colors.primary[500]} />
          ) : (
            <Bot size={16} color={colors.neutral[500]} />
          )}
        </View>
        
        <View style={[
          styles.messageBubble,
          isUser 
            ? { backgroundColor: colors.primary[500] } 
            : { backgroundColor: colors.neutral[100] }
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? { color: 'white' } : { color: colors.text }
          ]}>
            {entry.message}
          </Text>
          
          <Text style={[
            styles.messageTime,
            isUser ? { color: 'rgba(255,255,255,0.7)' } : { color: colors.textSecondary }
          ]}>
            {formatTime(entry.timestamp)}
          </Text>
        </View>
      </Animated.View>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        style={[styles.messagesContainer, maxHeight ? { maxHeight } : null]}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome message */}
        {showWelcomeMessage && conversationHistory.length === 0 && (
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={styles.welcomeContainer}
          >
            <View style={[styles.welcomeIconContainer, { backgroundColor: colors.primary[50] }]}>
              <Sparkles size={24} color={colors.primary[500]} />
            </View>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              AI Learning Assistant
            </Text>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
              {getPersonalizedGreeting()} I can help you find courses, track your progress, and answer questions about your learning journey.
            </Text>
            
            <View style={styles.suggestedQuestions}>
              {[
                "What courses do you recommend for me?",
                "How's my learning progress?",
                "What should I learn next?",
                "Help me set learning goals"
              ].map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestedQuestion, { backgroundColor: colors.primary[50] }]}
                  onPress={() => sendMessage(question)}
                >
                  <Text style={[styles.suggestedQuestionText, { color: colors.primary[700] }]}>
                    {question}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
        
        {/* Conversation messages */}
        {conversationHistory.map(renderMessage)}
        
        {/* Processing indicator */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <View style={[
              styles.avatarContainer,
              { backgroundColor: colors.neutral[100] }
            ]}>
              <Bot size={16} color={colors.neutral[500]} />
            </View>
            <View style={[styles.processingBubble, { backgroundColor: colors.neutral[100] }]}>
              <ActivityIndicator size="small" color={colors.primary[500]} />
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Input area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={[styles.inputContainer, { backgroundColor: colors.neutral[50] }]}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.text }]}
            placeholder={placeholder}
            placeholderTextColor={colors.neutral[400]}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                isRecording ? { backgroundColor: colors.error[500] } : { backgroundColor: colors.neutral[200] }
              ]}
              onPress={handleVoiceInput}
            >
              <Mic size={20} color={isRecording ? 'white' : colors.neutral[600]} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                inputText.trim() ? { backgroundColor: colors.primary[500] } : { backgroundColor: colors.neutral[200] }
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={20} color={inputText.trim() ? 'white' : colors.neutral[600]} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// Helper function to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  suggestedQuestions: {
    width: '100%',
  },
  suggestedQuestion: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestedQuestionText: {
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '90%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  processingContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  processingBubble: {
    padding: 12,
    borderRadius: 16,
    width: 60,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});