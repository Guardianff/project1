import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  TrendingUp, 
  Award, 
  Sparkles, 
  Bell, 
  X, 
  ChevronRight, 
  Flame, 
  Target, 
  Zap, 
  BookOpen 
} from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useAIAgent } from '@/context/AIAgentContext';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface AIInsightCardProps {
  insight: {
    id: string;
    type: 'streak' | 'progress' | 'achievement' | 'recommendation' | 'reminder';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    timestamp: Date;
    metadata?: Record<string, any>;
  };
  onPress?: () => void;
  onDismiss?: () => void;
}

export function AIInsightCard({ insight, onPress, onDismiss }: AIInsightCardProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { dismissInsight } = useAIAgent();
  
  const getInsightIcon = () => {
    switch (insight.type) {
      case 'streak':
        return <Flame size={24} color={colors.warning[500]} />;
      case 'progress':
        return <TrendingUp size={24} color={colors.success[500]} />;
      case 'achievement':
        return <Award size={24} color={colors.secondary[500]} />;
      case 'recommendation':
        return <Sparkles size={24} color={colors.primary[500]} />;
      case 'reminder':
        return <Bell size={24} color={colors.accent[500]} />;
      default:
        return <Zap size={24} color={colors.primary[500]} />;
    }
  };
  
  const getInsightColor = () => {
    switch (insight.type) {
      case 'streak':
        return colors.warning;
      case 'progress':
        return colors.success;
      case 'achievement':
        return colors.secondary;
      case 'recommendation':
        return colors.primary;
      case 'reminder':
        return colors.accent;
      default:
        return colors.primary;
    }
  };
  
  const getPriorityStyle = () => {
    switch (insight.priority) {
      case 'high':
        return { borderLeftWidth: 4, borderLeftColor: getInsightColor()[500] };
      case 'medium':
        return { borderLeftWidth: 2, borderLeftColor: getInsightColor()[500] };
      case 'low':
      default:
        return {};
    }
  };
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/ai-assistant');
    }
  };
  
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      dismissInsight(insight.id);
    }
  };
  
  const insightColor = getInsightColor();
  
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={[
        styles.container,
        { backgroundColor: colors.background },
        getPriorityStyle()
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: insightColor[50] }]}>
          {getInsightIcon()}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {insight.title}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {insight.description}
          </Text>
          <Text style={[styles.timestamp, { color: colors.neutral[400] }]}>
            {formatTimestamp(insight.timestamp)}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.dismissButton, { backgroundColor: colors.neutral[100] }]}
            onPress={handleDismiss}
          >
            <X size={16} color={colors.neutral[500]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: insightColor[50] }]}
            onPress={handlePress}
          >
            <ChevronRight size={16} color={insightColor[500]} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Helper function to format timestamp
function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return timestamp.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  dismissButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});