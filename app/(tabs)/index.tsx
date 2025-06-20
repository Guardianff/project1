import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Bell, 
  Search, 
  BookOpen, 
  Play, 
  TrendingUp, 
  Target, 
  Calendar,
  Zap,
  Award,
  Clock,
  ChevronRight,
  Smile,
  Meh,
  Frown,
  Heart,
  Coffee,
  Dumbbell,
  Sparkles,
  ArrowRight,
  Users,
  Star
} from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useAI } from '@/context/AIContext';
import { EnhancedSearchBar } from '@/components/ui/EnhancedSearchBar';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Button } from '@/components/ui/Button';
import Animated, { FadeInUp, FadeInRight, SlideInRight, FadeInDown } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { aiSuggestion } = useAI();

  const todaysPlan = {
    course: 'React Native Advanced',
    workout: '30min HIIT',
    coaching: 'Career Strategy (3:00 PM)',
    progress: 75,
  };

  const quickActions = [
    { 
      id: 'workout', 
      title: 'Start Workout', 
      subtitle: 'Begin your fitness journey',
      icon: <Dumbbell size={24} color="white" />, 
      gradient: ['#10B981', '#22C55E'],
      stats: '30 min',
    },
    { 
      id: 'learning', 
      title: 'Continue Learning', 
      subtitle: 'Pick up where you left off',
      icon: <BookOpen size={24} color="white" />, 
      gradient: ['#3B82F6', '#06B6D4'],
      stats: '12 lessons',
    },
    { 
      id: 'meeting', 
      title: 'Join Meeting', 
      subtitle: 'Connect with your coach',
      icon: <Calendar size={24} color="white" />, 
      gradient: ['#8B5CF6', '#EC4899'],
      stats: 'In 2 hours',
    },
    { 
      id: 'ai', 
      title: 'Ask AI', 
      subtitle: 'Get personalized guidance',
      icon: <Zap size={24} color="white" />, 
      gradient: ['#F59E0B', '#EF4444'],
      stats: 'Available',
    },
  ];

  const progressStats = [
    { 
      label: 'Learning Streak', 
      value: '7 days', 
      icon: <TrendingUp size={20} color={colors.success[500]} />, 
      color: colors.success[500],
      progress: 70,
    },
    { 
      label: 'Weekly Goals', 
      value: '3/4', 
      icon: <Target size={20} color={colors.primary[500]} />, 
      color: colors.primary[500],
      progress: 75,
    },
    { 
      label: 'Completed', 
      value: '85%', 
      icon: <Award size={20} color={colors.warning[500]} />, 
      color: colors.warning[500],
      progress: 85,
    },
  ];

  const moodOptions = [
    { id: 'happy', icon: <Smile size={28} color={colors.success[500]} />, label: 'Great', color: colors.success[500] },
    { id: 'neutral', icon: <Meh size={28} color={colors.warning[500]} />, label: 'Okay', color: colors.warning[500] },
    { id: 'sad', icon: <Frown size={28} color={colors.error[500]} />, label: 'Tough', color: colors.error[500] },
  ];

  const featuredCourses = [
    {
      id: '1',
      title: 'Advanced React Native',
      instructor: 'Sarah Johnson',
      progress: 65,
      rating: 4.8,
      students: 1234,
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '2',
      title: 'UI/UX Design Mastery',
      instructor: 'Michael Chen',
      progress: 30,
      rating: 4.9,
      students: 856,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'workout':
        // Navigate to workout
        break;
      case 'learning':
        router.push('/courses');
        break;
      case 'meeting':
        router.push('/coaching');
        break;
      case 'ai':
        router.push('/ai-assistant');
        break;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.duration(600)}
          style={styles.header}
        >
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good morning,</Text>
            <Text style={[styles.userName, { color: colors.text }]}>Alex</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: colors.neutral[100] }]}
              onPress={handleNotificationPress}
            >
              <Bell size={24} color={colors.text} />
              <View style={[styles.notificationBadge, { backgroundColor: colors.error[500] }]} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Enhanced Search Bar */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)}>
          <EnhancedSearchBar
            placeholder="Search courses, topics, instructors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            variant="prominent"
            showFilter
            showVoice
            onFilterPress={() => {}}
            onVoicePress={() => {}}
          />
        </Animated.View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* AI Suggestion Banner */}
          {aiSuggestion && (
            <Animated.View entering={SlideInRight.delay(300).duration(700)}>
              <GlassCard
                style={styles.aiSuggestionBanner}
                interactive
                onPress={() => router.push('/ai-assistant')}
              >
                <View style={styles.aiSuggestionContent}>
                  <View style={[styles.aiIcon, { backgroundColor: colors.primary[500] }]}>
                    <Sparkles size={24} color="white" />
                  </View>
                  <View style={styles.aiTextContent}>
                    <Text style={[styles.aiSuggestionTitle, { color: colors.primary[700] }]}>
                      AI Insight
                    </Text>
                    <Text style={[styles.aiSuggestionText, { color: colors.primary[600] }]}>
                      {aiSuggestion}
                    </Text>
                  </View>
                  <ArrowRight size={20} color={colors.primary[500]} />
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {/* Daily Check-in */}
          <Animated.View entering={FadeInUp.delay(400).duration(600)}>
            <EnhancedCard variant="elevated" style={styles.checkInCard} glowEffect>
              <Text style={[styles.checkInTitle, { color: colors.text }]}>How are you feeling today?</Text>
              <View style={styles.moodSelector}>
                {moodOptions.map((mood, index) => (
                  <Animated.View
                    key={mood.id}
                    entering={FadeInUp.delay(500 + index * 100).duration(500)}
                  >
                    <TouchableOpacity
                      style={[
                        styles.moodOption,
                        { backgroundColor: colors.neutral[50] },
                        selectedMood === mood.id && { 
                          backgroundColor: `${mood.color}15`,
                          borderColor: mood.color,
                          borderWidth: 2,
                        }
                      ]}
                      onPress={() => handleMoodSelect(mood.id)}
                    >
                      {mood.icon}
                      <Text style={[
                        styles.moodLabel, 
                        { color: colors.textSecondary },
                        selectedMood === mood.id && { color: mood.color, fontWeight: '600' }
                      ]}>
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </EnhancedCard>
          </Animated.View>

          {/* Progress Overview */}
          <Animated.View entering={FadeInUp.delay(600).duration(600)}>
            <EnhancedCard variant="elevated" style={styles.progressOverviewCard}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Your Progress</Text>
              <View style={styles.statsGrid}>
                {progressStats.map((stat, index) => (
                  <Animated.View
                    key={stat.label}
                    entering={FadeInRight.delay(700 + index * 150).duration(600)}
                    style={[styles.statItem, { backgroundColor: colors.neutral[25] }]}
                  >
                    <View style={styles.statHeader}>
                      <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                        {stat.icon}
                      </View>
                      <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                    </View>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                    <ProgressIndicator
                      progress={stat.progress}
                      size="sm"
                      color={stat.color}
                      showLabel={false}
                      style={styles.statProgress}
                    />
                  </Animated.View>
                ))}
              </View>
            </EnhancedCard>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInUp.delay(800).duration(600)} style={styles.quickActionsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <Animated.View
                  key={action.id}
                  entering={FadeInUp.delay(900 + index * 100).duration(600)}
                  style={[styles.quickActionItem, { width: (screenWidth - 60) / 2 }]}
                >
                  <EnhancedCard
                    variant="glass"
                    interactive
                    glowEffect
                    onPress={() => handleQuickAction(action.id)}
                    style={styles.quickActionCard}
                  >
                    <View style={[styles.quickActionBackground, { 
                      background: `linear-gradient(135deg, ${action.gradient[0]}, ${action.gradient[1]})`,
                      backgroundColor: action.gradient[0],
                    }]}>
                      <View style={styles.quickActionHeader}>
                        <View style={styles.quickActionIcon}>
                          {action.icon}
                        </View>
                        <Text style={styles.quickActionStats}>{action.stats}</Text>
                      </View>
                      <View style={styles.quickActionContent}>
                        <Text style={styles.quickActionTitle}>{action.title}</Text>
                        <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                      </View>
                    </View>
                  </EnhancedCard>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Featured Courses */}
          <Animated.View entering={FadeInUp.delay(1000).duration(600)} style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
              <TouchableOpacity onPress={() => router.push('/courses')}>
                <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            >
              {featuredCourses.map((course, index) => (
                <Animated.View
                  key={course.id}
                  entering={FadeInRight.delay(1100 + index * 200).duration(600)}
                  style={styles.featuredCourseCard}
                >
                  <EnhancedCard
                    variant="elevated"
                    interactive
                    glowEffect
                    onPress={() => {}}
                    style={styles.courseCard}
                  >
                    <View style={styles.courseImageContainer}>
                      <View 
                        style={[
                          styles.courseImage,
                          { backgroundColor: colors.neutral[200] }
                        ]}
                      />
                      <View style={styles.courseOverlay}>
                        <View style={[styles.playButton, { backgroundColor: colors.primary[500] }]}>
                          <Play size={16} color="white" />
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.courseContent}>
                      <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={2}>
                        {course.title}
                      </Text>
                      <Text style={[styles.courseInstructor, { color: colors.textSecondary }]}>
                        {course.instructor}
                      </Text>
                      
                      <View style={styles.courseStats}>
                        <View style={styles.courseStat}>
                          <Star size={12} color={colors.warning[500]} fill={colors.warning[500]} />
                          <Text style={[styles.courseStatText, { color: colors.textSecondary }]}>
                            {course.rating}
                          </Text>
                        </View>
                        <View style={styles.courseStat}>
                          <Users size={12} color={colors.neutral[500]} />
                          <Text style={[styles.courseStatText, { color: colors.textSecondary }]}>
                            {course.students}
                          </Text>
                        </View>
                      </View>
                      
                      <ProgressIndicator
                        progress={course.progress}
                        size="sm"
                        showLabel
                        label={`${course.progress}% complete`}
                        style={styles.courseProgress}
                      />
                    </View>
                  </EnhancedCard>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Daily Tip */}
          <Animated.View entering={FadeInUp.delay(1200).duration(600)}>
            <GlassCard style={styles.dailyTipCard}>
              <View style={styles.tipHeader}>
                <View style={[styles.tipIcon, { backgroundColor: colors.warning[500] }]}>
                  <Coffee size={24} color="white" />
                </View>
                <Text style={[styles.tipTitle, { color: colors.text }]}>Daily Tip</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Focus on one skill at a time. Mastery comes from depth, not breadth.
              </Text>
              <TouchableOpacity style={styles.saveButton}>
                <Heart size={16} color={colors.warning[500]} />
                <Text style={[styles.saveButtonText, { color: colors.warning[600] }]}>Save to Journal</Text>
              </TouchableOpacity>
            </GlassCard>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
  },
  userName: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  aiSuggestionBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  aiSuggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aiTextContent: {
    flex: 1,
  },
  aiSuggestionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  aiSuggestionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  checkInCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  checkInTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodOption: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 90,
  },
  moodLabel: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },
  progressOverviewCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 12,
  },
  statProgress: {
    marginTop: 8,
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    marginBottom: 16,
  },
  quickActionCard: {
    height: 140,
  },
  quickActionBackground: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
  },
  quickActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionStats: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionContent: {
    marginTop: 8,
  },
  quickActionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredCourseCard: {
    width: 280,
    marginRight: 16,
  },
  courseCard: {
    padding: 0,
    overflow: 'hidden',
  },
  courseImageContainer: {
    position: 'relative',
    height: 120,
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  courseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    marginBottom: 12,
  },
  courseStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  courseStatText: {
    fontSize: 12,
    marginLeft: 4,
  },
  courseProgress: {
    marginTop: 8,
  },
  dailyTipCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  tipText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});