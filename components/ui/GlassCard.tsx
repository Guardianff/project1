import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { MotionTokens } from '@/constants/DesignTokens';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate
} from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
  padding?: number;
  interactive?: boolean;
  onPress?: () => void;
}

export function GlassCard({
  children,
  style,
  intensity = 20,
  tint = 'default',
  borderRadius = 16,
  padding = 16,
  interactive = false,
  onPress,
}: GlassCardProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (!interactive) return;
    scale.value = withSpring(0.98, MotionTokens.spring.gentle);
    opacity.value = withSpring(1, MotionTokens.spring.gentle);
  };

  const handlePressOut = () => {
    if (!interactive) return;
    scale.value = withSpring(1, MotionTokens.spring.gentle);
    opacity.value = withSpring(0.8, MotionTokens.spring.gentle);
  };

  const getTint = () => {
    if (tint === 'default') {
      return isDarkMode ? 'dark' : 'light';
    }
    return tint;
  };

  const Container = interactive ? Animated.View : View;

  if (Platform.OS === 'web') {
    // Fallback for web - CSS backdrop-filter
    return (
      <Container
        style={[
          styles.webGlassCard,
          {
            backgroundColor: isDarkMode 
              ? 'rgba(30, 41, 59, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode 
              ? 'rgba(148, 163, 184, 0.2)' 
              : 'rgba(226, 232, 240, 0.8)',
            borderRadius,
            padding,
          },
          interactive && animatedStyle,
          style,
        ]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onPress={onPress}
      >
        {children}
      </Container>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { borderRadius },
        interactive && animatedStyle,
        style,
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      <BlurView
        intensity={intensity}
        tint={getTint()}
        style={[
          StyleSheet.absoluteFillObject,
          { borderRadius },
        ]}
      />
      <View
        style={[
          styles.content,
          {
            backgroundColor: isDarkMode 
              ? 'rgba(30, 41, 59, 0.3)' 
              : 'rgba(255, 255, 255, 0.3)',
            borderColor: isDarkMode 
              ? 'rgba(148, 163, 184, 0.2)' 
              : 'rgba(226, 232, 240, 0.8)',
            borderRadius,
            padding,
          },
        ]}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    borderWidth: 1,
  },
  webGlassCard: {
    borderWidth: 1,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
});