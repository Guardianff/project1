import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, Platform } from 'react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { DesignTokens } from '@/constants/DesignTokens';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';

interface InteractiveCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'featured' | 'compact' | 'hero';
  interactive?: boolean;
  glowOnHover?: boolean;
  tiltEffect?: boolean;
  scaleOnPress?: boolean;
  shadowLevel?: 'sm' | 'md' | 'lg' | 'xl';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function InteractiveCard({
  children,
  title,
  subtitle,
  onPress,
  style,
  variant = 'default',
  interactive = true,
  glowOnHover = false,
  tiltEffect = false,
  scaleOnPress = true,
  shadowLevel = 'md',
}: InteractiveCardProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  // Animation values
  const scale = useSharedValue(1);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const shadowElevation = useSharedValue(0);

  const shadowConfig = DesignTokens.shadows[shadowLevel];

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'featured':
        return {
          padding: 24,
          borderRadius: DesignTokens.borderRadius['2xl'],
          minHeight: 200,
        };
      case 'compact':
        return {
          padding: 12,
          borderRadius: DesignTokens.borderRadius.lg,
          minHeight: 80,
        };
      case 'hero':
        return {
          padding: 32,
          borderRadius: DesignTokens.borderRadius['3xl'],
          minHeight: 300,
        };
      case 'default':
      default:
        return {
          padding: 16,
          borderRadius: DesignTokens.borderRadius.xl,
          minHeight: 120,
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { perspective: 1000 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: glowOpacity.value * 0.8,
      shadowRadius: 24,
      elevation: glowOpacity.value * 15,
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(
        shadowElevation.value,
        [0, 1],
        [shadowConfig.shadowOpacity, shadowConfig.shadowOpacity * 2]
      ),
      shadowRadius: interpolate(
        shadowElevation.value,
        [0, 1],
        [shadowConfig.shadowRadius, shadowConfig.shadowRadius * 1.5]
      ),
      elevation: interpolate(
        shadowElevation.value,
        [0, 1],
        [shadowConfig.elevation, shadowConfig.elevation * 1.5]
      ),
    };
  });

  // Interaction handlers
  const handlePressIn = () => {
    if (!interactive) return;
    
    if (scaleOnPress) {
      scale.value = withSpring(0.98, DesignTokens.animations.spring.gentle);
    }
    
    shadowElevation.value = withTiming(1, { duration: 150 });
    
    if (glowOnHover) {
      glowOpacity.value = withTiming(1, { duration: 200 });
    }
    
    if (tiltEffect) {
      rotateX.value = withSpring(2, DesignTokens.animations.spring.gentle);
      rotateY.value = withSpring(2, DesignTokens.animations.spring.gentle);
    }
  };

  const handlePressOut = () => {
    if (!interactive) return;
    
    scale.value = withSpring(1, DesignTokens.animations.spring.gentle);
    shadowElevation.value = withTiming(0, { duration: 150 });
    
    if (glowOnHover) {
      glowOpacity.value = withTiming(0, { duration: 300 });
    }
    
    if (tiltEffect) {
      rotateX.value = withSpring(0, DesignTokens.animations.spring.gentle);
      rotateY.value = withSpring(0, DesignTokens.animations.spring.gentle);
    }
  };

  const handlePress = () => {
    // Add a subtle bounce effect
    if (scaleOnPress) {
      scale.value = withSpring(1.02, DesignTokens.animations.spring.wobbly);
      setTimeout(() => {
        scale.value = withSpring(1, DesignTokens.animations.spring.gentle);
      }, 100);
    }
    
    onPress?.();
  };

  const CardContainer = onPress ? AnimatedTouchable : Animated.View;

  return (
    <View style={[styles.wrapper, style]}>
      {/* Glow effect */}
      {glowOnHover && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'transparent',
              borderRadius: variantStyles.borderRadius,
            },
            glowStyle,
          ]}
        />
      )}
      
      <CardContainer
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            shadowColor: colors.neutral[900],
            ...shadowConfig,
          },
          variantStyles,
          shadowStyle,
          animatedStyle,
        ]}
        onPress={onPress ? handlePress : undefined}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Header */}
        {(title || subtitle) && (
          <View style={styles.header}>
            {title && (
              <Text style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
        )}
        
        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </CardContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  card: {
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'Inter, system-ui, sans-serif',
    }),
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'Inter, system-ui, sans-serif',
    }),
  },
  content: {
    flex: 1,
  },
});