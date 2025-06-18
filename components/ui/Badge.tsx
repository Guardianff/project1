import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}: BadgeProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  // Get badge style based on variant
  const getBadgeStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary[100] };
      case 'success':
        return { backgroundColor: colors.success[100] };
      case 'warning':
        return { backgroundColor: colors.warning[100] };
      case 'error':
        return { backgroundColor: colors.error[100] };
      case 'neutral':
        return { backgroundColor: colors.neutral[100] };
      case 'primary':
      default:
        return { backgroundColor: colors.primary[100] };
    }
  };

  // Get text style based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return { color: colors.secondary[700] };
      case 'success':
        return { color: colors.success[700] };
      case 'warning':
        return { color: colors.warning[700] };
      case 'error':
        return { color: colors.error[700] };
      case 'neutral':
        return { color: colors.neutral[700] };
      case 'primary':
      default:
        return { color: colors.primary[700] };
    }
  };

  // Get size style
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallBadge;
      case 'large':
        return styles.largeBadge;
      case 'medium':
      default:
        return styles.mediumBadge;
    }
  };

  // Get text size style
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      case 'medium':
      default:
        return styles.mediumText;
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle(), getSizeStyle(), style]}>
      <Text style={[styles.text, getTextStyle(), getTextSizeStyle(), textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  // Sizes
  smallBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  mediumBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  largeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  // Text sizes
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});