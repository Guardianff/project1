import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Sparkles } from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useRevenueCat } from '@/context/RevenueCatContext';
import { Button } from './Button';

interface PremiumFeature {
  title: string;
  description?: string;
}

interface PremiumFeatureListProps {
  features: PremiumFeature[];
  title?: string;
  subtitle?: string;
  ctaText?: string;
  style?: ViewStyle;
  compact?: boolean;
}

export function PremiumFeatureList({
  features,
  title = 'Premium Features',
  subtitle = 'Upgrade to unlock all premium features',
  ctaText = 'Upgrade to Premium',
  style,
  compact = false,
}: PremiumFeatureListProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { isPremium } = useRevenueCat();

  const handleUpgrade = () => {
    router.push('/premium');
  };

  // If user is premium and compact mode is enabled, don't show anything
  if (isPremium && compact) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {!compact && (
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {isPremium ? 'You have access to all premium features' : subtitle}
            </Text>
          )}
        </View>
      )}

      <View style={styles.featureList}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={[styles.checkContainer, { backgroundColor: colors.primary[50] }]}>
              <Check size={16} color={colors.primary[500]} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {feature.title}
              </Text>
              {feature.description && !compact && (
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {!isPremium && (
        <Button
          title={ctaText}
          variant="primary"
          icon={<Sparkles size={16} color="white" />}
          iconPosition="left"
          onPress={handleUpgrade}
          style={styles.upgradeButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
  },
  upgradeButton: {
    marginTop: 8,
  },
});