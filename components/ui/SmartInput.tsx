import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Text,
  TouchableOpacity, 
  Platform,
  ViewStyle,
  TextStyle
} from 'react-native';
import { getThemeColors, DesignTokens, MotionTokens } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  interpolateColor
} from 'react-native-reanimated';

interface SmartInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  variant?: 'default' | 'filled' | 'outlined' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  autoFocus?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
}

export function SmartInput({
  label,
  placeholder,
  value,
  onChangeText,
  onFocus,
  onBlur,
  variant = 'outlined',
  size = 'md',
  error,
  helperText,
  leftIcon,
  rightIcon,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  autoFocus = false,
  style,
  inputStyle,
  secureTextEntry = false,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
}: SmartInputProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  // Animation values
  const focusAnimation = useSharedValue(0);
  const labelAnimation = useSharedValue(value ? 1 : 0);
  const errorAnimation = useSharedValue(0);

  // Get size configuration
  const sizeConfig = DesignTokens.components.input.sizes[size];

  useEffect(() => {
    focusAnimation.value = withSpring(isFocused ? 1 : 0, MotionTokens.spring.gentle);
  }, [isFocused]);

  useEffect(() => {
    labelAnimation.value = withSpring(
      (isFocused || value) ? 1 : 0, 
      MotionTokens.spring.gentle
    );
  }, [isFocused, value]);

  useEffect(() => {
    errorAnimation.value = withTiming(error ? 1 : 0, { duration: 200 });
  }, [error]);

  // Get variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.neutral[50],
          borderWidth: 0,
          borderBottomWidth: 2,
          borderBottomColor: isFocused ? colors.primary[500] : colors.neutral[300],
          borderRadius: DesignTokens.borderRadius.lg,
        };
      case 'underlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderBottomWidth: 2,
          borderBottomColor: isFocused ? colors.primary[500] : colors.neutral[300],
          borderRadius: 0,
        };
      case 'default':
        return {
          backgroundColor: colors.neutral[25],
          borderWidth: 1,
          borderColor: isFocused ? colors.primary[500] : colors.neutral[300],
          borderRadius: DesignTokens.borderRadius.lg,
        };
      case 'outlined':
      default:
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: error 
            ? colors.error[500] 
            : isFocused 
              ? colors.primary[500] 
              : colors.neutral[300],
          borderRadius: DesignTokens.borderRadius.lg,
        };
    }
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => {
    const borderColor = error 
      ? colors.error[500]
      : interpolateColor(
          focusAnimation.value,
          [0, 1],
          [colors.neutral[300], colors.primary[500]]
        );

    return {
      borderColor,
      shadowOpacity: interpolate(focusAnimation.value, [0, 1], [0, 0.1]),
      shadowRadius: interpolate(focusAnimation.value, [0, 1], [0, 8]),
      elevation: interpolate(focusAnimation.value, [0, 1], [0, 2]),
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const translateY = interpolate(labelAnimation.value, [0, 1], [0, -24]);
    const scale = interpolate(labelAnimation.value, [0, 1], [1, 0.85]);
    const color = error 
      ? colors.error[500]
      : interpolateColor(
          focusAnimation.value,
          [0, 1],
          [colors.neutral[500], colors.primary[500]]
        );

    return {
      transform: [
        { translateY },
        { scale },
      ],
      color,
    };
  });

  const errorStyle = useAnimatedStyle(() => {
    const opacity = errorAnimation.value;
    const translateY = interpolate(errorAnimation.value, [0, 1], [-10, 0]);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Handlers
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <View style={[styles.wrapper, style]}>
      {/* Label */}
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              fontSize: sizeConfig.fontSize,
              color: colors.neutral[600],
            },
            labelStyle,
          ]}
        >
          {label}
        </Animated.Text>
      )}

      {/* Input Container */}
      <Animated.View
        style={[
          styles.container,
          {
            height: multiline ? undefined : sizeConfig.height,
            minHeight: multiline ? sizeConfig.height * numberOfLines : sizeConfig.height,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            shadowColor: colors.primary[500],
          },
          getVariantStyle(),
          containerStyle,
          disabled && styles.disabled,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={[styles.iconContainer, styles.leftIcon]}>
            {React.cloneElement(leftIcon as React.ReactElement, {
              color: isFocused ? colors.primary[500] : colors.neutral[400],
              size: sizeConfig.fontSize,
            })}
          </View>
        )}

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              fontSize: sizeConfig.fontSize,
              color: colors.text,
              paddingTop: multiline ? 12 : 0,
              paddingBottom: multiline ? 12 : 0,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoFocus={autoFocus}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Right Icon */}
        {rightIcon && (
          <View style={[styles.iconContainer, styles.rightIcon]}>
            {React.cloneElement(rightIcon as React.ReactElement, {
              color: isFocused ? colors.primary[500] : colors.neutral[400],
              size: sizeConfig.fontSize,
            })}
          </View>
        )}
      </Animated.View>

      {/* Error Message */}
      {error && (
        <Animated.Text
          style={[
            styles.errorText,
            {
              color: colors.error[500],
              fontSize: sizeConfig.fontSize - 2,
            },
            errorStyle,
          ]}
        >
          {error}
        </Animated.Text>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <Text
          style={[
            styles.helperText,
            {
              color: colors.neutral[500],
              fontSize: sizeConfig.fontSize - 2,
            },
          ]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'Inter, system-ui, sans-serif',
    }),
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 16,
    fontWeight: '500',
  },
  helperText: {
    marginTop: 4,
    marginLeft: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
