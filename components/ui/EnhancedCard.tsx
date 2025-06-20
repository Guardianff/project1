import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, Platform } from 'react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'glass';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface EnhancedCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  interactive?: boolean;
  glowEffect?: boolean;
  borderRadius?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function EnhancedCard({
  children,
  variant = 'elevated',
  size = 'md',
  style,
  onPress,
  disabled = false,
  interactive = true,
  glowEffect = false,
  borderRadius,
}: EnhancedCardProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  // Animation values
  const scale = useSharedValue(1);
  const elevation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const borderWidth = useSharedValue(0);

  // Get variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.divider,
        };
      case 'filled':
        return {
          backgroundColor: colors.neutral[25],
          borderWidth: 0,
        };
      case 'glass':
        return {
          backgroundColor: isDarkMode 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          borderWidth: 1,
          borderColor: isDarkMode 
            ? 'rgba(148, 163, 184, 0.2)' 
            : 'rgba(226, 232, 240, 0.8)',
          backdropFilter: 'blur(12px)',
        };
      case 'elevated':
      default:
        return {
          backgroundColor: colors.background,
          shadowColor: colors.neutral[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 3,
        };
    }
  };

  // Get size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { padding: 12, borderRadius: borderRadius || 8 };
      case 'lg':
        return { padding: 20, borderRadius: borderRadius || 16 };
      case 'xl':
        return { padding: 24, borderRadius: borderRadius || 20 };
      case 'md':
      default:
        return { padding: 16, borderRadius: borderRadius || 12 };
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      shadowOpacity: variant === 'elevated' 
        ? interpolate(elevation.value, [0, 1], [isDarkMode ? 0.3 : 0.1, isDarkMode ? 0.5 : 0.2])
        : isDarkMode ? 0.3 : 0.1,
      shadowRadius: variant === 'elevated' 
        ? interpolate(elevation.value, [0, 1], [8, 16])
        : 8,
      elevation: variant === 'elevated' 
        ? interpolate(elevation.value, [0, 1], [3, 8])
        : 3,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: glowOpacity.value * 0.6,
      shadowRadius: 20,
      elevation: glowOpacity.value * 10,
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderWidth: borderWidth.value,
      borderColor: colors.primary[300],
    };
  });

  // Interaction handlers
  const handlePressIn = () => {
    if (!interactive || disabled) return;
    
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    elevation.value = withTiming(1, { duration: 150 });
    
    if (glowEffect) {
      glowOpacity.value = withTiming(1, { duration: 200 });
      borderWidth.value = withTiming(2, { duration: 200 });
    }
  };

  const handlePressOut = () => {
    if (!interactive || disabled) return;
    
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    elevation.value = withTiming(0, { duration: 150 });
    
    if (glowEffect) {
      glowOpacity.value = withTiming(0, { duration: 300 });
      borderWidth.value = withTiming(0, { duration: 300 });
    }
  };

  const CardContainer = onPress ? AnimatedTouchable : Animated.View;

  return (
    <View style={[styles.container, style]}>
      {glowEffect && (
        <Animated.View 
          style={[
            StyleSheet.absoluteFillObject,
            getSizeStyle(),
            glowStyle,
            { backgroundColor: 'transparent' }
          ]} 
        />
      )}
      <CardContainer
        style={[
          styles.card,
          getVariantStyle(),
          getSizeStyle(),
          animatedStyle,
          glowEffect && borderStyle,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        {children}
      </CardContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  card: {
    overflow: 'hidden',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  disabled: {
    opacity: 0.6,
  },
});