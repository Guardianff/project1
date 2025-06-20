import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Target, Calendar, TrendingUp, CheckCircle, Clock, Flag } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'fitness' | 'career' | 'personal';
  progress: number;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  milestones: number;
  completedMilestones: number;
}

export default function GoalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Master React Native',
      description: 'Complete advanced React Native course and build 3 projects',
      category: 'learning',
      progress: 65,
      targetDate: '2025-03-15',
      status: 'active',
      milestones: 5,
      completedMilestones: 3,
    },
    {
      id: '2',
      title: 'Run 5K Daily',
      description: 'Build endurance to run 5K every morning',
      category: 'fitness',
      progress: 40,
      targetDate: '2025-02-28',
      status: 'active',
      milestones: 4,
      completedMilestones: 2,
    },
    {
      id: '3',
      title: 'Get Promoted',
      description: 'Develop leadership skills and complete certification',
      category: 'career',
      progress: 80,
      targetDate: '2025-06-01',
      status: 'active',
      milestones: 6,
      completedMilestones: 5,
    },
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <Target size={20} color={colors.primary[500]} />;
      case 'fitness': return <TrendingUp size={20} color={colors.success[500]} />;
      case 'career': return <Flag size={20} color={colors.accent[500]} />;
      default: return <Target size={20} color={colors.neutral[500]} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return colors.primary[500];
      case 'fitness': return colors.success[500];
      case 'career': return colors.accent[500];
      default: return colors.neutral[500];
    }
  };

  const handleCreateGoal = () => {
    Alert.alert(
      'Create New Goal',
      'What type of goal would you like to create?',
      [
        { text: 'Learning Goal', onPress: () => createGoal('learning') },
        { text: 'Fitness Goal', onPress: () => createGoal('fitness') },
        { text: 'Career Goal', onPress: () => createGoal('career') },
        { text: 'Personal Goal', onPress: () => createGoal('personal') },
      ]
    );
  };

  const createGoal = (category: string) => {
    // In a real app, this would open a goal creation form
    Alert.alert('Goal Creation', `Creating a new ${category} goal...`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.duration(500)}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>My Goals</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Track your progress and achieve your dreams
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary[500] }]}
            onPress={handleCreateGoal}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Goals Overview */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.overviewSection}>
            <EnhancedCard variant="glass" style={styles.overviewCard}>
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{goals.length}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Goals</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {goals.reduce((sum, goal) => sum + goal.completedMilestones, 0)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Milestones</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)}%
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Progress</Text>
                </View>
              </View>
            </EnhancedCard>
          </Animated.View>

          {/* Goals List */}
          <View style={styles.goalsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Goals</Text>
            
            {goals.map((goal, index) => (
              <Animated.View
                key={goal.id}
                entering={FadeInRight.delay(300 + index * 100).duration(500)}
              >
                <EnhancedCard
                  variant="elevated"
                  interactive
                  glowEffect
                  onPress={() => {}}
                  style={styles.goalCard}
                >
                  <View style={styles.goalHeader}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(goal.category)}15` }]}>
                      {getCategoryIcon(goal.category)}
                    </View>
                    <Badge
                      label={goal.category}
                      variant="neutral"
                      size="small"
                      style={{ backgroundColor: `${getCategoryColor(goal.category)}15` }}
                      textStyle={{ color: getCategoryColor(goal.category) }}
                    />
                  </View>
                  
                  <Text style={[styles.goalTitle, { color: colors.text }]}>{goal.title}</Text>
                  <Text style={[styles.goalDescription, { color: colors.textSecondary }]}>
                    {goal.description}
                  </Text>
                  
                  <View style={styles.goalProgress}>
                    <ProgressIndicator
                      progress={goal.progress}
                      size="md"
                      color={getCategoryColor(goal.category)}
                      showLabel
                      label={`${goal.progress}% complete`}
                    />
                  </View>
                  
                  <View style={styles.goalMeta}>
                    <View style={styles.metaItem}>
                      <Calendar size={16} color={colors.neutral[500]} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {formatDate(goal.targetDate)}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={16} color={colors.neutral[500]} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {getDaysRemaining(goal.targetDate)} days left
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <CheckCircle size={16} color={colors.neutral[500]} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {goal.completedMilestones}/{goal.milestones} milestones
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.goalActions}>
                    <Button
                      title="Update Progress"
                      variant="primary"
                      size="small"
                      onPress={() => {}}
                      style={[styles.actionButton, { backgroundColor: getCategoryColor(goal.category) }]}
                    />
                    <Button
                      title="View Details"
                      variant="outline"
                      size="small"
                      onPress={() => {}}
                      style={styles.actionButton}
                    />
                  </View>
                </EnhancedCard>
              </Animated.View>
            ))}
          </View>

          {/* Create Goal CTA */}
          <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.ctaSection}>
            <EnhancedCard
              variant="glass"
              interactive
              onPress={handleCreateGoal}
              style={styles.ctaCard}
            >
              <View style={styles.ctaContent}>
                <View style={[styles.ctaIcon, { backgroundColor: colors.primary[500] }]}>
                  <Plus size={24} color="white" />
                </View>
                <Text style={[styles.ctaTitle, { color: colors.text }]}>Create New Goal</Text>
                <Text style={[styles.ctaDescription, { color: colors.textSecondary }]}>
                  Set a new goal to track your progress and stay motivated
                </Text>
              </View>
            </EnhancedCard>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  overviewCard: {
    padding: 20,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewStat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  goalsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  goalCard: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  goalProgress: {
    marginBottom: 16,
  },
  goalMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 6,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  ctaCard: {
    padding: 20,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 80,
  },
});