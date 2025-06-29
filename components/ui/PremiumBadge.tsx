import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface PremiumBadgeProps {
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function PremiumBadge({ 
  onPress, 
  size = 'medium',
  showLabel = true
}: PremiumBadgeProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/premium');
    }
  };

  // Get size dimensions
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
          icon: 12,
          text: { fontSize: 10, marginLeft: 4 }
        };
      case 'large':
        return {
          container: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
          icon: 20,
          text: { fontSize: 16, marginLeft: 8, fontWeight: '600' as const }
        };
      case 'medium':
      default:
        return {
          container: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
          icon: 16,
          text: { fontSize: 12, marginLeft: 6 }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.primary[500] },
        sizeStyles.container
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Sparkles size={sizeStyles.icon} color="white" />
      {showLabel && (
        <Text style={[styles.text, sizeStyles.text]}>
          Premium
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '500',
  },
});