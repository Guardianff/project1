import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
  View,
} from 'react-native';
import { DesignTokens, AccessibilityTokens } from '@/constants/DesignSystem';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface EnhancedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function EnhancedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
}: EnhancedButtonProps) {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? DesignTokens.colors : DesignTokens.colors;
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const backgroundColor = useSharedValue(0);
  
  // Get size configuration
  const sizeConfig = DesignTokens.ComponentVariants.button.sizes[size];
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const bgColors = getBackgroundColors();
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      backgroundColor: interpolateColor(
        backgroundColor.value,
        [0, 1],
        [bgColors.normal, bgColors.pressed]
      ),
    };
  });

  // Get colors based on variant
  const getBackgroundColors = () => {
    switch (variant) {
      case 'primary':
        return {
          normal: colors.primary[500],
          pressed: colors.primary[600],
          disabled: colors.neutral[200],
        };
      case 'secondary':
        return {
          normal: colors.secondary[100],
          pressed: colors.secondary[200],
          disabled: colors.neutral[100],
        };
      case 'outline':
        return {
          normal: 'transparent',
          pressed: colors.primary[50],
          disabled: 'transparent',
        };
      case 'ghost':
        return {
          normal: 'transparent',
          pressed: colors.neutral[100],
          disabled: 'transparent',
        };
      case 'destructive':
        return {
          normal: colors.error[500],
          pressed: colors.error[600],
          disabled: colors.neutral[200],
        };
      default:
        return {
          normal: colors.primary[500],
          pressed: colors.primary[600],
          disabled: colors.neutral[200],
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.neutral[400];
    
    switch (variant) {
      case 'primary':
      case 'destructive':
        return colors.neutral[0];
      case 'secondary':
        return colors.secondary[700];
      case 'outline':
        return colors.primary[600];
      case 'ghost':
        return colors.neutral[700];
      default:
        return colors.neutral[0];
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled ? colors.neutral[200] : colors.primary[300],
      };
    }
    return {};
  };

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    backgroundColor.value = withTiming(1, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    backgroundColor.value = withTiming(0, { duration: 200 });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: DesignTokens.borderRadius.md,
          minHeight: AccessibilityTokens.minTouchTarget,
        },
        getBorderStyle(),
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator 
          color={getTextColor()} 
          size="small" 
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={[styles.iconContainer, styles.iconLeft]}>
              {icon}
            </View>
          )}
          <Text
            style={[
              styles.text,
              {
                fontSize: sizeConfig.fontSize,
                color: getTextColor(),
                fontFamily: DesignTokens.typography.fontFamilies.sans[0],
                fontWeight: DesignTokens.typography.fontWeights.semibold,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={[styles.iconContainer, styles.iconRight]}>
              {icon}
            </View>
          )}
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: DesignTokens.spacing[2],
  },
  iconRight: {
    marginLeft: DesignTokens.spacing[2],
  },
});