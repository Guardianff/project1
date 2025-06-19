import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { DesignTokens } from '@/constants/DesignSystem';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface EnhancedCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  style?: ViewStyle;
  onPress?: () => void;
  animationDelay?: number;
  interactive?: boolean;
}

export function EnhancedCard({
  children,
  variant = 'elevated',
  size = 'md',
  style,
  onPress,
  animationDelay = 0,
  interactive = false,
}: EnhancedCardProps) {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? DesignTokens.colors : DesignTokens.colors;
  
  const sizeConfig = DesignTokens.ComponentVariants.card.sizes[size];
  
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: isDarkMode ? colors.neutral[800] : colors.neutral[0],
      borderRadius: sizeConfig.borderRadius,
      padding: sizeConfig.padding,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...DesignTokens.shadows.md,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDarkMode ? colors.neutral[700] : colors.neutral[200],
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: isDarkMode ? colors.neutral[900] : colors.neutral[50],
        };
      default:
        return baseStyle;
    }
  };

  const interactiveStyle = interactive ? {
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      },
    }),
  } : {};

  const CardComponent = onPress ? Animated.createAnimatedComponent(View) : Animated.View;

  return (
    <CardComponent
      entering={FadeInUp.delay(animationDelay).duration(400).springify()}
      style={[
        styles.card,
        getCardStyle(),
        interactiveStyle,
        style,
      ]}
      onTouchEnd={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});