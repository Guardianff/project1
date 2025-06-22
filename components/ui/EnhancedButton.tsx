import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
  View
} from 'react-native';
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

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
  rounded?: boolean;
  shadow?: boolean;
  glow?: boolean;
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
  rounded = false,
  shadow = true,
  glow = false,
}: EnhancedButtonProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  // Animation values
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const shadowElevation = useSharedValue(0);
  
  // Get size configuration
  const sizeConfig = DesignTokens.components.button.sizes[size];
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      shadowOpacity: glowOpacity.value * 0.6,
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(shadowElevation.value, [0, 1], [0.1, 0.3]),
      shadowRadius: interpolate(shadowElevation.value, [0, 1], [4, 12]),
      elevation: interpolate(shadowElevation.value, [0, 1], [2, 8]),
    };
  });

  // Handle press animation
  const handlePressIn = () => {
    if (disabled || loading) return;
    
    scale.value = withSpring(0.96, DesignTokens.animations.spring.gentle);
    shadowElevation.value = withTiming(1, { duration: 150 });
    
    if (glow) {
      glowOpacity.value = withTiming(1, { duration: 200 });
    }
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    
    scale.value = withSpring(1, DesignTokens.animations.spring.gentle);
    shadowElevation.value = withTiming(0, { duration: 150 });
    
    if (glow) {
      glowOpacity.value = withTiming(0, { duration: 300 });
    }
  };

  // Get variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary[500],
          borderColor: colors.secondary[500],
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary[500],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          paddingHorizontal: 0,
        };
      case 'destructive':
        return {
          backgroundColor: colors.error[500],
          borderColor: colors.error[500],
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary[500],
          borderColor: colors.primary[500],
        };
    }
  };

  // Get text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return colors.primary[500];
      case 'ghost':
        return colors.primary[500];
      case 'link':
        return colors.primary[500];
      case 'secondary':
        return 'white';
      case 'destructive':
        return 'white';
      case 'primary':
      default:
        return 'white';
    }
  };

  // Disabled styles
  const disabledStyle = disabled ? {
    backgroundColor: colors.neutral[200],
    borderColor: colors.neutral[300],
    opacity: 0.6,
  } : {};
  
  const disabledTextColor = disabled ? colors.neutral[500] : getTextColor();

  return (
    <View style={[fullWidth && { width: '100%' }]}>
      {/* Glow effect */}
      {glow && !disabled && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: getVariantStyle().backgroundColor,
              borderRadius: rounded ? sizeConfig.height / 2 : DesignTokens.borderRadius.lg,
              shadowColor: getVariantStyle().backgroundColor,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 20,
              elevation: 10,
            },
            glowStyle,
          ]}
        />
      )}
      
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          {
            height: sizeConfig.height,
            paddingHorizontal: variant === 'link' ? 0 : sizeConfig.paddingHorizontal,
            borderRadius: rounded ? sizeConfig.height / 2 : DesignTokens.borderRadius.lg,
          },
          getVariantStyle(),
          shadow && !disabled && shadowStyle,
          disabledStyle,
          animatedStyle,
          fullWidth && { width: '100%' },
          style,
        ]}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator 
            color={disabledTextColor} 
            size={size === 'xs' || size === 'sm' ? 'small' : 'small'} 
          />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <View style={[styles.iconContainer, { marginRight: 8 }]}>
                {React.cloneElement(icon as React.ReactElement, {
                  color: disabledTextColor,
                  size: sizeConfig.fontSize,
                })}
              </View>
            )}
            
            <Text
              style={[
                styles.text,
                {
                  fontSize: sizeConfig.fontSize,
                  color: disabledTextColor,
                  fontWeight: variant === 'link' ? '500' : '600',
                  textDecorationLine: variant === 'link' ? 'underline' : 'none',
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
            
            {icon && iconPosition === 'right' && (
              <View style={[styles.iconContainer, { marginLeft: 8 }]}>
                {React.cloneElement(icon as React.ReactElement, {
                  color: disabledTextColor,
                  size: sizeConfig.fontSize,
                })}
              </View>
            )}
          </View>
        )}
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'Inter, system-ui, sans-serif',
    }),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});