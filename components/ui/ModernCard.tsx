import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { getThemeColors, DesignTokens, MotionTokens } from '@/constants/theme';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'glass' | 'gradient';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModernCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  interactive?: boolean;
  glowEffect?: boolean;
  hoverEffect?: boolean;
  borderRadius?: keyof typeof DesignTokens.borderRadius;
  gradient?: string[];
  shadowLevel?: keyof typeof DesignTokens.shadows;
}

const AnimatedTouchable = Animated.createAnimatedComponent(
  Platform.OS === 'web' ? View : require('react-native').TouchableOpacity
);

export function ModernCard({
  children,
  variant = 'elevated',
  size = 'md',
  style,
  onPress,
  disabled = false,
  interactive = true,
  glowEffect = false,
  hoverEffect = true,
  borderRadius = 'xl',
  gradient,
  shadowLevel = 'md',
}: ModernCardProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  // Animation values
  const scale = useSharedValue(1);
  const elevation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const borderWidth = useSharedValue(0);
  const rotateY = useSharedValue(0);

  // Get size configuration
  const sizeConfig = DesignTokens.components.card.sizes[size];
  const shadowConfig = DesignTokens.shadows[shadowLevel];

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
      case 'gradient':
        return {
          backgroundColor: gradient ? 'transparent' : colors.primary[500],
          borderWidth: 0,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: colors.background,
          ...shadowConfig,
        };
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { perspective: 1000 },
        { rotateY: `${rotateY.value}deg` },
      ],
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

  const elevationStyle = useAnimatedStyle(() => {
    if (variant !== 'elevated') return {};
    
    return {
      shadowOpacity: interpolate(elevation.value, [0, 1], [shadowConfig.shadowOpacity, shadowConfig.shadowOpacity * 2]),
      shadowRadius: interpolate(elevation.value, [0, 1], [shadowConfig.shadowRadius, shadowConfig.shadowRadius * 1.5]),
      elevation: interpolate(elevation.value, [0, 1], [shadowConfig.elevation, shadowConfig.elevation * 1.5]),
    };
  });

  // Interaction handlers
  const handlePressIn = () => {
    if (!interactive || disabled) return;
    
    scale.value = withSpring(0.98, MotionTokens.spring.gentle);
    elevation.value = withTiming(1, { duration: 150 });
    
    if (glowEffect) {
      glowOpacity.value = withTiming(1, { duration: 200 });
      borderWidth.value = withTiming(2, { duration: 200 });
    }
    
    if (hoverEffect) {
      rotateY.value = withSpring(2, MotionTokens.spring.gentle);
    }
  };

  const handlePressOut = () => {
    if (!interactive || disabled) return;
    
    scale.value = withSpring(1, MotionTokens.spring.gentle);
    elevation.value = withTiming(0, { duration: 150 });
    
    if (glowEffect) {
      glowOpacity.value = withTiming(0, { duration: 300 });
      borderWidth.value = withTiming(0, { duration: 300 });
    }
    
    if (hoverEffect) {
      rotateY.value = withSpring(0, MotionTokens.spring.gentle);
    }
  };

  const handlePress = () => {
    if (disabled) return;
    
    // Add a subtle bounce effect
    scale.value = withSpring(1.02, MotionTokens.spring.wobbly);
    setTimeout(() => {
      scale.value = withSpring(1, MotionTokens.spring.gentle);
    }, 100);
    
    onPress?.();
  };

  const CardContainer = onPress ? AnimatedTouchable : Animated.View;

  return (
    <View style={[styles.container, style]}>
      {/* Glow effect */}
      {glowEffect && (
        <Animated.View 
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: DesignTokens.borderRadius[borderRadius],
              backgroundColor: 'transparent',
            },
            glowStyle,
          ]} 
        />
      )}
      
      {/* Gradient background */}
      {variant === 'gradient' && gradient && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: DesignTokens.borderRadius[borderRadius],
              background: `linear-gradient(135deg, ${gradient.join(', ')})`,
              backgroundColor: gradient[0], // Fallback for React Native
            },
          ]}
        />
      )}
      
      <CardContainer
        style={[
          styles.card,
          {
            padding: sizeConfig.padding,
            borderRadius: DesignTokens.borderRadius[borderRadius],
          },
          getVariantStyle(),
          elevationStyle,
          glowEffect && borderStyle,
          animatedStyle,
          disabled && styles.disabled,
        ]}
        onPress={onPress ? handlePress : undefined}
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
