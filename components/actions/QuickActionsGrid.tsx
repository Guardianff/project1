import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Target, 
  Briefcase, 
  Dumbbell, 
  Heart, 
  BookOpen, 
  Calendar 
} from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string[];
  stats?: string;
  priority?: 'high' | 'medium' | 'low';
  action?: () => void;
}

interface QuickActionsGridProps {
  actions?: QuickAction[];
  onActionPress?: (actionId: string) => void;
}

export function QuickActionsGrid({ actions, onActionPress }: QuickActionsGridProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const handleGoalSetting = () => {
    // Navigate to goal setting or show goal creation modal
    Alert.alert(
      'Set a Goal',
      'What would you like to achieve?',
      [
        { text: 'Learning Goal', onPress: () => router.push('/courses') },
        { text: 'Fitness Goal', onPress: () => showFitnessGoals() },
        { text: 'Career Goal', onPress: () => showCareerGoals() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCareerGrowth = () => {
    // Navigate to career development section
    router.push('/coaching');
  };

  const handleFitnessPlan = () => {
    // Navigate to fitness/health section or show fitness options
    showFitnessOptions();
  };

  const handlePassionProject = () => {
    // Navigate to creative projects or resources
    Alert.alert(
      'Passion Project',
      'Explore your creative side',
      [
        { text: 'Browse Creative Courses', onPress: () => navigateToCategory('Design') },
        { text: 'Find Inspiration', onPress: () => router.push('/resources') },
        { text: 'Start a Project', onPress: () => showProjectCreation() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLearnSkills = () => {
    // Navigate to courses or skills section
    router.push('/courses');
  };

  const handleDailyPlan = () => {
    // Show today's schedule or planning interface
    showDailyPlanModal();
  };

  const showFitnessGoals = () => {
    Alert.alert(
      'Fitness Goals',
      'Choose your fitness objective',
      [
        { text: 'Weight Loss', onPress: () => createFitnessGoal('weight-loss') },
        { text: 'Muscle Building', onPress: () => createFitnessGoal('muscle-building') },
        { text: 'Endurance', onPress: () => createFitnessGoal('endurance') },
        { text: 'General Health', onPress: () => createFitnessGoal('general-health') },
      ]
    );
  };

  const showCareerGoals = () => {
    Alert.alert(
      'Career Goals',
      'What\'s your career objective?',
      [
        { text: 'Skill Development', onPress: () => router.push('/courses') },
        { text: 'Leadership Growth', onPress: () => navigateToCategory('Business') },
        { text: 'Career Change', onPress: () => router.push('/coaching') },
        { text: 'Promotion Prep', onPress: () => router.push('/coaching') },
      ]
    );
  };

  const showFitnessOptions = () => {
    Alert.alert(
      'Fitness Plan',
      'How would you like to stay active?',
      [
        { text: 'Quick Workout (15 min)', onPress: () => startQuickWorkout() },
        { text: 'Full Workout (45 min)', onPress: () => startFullWorkout() },
        { text: 'Yoga & Stretching', onPress: () => startYogaSession() },
        { text: 'Browse Fitness Courses', onPress: () => navigateToCategory('Health & Fitness') },
      ]
    );
  };

  const showProjectCreation = () => {
    Alert.alert(
      'Start a Project',
      'What type of project interests you?',
      [
        { text: 'Web Development', onPress: () => navigateToCategory('Development') },
        { text: 'Design Project', onPress: () => navigateToCategory('Design') },
        { text: 'Writing/Content', onPress: () => navigateToCategory('Marketing') },
        { text: 'Photography', onPress: () => navigateToCategory('Photography') },
      ]
    );
  };

  const showDailyPlanModal = () => {
    const currentHour = new Date().getHours();
    let timeBasedMessage = '';
    
    if (currentHour < 12) {
      timeBasedMessage = 'Good morning! Here\'s your plan for today:';
    } else if (currentHour < 17) {
      timeBasedMessage = 'Good afternoon! Let\'s review your remaining tasks:';
    } else {
      timeBasedMessage = 'Good evening! Time to plan for tomorrow:';
    }

    Alert.alert(
      'Daily Plan',
      timeBasedMessage,
      [
        { text: 'View Schedule', onPress: () => router.push('/coaching') },
        { text: 'Set Reminders', onPress: () => router.push('/notifications') },
        { text: 'Track Progress', onPress: () => showProgressTracking() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const navigateToCategory = (categoryName: string) => {
    // Navigate to specific category in courses
    router.push('/categories');
  };

  const createFitnessGoal = (goalType: string) => {
    Alert.alert(
      'Fitness Goal Created',
      `Your ${goalType.replace('-', ' ')} goal has been set! We'll help you track your progress.`,
      [{ text: 'OK' }]
    );
  };

  const startQuickWorkout = () => {
    Alert.alert(
      'Quick Workout',
      '15-minute high-intensity workout starting now!',
      [
        { text: 'Start Now', onPress: () => console.log('Starting quick workout') },
        { text: 'Schedule Later', onPress: () => router.push('/coaching') },
      ]
    );
  };

  const startFullWorkout = () => {
    Alert.alert(
      'Full Workout',
      '45-minute comprehensive workout session',
      [
        { text: 'Start Now', onPress: () => console.log('Starting full workout') },
        { text: 'Schedule Later', onPress: () => router.push('/coaching') },
      ]
    );
  };

  const startYogaSession = () => {
    Alert.alert(
      'Yoga & Stretching',
      'Relaxing yoga and stretching session',
      [
        { text: 'Start Now', onPress: () => console.log('Starting yoga session') },
        { text: 'Browse Yoga Courses', onPress: () => navigateToCategory('Health & Fitness') },
      ]
    );
  };

  const showProgressTracking = () => {
    Alert.alert(
      'Progress Tracking',
      'Track your daily achievements and goals',
      [
        { text: 'View Analytics', onPress: () => console.log('View analytics') },
        { text: 'Update Goals', onPress: () => handleGoalSetting() },
        { text: 'Share Progress', onPress: () => console.log('Share progress') },
      ]
    );
  };

  const defaultQuickActions: QuickAction[] = [
    {
      id: 'goal',
      title: 'Set a Goal',
      subtitle: 'Create your next milestone',
      icon: <Target size={32} color="white" />,
      gradient: ['#8B5CF6', '#EC4899'],
      stats: 'New',
      priority: 'high',
      action: handleGoalSetting,
    },
    {
      id: 'career',
      title: 'Career Growth',
      subtitle: 'Advance your professional skills',
      icon: <Briefcase size={32} color="white" />,
      gradient: ['#3B82F6', '#06B6D4'],
      stats: '3 sessions',
      priority: 'high',
      action: handleCareerGrowth,
    },
    {
      id: 'fitness',
      title: 'Fitness Plan',
      subtitle: 'Stay healthy and strong',
      icon: <Dumbbell size={32} color="white" />,
      gradient: ['#10B981', '#22C55E'],
      stats: '15 min',
      priority: 'medium',
      action: handleFitnessPlan,
    },
    {
      id: 'passion',
      title: 'Passion Project',
      subtitle: 'Explore your creative side',
      icon: <Heart size={32} color="white" />,
      gradient: ['#F59E0B', '#EF4444'],
      stats: 'Inspire',
      priority: 'medium',
      action: handlePassionProject,
    },
    {
      id: 'skills',
      title: 'Learn Skills',
      subtitle: 'Master new abilities',
      icon: <BookOpen size={32} color="white" />,
      gradient: ['#6366F1', '#8B5CF6'],
      stats: '150+ courses',
      priority: 'high',
      action: handleLearnSkills,
    },
    {
      id: 'plan',
      title: 'Daily Plan',
      subtitle: 'Review today\'s schedule',
      icon: <Calendar size={32} color="white" />,
      gradient: ['#14B8A6', '#06B6D4'],
      stats: 'Today',
      priority: 'medium',
      action: handleDailyPlan,
    },
  ];

  const quickActions = actions || defaultQuickActions;

  const handleActionPress = (action: QuickAction) => {
    // Call the custom handler if provided
    if (onActionPress) {
      onActionPress(action.id);
      return;
    }
    
    // Execute the action only if it exists
    if (action.action && typeof action.action === 'function') {
      action.action();
    }
  };

  const renderQuickAction = (action: QuickAction, index: number) => (
    <Animated.View
      key={action.id}
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={[styles.actionCard, { width: (screenWidth - 60) / 2 }]}
    >
      <TouchableOpacity
        style={styles.actionCardContent}
        onPress={() => handleActionPress(action)}
        activeOpacity={0.8}
      >
        <View style={[styles.actionCardBackground, { 
          backgroundColor: action.gradient[0] 
        }]}>
          {/* Priority Indicator */}
          {action.priority === 'high' && (
            <View style={styles.priorityIndicator}>
              <View style={styles.priorityDot} />
            </View>
          )}
          
          <View style={styles.actionCardIcon}>
            {action.icon}
          </View>
          
          <View style={styles.actionCardContent}>
            <Text style={styles.actionCardTitle}>{action.title}</Text>
            <Text style={styles.actionCardSubtitle}>{action.subtitle}</Text>
            
            {/* Stats */}
            {action.stats && (
              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>{action.stats}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action, index) => renderQuickAction(action, index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    marginBottom: 16,
  },
  actionCardContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionCardBackground: {
    padding: 20,
    height: 140,
    justifyContent: 'space-between',
    position: 'relative',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  actionCardIcon: {
    alignSelf: 'flex-start',
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  statsContainer: {
    alignSelf: 'flex-start',
  },
  statsText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});