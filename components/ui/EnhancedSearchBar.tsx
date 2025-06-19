import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  Dimensions,
} from 'react-native';
import { Search, X, Filter } from 'lucide-react-native';
import { DesignTokens, AccessibilityTokens } from '@/constants/DesignSystem';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

interface EnhancedSearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  autoFocus?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export function EnhancedSearchBar({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSubmit,
  onClear,
  onFilterPress,
  showFilter = false,
  autoFocus = false,
}: EnhancedSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? DesignTokens.colors : DesignTokens.colors;
  const inputRef = useRef<TextInput>(null);
  
  // Animation values
  const focusAnimation = useSharedValue(0);
  const borderAnimation = useSharedValue(0);
  
  // Animated styles
  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        borderAnimation.value,
        [0, 1],
        [colors.neutral[200], colors.primary[400]]
      ),
      backgroundColor: interpolateColor(
        focusAnimation.value,
        [0, 1],
        [colors.neutral[50], colors.neutral[0]]
      ),
      transform: [
        {
          scale: withSpring(isFocused ? 1.02 : 1, {
            damping: 20,
            stiffness: 300,
          }),
        },
      ],
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1, { duration: 200 });
    borderAnimation.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnimation.value = withTiming(0, { duration: 200 });
    borderAnimation.value = withTiming(0, { duration: 200 });
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.searchIcon}>
        <Search 
          size={20} 
          color={isFocused ? colors.primary[500] : colors.neutral[400]} 
        />
      </View>
      
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            color: colors.neutral[900],
            fontSize: DesignTokens.typography.fontSizes.base,
            fontFamily: DesignTokens.typography.fontFamilies.sans[0],
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[400]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        clearButtonMode="never"
        autoFocus={autoFocus}
        accessibilityLabel="Search input"
        accessibilityHint="Enter text to search for courses"
        {...Platform.select({
          web: {
            style: { outlineWidth: 0 },
          },
        })}
      />
      
      <View style={styles.actions}>
        {value.length > 0 && (
          <TouchableOpacity 
            onPress={handleClear} 
            style={styles.actionButton}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <X size={18} color={colors.neutral[500]} />
          </TouchableOpacity>
        )}
        
        {showFilter && (
          <TouchableOpacity 
            onPress={onFilterPress} 
            style={[
              styles.actionButton,
              styles.filterButton,
              { backgroundColor: colors.primary[50] },
            ]}
            accessibilityLabel="Open filters"
            accessibilityRole="button"
          >
            <Filter size={18} color={colors.primary[600]} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: DesignTokens.borderRadius.xl,
    paddingHorizontal: DesignTokens.spacing[4],
    paddingVertical: DesignTokens.spacing[3],
    marginHorizontal: DesignTokens.spacing[4],
    marginVertical: DesignTokens.spacing[2],
    borderWidth: 2,
    minHeight: AccessibilityTokens.minTouchTarget,
    ...DesignTokens.shadows.sm,
  },
  searchIcon: {
    marginRight: DesignTokens.spacing[3],
  },
  input: {
    flex: 1,
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing[2],
  },
  actionButton: {
    padding: DesignTokens.spacing[2],
    borderRadius: DesignTokens.borderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: AccessibilityTokens.minTouchTarget,
    minHeight: AccessibilityTokens.minTouchTarget,
  },
  filterButton: {
    marginLeft: DesignTokens.spacing[1],
  },
});