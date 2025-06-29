import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Sparkles } from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useRevenueCat } from '@/context/RevenueCatContext';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PremiumFeatureProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  showUpgradeButton?: boolean;
}

export function PremiumFeature({
  children,
  title = 'Premium Feature',
  description = 'Upgrade to premium to unlock this feature',
  style,
  contentStyle,
  showUpgradeButton = true,
}: PremiumFeatureProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { isPremium } = useRevenueCat();

  const handleUpgrade = () => {
    router.push('/premium');
  };

  // If user is premium, just render the children
  if (isPremium) {
    return <View style={[styles.container, style]}>{children}</View>;
  }

  // Otherwise, render the premium overlay
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.contentContainer, contentStyle]}>
        {children}
      </View>
      
      <Animated.View 
        entering={FadeIn.duration(300)}
        style={[styles.overlay, { backgroundColor: `${colors.neutral[900]}CC` }]}
      >
        <View style={styles.overlayContent}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary[500] }]}>
            <Lock size={24} color="white" />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          
          {showUpgradeButton && (
            <TouchableOpacity 
              style={[styles.upgradeButton, { backgroundColor: colors.primary[500] }]}
              onPress={handleUpgrade}
            >
              <Sparkles size={16} color="white" />
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  contentContainer: {
    opacity: 0.5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});