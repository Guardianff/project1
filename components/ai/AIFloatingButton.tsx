import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bot } from 'lucide-react-native';
import { useAI } from '@/context/AIContext';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function AIFloatingButton() {
  const router = useRouter();
  const { aiSuggestion } = useAI();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  // Breathing animation
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  
  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  // Pulse animation when there's an AI suggestion
  React.useEffect(() => {
    if (aiSuggestion) {
      pulseScale.value = withRepeat(
        withSpring(1.2, { damping: 10, stiffness: 100 }),
        3,
        true
      );
    }
  }, [aiSuggestion]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scale.value,
            [1, 1.1],
            [1, 1.05]
          ) * pulseScale.value,
        },
      ],
    };
  });

  const handlePress = () => {
    // Add haptic feedback for web
    if (Platform.OS === 'web' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    router.push('/ai-assistant');
  };

  return (
    <AnimatedTouchable
      style={[
        styles.container,
        {
          backgroundColor: colors.primary[500],
          shadowColor: colors.primary[500],
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityLabel="Open AI Assistant"
      accessibilityHint="Tap to open the AI assistant for help with learning and tasks"
      accessibilityRole="button"
    >
      <Bot size={28} color="white" strokeWidth={2} />
      
      {/* Notification indicator for AI suggestions */}
      {aiSuggestion && (
        <Animated.View 
          style={[
            styles.notificationDot,
            { backgroundColor: colors.warning[500] }
          ]}
          entering={withSpring(1, { damping: 10, stiffness: 200 })}
        />
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 100 : 120,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
});