import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Flame, Clock, Target, TrendingUp } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface LearningStreakWidgetProps {
  streak: number;
  todaySessions: number;
  totalTime: number; // in minutes
}

const { width: screenWidth } = Dimensions.get('window');

export function LearningStreakWidget({ streak, todaySessions, totalTime }: LearningStreakWidgetProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStreakMessage = () => {
    if (streak >= 30) return "Incredible dedication! 🏆";
    if (streak >= 14) return "You're on fire! 🔥";
    if (streak >= 7) return "Great momentum! ⚡";
    if (streak >= 3) return "Building habits! 💪";
    return "Keep going! 🌟";
  };

  const streakProgress = Math.min((streak / 30) * 100, 100);
  const dailyGoalProgress = Math.min((todaySessions / 3) * 100, 100);

  return (
    <Animated.View entering={FadeInUp.duration(600)} style={styles.container}>
      <EnhancedCard variant="glass" style={styles.streakCard} glowEffect>
        <View style={styles.streakHeader}>
          <View style={styles.streakIconContainer}>
            <View style={[styles.streakIcon, { backgroundColor: colors.warning[500] }]}>
              <Flame size={28} color="white" />
            </View>
            <View style={styles.streakInfo}>
              <Text style={[styles.streakCount, { color: colors.text }]}>{streak}</Text>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Day Streak</Text>
            </View>
          </View>
          <Text style={[styles.streakMessage, { color: colors.warning[600] }]}>
            {getStreakMessage()}
          </Text>
        </View>

        <ProgressIndicator
          progress={streakProgress}
          size="md"
          color={colors.warning[500]}
          showLabel
          label={`${Math.round(streakProgress)}% to 30-day milestone`}
          style={styles.streakProgress}
        />

        <View style={styles.statsRow}>
          <Animated.View 
            entering={FadeInRight.delay(200).duration(500)}
            style={[styles.statBox, { backgroundColor: colors.primary[50] }]}
          >
            <View style={[styles.statIcon, { backgroundColor: colors.primary[500] }]}>
              <Target size={16} color="white" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{todaySessions}/3</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today's Goal</Text>
            <ProgressIndicator
              progress={dailyGoalProgress}
              size="sm"
              color={colors.primary[500]}
              showLabel={false}
              style={styles.statProgress}
            />
          </Animated.View>

          <Animated.View 
            entering={FadeInRight.delay(400).duration(500)}
            style={[styles.statBox, { backgroundColor: colors.success[50] }]}
          >
            <View style={[styles.statIcon, { backgroundColor: colors.success[500] }]}>
              <Clock size={16} color="white" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{formatTime(totalTime)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Focus Time</Text>
            <View style={styles.trendContainer}>
              <TrendingUp size={12} color={colors.success[500]} />
              <Text style={[styles.trendText, { color: colors.success[600] }]}>+15% this week</Text>
            </View>
          </Animated.View>
        </View>
      </EnhancedCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  streakCard: {
    padding: 20,
  },
  streakHeader: {
    marginBottom: 20,
  },
  streakIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  streakMessage: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  streakProgress: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  statProgress: {
    width: '100%',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
});