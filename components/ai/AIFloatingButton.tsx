import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bot, Sparkles } from 'lucide-react-native';
import { useAI } from '@/context/AIContext';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export function AIFloatingButton() {
  const router = useRouter();
  const { aiSuggestion } = useAI();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const handlePress = () => {
    // Add haptic feedback for web
    if (Platform.OS === 'web' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    router.push('/ai-assistant');
  };

  return (
    <FloatingActionButton
      onPress={handlePress}
      size="lg"
      variant="primary"
      position="bottom-right"
      pulse={!!aiSuggestion}
      glow={!!aiSuggestion}
      offset={{ bottom: 100, right: 20 }}
    >
      <Sparkles size={28} color="white" strokeWidth={2} />
    </FloatingActionButton>
  );
}
