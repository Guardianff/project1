import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  Dimensions 
} from 'react-native';
import { Search, X, Filter, Mic } from 'lucide-react-native';
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

interface EnhancedSearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  onVoicePress?: () => void;
  showFilter?: boolean;
  showVoice?: boolean;
  autoFocus?: boolean;
  variant?: 'default' | 'prominent' | 'minimal';
}

const { width: screenWidth } = Dimensions.get('window');

export function EnhancedSearchBar({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSubmit,
  onClear,
  onFilterPress,
  onVoicePress,
  showFilter = false,
  showVoice = false,
  autoFocus = false,
  variant = 'default',
}: EnhancedSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const inputRef = useRef<TextInput>(null);
  
  // Animation values
  const focusAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(1);
  const widthAnimation = useSharedValue(screenWidth - 32);

  React.useEffect(() => {
    focusAnimation.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 300,
    });
  }, [isFocused]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'prominent':
        return {
          height: 56,
          borderRadius: 16,
          paddingHorizontal: 20,
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 6,
        };
      case 'minimal':
        return {
          height: 40,
          borderRadius: 8,
          paddingHorizontal: 12,
          shadowOpacity: 0,
          elevation: 0,
          borderWidth: 1,
        };
      case 'default':
      default:
        return {
          height: 48,
          borderRadius: 12,
          paddingHorizontal: 16,
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Animated styles
  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      focusAnimation.value,
      [0, 1],
      [
        isDarkMode ? colors.neutral[800] : colors.neutral[50],
        isDarkMode ? colors.neutral[700] : colors.background,
      ]
    );

    const borderColor = interpolate(
      focusAnimation.value,
      [0, 1],
      [
        variant === 'minimal' ? colors.neutral[300] : 'transparent',
        colors.primary[300],
      ]
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: scaleAnimation.value }],
      width: widthAnimation.value,
      shadowOpacity: interpolate(
        focusAnimation.value,
        [0, 1],
        [variantStyles.shadowOpacity, variantStyles.shadowOpacity * 2]
      ),
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const color = interpolate(
      focusAnimation.value,
      [0, 1],
      [colors.neutral[400], colors.primary[500]]
    );

    return {
      tintColor: color,
    };
  });

  // Handlers
  const handleFocus = () => {
    setIsFocused(true);
    scaleAnimation.value = withSpring(1.02, { damping: 15, stiffness: 300 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    scaleAnimation.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    inputRef.current?.blur();
    onSubmit?.();
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          variantStyles,
          {
            shadowColor: colors.neutral[900],
            shadowOffset: { width: 0, height: 2 },
            borderWidth: variant === 'minimal' ? 1 : 0,
          },
          containerStyle,
        ]}
      >
        {/* Search Icon */}
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <Search 
            size={20} 
            color={isFocused ? colors.primary[500] : colors.neutral[400]} 
          />
        </Animated.View>

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: colors.text,
              fontSize: variant === 'prominent' ? 18 : 16,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          clearButtonMode="never"
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Clear Button */}
          {value.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={[styles.actionButton, { backgroundColor: colors.neutral[200] }]}
            >
              <X size={16} color={colors.neutral[600]} />
            </TouchableOpacity>
          )}

          {/* Voice Button */}
          {showVoice && (
            <TouchableOpacity
              onPress={onVoicePress}
              style={[styles.actionButton, { backgroundColor: colors.primary[50] }]}
            >
              <Mic size={16} color={colors.primary[500]} />
            </TouchableOpacity>
          )}

          {/* Filter Button */}
          {showFilter && (
            <TouchableOpacity
              onPress={onFilterPress}
              style={[styles.actionButton, { backgroundColor: colors.neutral[100] }]}
            >
              <Filter size={16} color={colors.neutral[600]} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});