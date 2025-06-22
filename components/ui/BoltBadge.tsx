import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, Platform, Dimensions } from 'react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

interface BoltBadgeProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center';
  variant?: 'white' | 'black' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export function BoltBadge({ 
  position = 'bottom-right', 
  variant = 'white',
  size = 'small' 
}: BoltBadgeProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  // Automatically select the best variant based on theme if not specified
  const autoVariant = isDarkMode ? 'white' : 'black';
  const badgeVariant = variant === 'auto' ? autoVariant : variant;
  
  const handlePress = () => {
    Linking.openURL('https://bolt.new/');
  };
  
  // Size configurations
  const getSizeStyle = () => {
    switch (size) {
      case 'large':
        return { width: 80, height: 80, textSize: 14 };
      case 'medium':
        return { width: 60, height: 60, textSize: 12 };
      case 'small':
      default:
        return { width: 40, height: 40, textSize: 10 };
    }
  };
  
  const sizeStyle = getSizeStyle();
  
  // Position styles
  const getPositionStyle = () => {
    switch (position) {
      case 'bottom-left':
        return { bottom: 16, left: 16 };
      case 'top-right':
        return { top: 16, right: 16 };
      case 'top-left':
        return { top: 16, left: 16 };
      case 'bottom-center':
        return { bottom: 16, alignSelf: 'center' };
      case 'bottom-right':
      default:
        return { bottom: 16, right: 16 };
    }
  };
  
  // Render text-only variant
  if (badgeVariant === 'text') {
    return (
      <TouchableOpacity
        style={[
          styles.textBadge,
          getPositionStyle(),
        ]}
        onPress={handlePress}
        accessibilityLabel="Built on Bolt"
        accessibilityRole="link"
      >
        <Text style={[
          styles.textBadgeText, 
          { 
            color: colors.textSecondary,
            fontSize: sizeStyle.textSize
          }
        ]}>
          Built on Bolt
        </Text>
      </TouchableOpacity>
    );
  }
  
  // Render circle badge variants
  return (
    <TouchableOpacity
      style={[
        styles.badge,
        getPositionStyle(),
        { width: sizeStyle.width, height: sizeStyle.height }
      ]}
      onPress={handlePress}
      accessibilityLabel="Built on Bolt"
      accessibilityRole="link"
    >
      <Image
        source={
          badgeVariant === 'white' 
            ? require('@/assets/images/white_circle_360x360.png')
            : require('@/assets/images/black_circle_360x360.png')
        }
        style={styles.badgeImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    zIndex: 1000,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  textBadge: {
    position: 'absolute',
    zIndex: 1000,
    padding: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  textBadgeText: {
    fontWeight: '500',
  },
});