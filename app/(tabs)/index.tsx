import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Search, BookOpen, Play, TrendingUp, Target, Calendar, Zap, Award, Clock, ChevronRight, Smile, Meh, Frown, Heart, Coffee, Dumbbell, Sparkles, ArrowRight, Users, Star, Brain, Flame, CircleCheck as CheckCircle, ChartBar as BarChart3 } from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useAI } from '@/context/AIContext';
import { EnhancedSearchBar } from '@/components/ui/EnhancedSearchBar';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Button } from '@/components/ui/Button';
import { PersonalizedDashboard } from '@/components/dashboard/PersonalizedDashboard';
import { LearningStreakWidget } from '@/components/widgets/LearningStreakWidget';
import { SmartRecommendations } from '@/components/recommendations/SmartRecommendations';
import { QuickActionsGrid } from '@/components/actions/QuickActionsGrid';
import { DataService } from '@/services/DataService';
import Animated, { FadeInUp, FadeInRight, SlideInRight, FadeInDown, useSharedValue, withSpring } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userActivity, setUserActivity] = useState({
    lastActive: new Date(),
    sessionsToday: 0,
    totalTime: 0, // minutes
    streak: 0,
  });
  
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { aiSuggestion } = useAI();

  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    achievements: 0,
    streak: 0
  });

  // Update time every minute for dynamic greetings
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch featured courses
        const coursesData = await DataService.getFeaturedCourses();
        setFeaturedCourses(coursesData);
        
        // If user is logged in, fetch user stats
        if (user) {
          const stats = await DataService.getUserStats(user.id);
          setUserStats(stats);
          
          // Update user activity
          setUserActivity({
            lastActive: new Date(),
            sessionsToday: Math.min(3, stats.totalCourses),
            totalTime: stats.totalHours * 60, // convert hours to minutes
            streak: stats.streak
          });
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Personalized insights based on user activity
  const getPersonalizedInsight = () => {
    const { streak, sessionsToday, totalTime } = userActivity;
    
    if (streak >= 7) {
      return {
        type: 'achievement',
        title: 'Amazing streak!',
        message: `You're on a ${streak}-day learning streak. Keep the momentum going!`,
        icon: <Flame size={20} color={colors.warning[500]} />,
        color: colors.warning[500],
      };
    }
    
    if (sessionsToday >= 3) {
      return {
        type: 'progress',
        title: 'Productive day!',
        message: `${sessionsToday} sessions completed today. You're crushing your goals!`,
        icon: <CheckCircle size={20} color={colors.success[500]} />,
        color: colors.success[500],
      };
    }
    
    return {
      type: 'motivation',
      title: 'Ready to learn?',
      message: 'Start with a quick 10-minute session to build momentum.',
      icon: <Brain size={20} color={colors.primary[500]} />,
      color: colors.primary[500],
    };
  };

  const personalizedInsight = getPersonalizedInsight();

  const todaysPlan = {
    course: 'React Native Advanced',
    workout: '30min HIIT',
    coaching: 'Career Strategy (3:00 PM)',
    progress: 75,
  };

  const progressStats = [
    { 
      label: 'Learning Streak', 
      value: `${userActivity.streak} days`, 
      icon: <Flame size={20} color={colors.warning[500]} />, 
      color: colors.warning[500],
      progress: Math.min((userActivity.streak / 30) * 100, 100),
      trend: '+2 from last week',
    },
    { 
      label: 'Weekly Goals', 
      value: '3/4', 
      icon: <Target size={20} color={colors.primary[500]} />, 
      color: colors.primary[500],
      progress: 75,
      trend: 'On track',
    },
    { 
      label: 'Focus Time', 
      value: `${Math.floor(userActivity.totalTime / 60)}h ${userActivity.totalTime % 60}m`, 
      icon: <Clock size={20} color={colors.success[500]} />, 
      color: colors.success[500],
      progress: 85,
      trend: '+30min today',
    },
  ];

  const moodOptions = [
    { id: 'energized', icon: <Smile size={28} color={colors.success[500]} />, label: 'Energized', color: colors.success[500] },
    { id: 'focused', icon: <Brain size={28} color={colors.primary[500]} />, label: 'Focused', color: colors.primary[500] },
    { id: 'relaxed', icon: <Meh size={28} color={colors.warning[500]} />, label: 'Relaxed', color: colors.warning[500] },
    { id: 'tired', icon: <Frown size={28} color={colors.neutral[500]} />, label: 'Tired', color: colors.neutral[500] },
  ];

  // Quick actions for the QuickActionsGrid component
  const quickActions = [
    {
      id: 'goal',
      title: 'Set a Goal',
      subtitle: 'Create your next milestone',
      icon: <Target size={32} color="white" />,
      gradient: ['#8B5CF6', '#EC4899'],
      stats: 'New',
      priority: 'high',
    },
    {
      id: 'career',
      title: 'Career Growth',
      subtitle: 'Advance your professional skills',
      icon: <BookOpen size={32} color="white" />,
      gradient: ['#3B82F6', '#06B6D4'],
      stats: '3 sessions',
      priority: 'high',
    },
    {
      id: 'fitness',
      title: 'Fitness Plan',
      subtitle: 'Stay healthy and strong',
      icon: <Dumbbell size={32} color="white" />,
      gradient: ['#10B981', '#22C55E'],
      stats: '15 min',
      priority: 'medium',
    },
    {
      id: 'passion',
      title: 'Passion Project',
      subtitle: 'Explore your creative side',
      icon: <Heart size={32} color="white" />,
      gradient: ['#F59E0B', '#EF4444'],
      stats: 'Inspire',
      priority: 'medium',
    },
    {
      id: 'skills',
      title: 'Learn Skills',
      subtitle: 'Master new abilities',
      icon: <BookOpen size={32} color="white" />,
      gradient: ['#6366F1', '#8B5CF6'],
      stats: '150+ courses',
      priority: 'high',
    },
    {
      id: 'plan',
      title: 'Daily Plan',
      subtitle: 'Review today\'s schedule',
      icon: <Calendar size={32} color="white" />,
      gradient: ['#14B8A6', '#06B6D4'],
      stats: 'Today',
      priority: 'medium',
    },
  ];

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    // Here you would typically save this to user preferences/analytics
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Enhanced Header with Dynamic Greeting */}
        <Animated.View 
          entering={FadeInUp.duration(600)}
          style={styles.header}
        >
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>Alex</Text>
            <Text style={[styles.userStatus, { color: colors.textSecondary }]}>
              Ready to learn something new?
            </Text>
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
            placeholder="What would you like to learn today?"
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
          {/* Personalized Insight Banner */}
          <Animated.View entering={SlideInRight.delay(300).duration(700)}>
            <GlassCard
              style={[styles.insightBanner, { backgroundColor: `${personalizedInsight.color}15` }]}
              interactive
              onPress={() => {}}
            >
              <View style={styles.insightContent}>
                <View style={[styles.insightIcon, { backgroundColor: personalizedInsight.color }]}>
                  {personalizedInsight.icon}
                </View>
                <View style={styles.insightTextContent}>
                  <Text style={[styles.insightTitle, { color: personalizedInsight.color }]}>
                    {personalizedInsight.title}
                  </Text>
                  <Text style={[styles.insightText, { color: colors.textSecondary }]}>
                    {personalizedInsight.message}
                  </Text>
                </View>
                <ArrowRight size={20} color={personalizedInsight.color} />
              </View>
            </GlassCard>
          </Animated.View>

          {/* Learning Streak Widget */}
          <Animated.View entering={FadeInUp.delay(400).duration(600)}>
            <LearningStreakWidget 
              streak={userActivity.streak}
              todaySessions={userActivity.sessionsToday}
              totalTime={userActivity.totalTime}
            />
          </Animated.View>

          {/* Enhanced Progress Overview */}
          <Animated.View entering={FadeInUp.delay(600).duration(600)}>
            <EnhancedCard variant="elevated" style={styles.progressOverviewCard}>
              <View style={styles.progressHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Your Progress</Text>
                <TouchableOpacity onPress={() => router.push('/analytics')}>
                  <BarChart3 size={20} color={colors.primary[500]} />
                </TouchableOpacity>
              </View>
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
                    <Text style={[styles.statTrend, { color: stat.color }]}>{stat.trend}</Text>
                  </Animated.View>
                ))}
              </View>
            </EnhancedCard>
          </Animated.View>

          {/* Smart Quick Actions */}
          <Animated.View entering={FadeInUp.delay(800).duration(600)}>
            <QuickActionsGrid 
              actions={quickActions}
              onActionPress={(actionId) => {
                if (actionId === 'continue-learning') {
                  router.push('/courses');
                } else if (actionId === 'ai-tutor') {
                  router.push('/ai-assistant');
                } else if (actionId === 'goal') {
                  router.push('/goals');
                } else if (actionId === 'career') {
                  router.push('/coaching');
                } else if (actionId === 'fitness') {
                  router.push('/fitness');
                } else if (actionId === 'passion') {
                  router.push('/passion-projects');
                } else if (actionId === 'skills') {
                  router.push('/courses');
                } else if (actionId === 'plan') {
                  router.push('/daily-plan');
                }
              }} 
            />
          </Animated.View>

          {/* Mood Check-in */}
          <Animated.View entering={FadeInUp.delay(1000).duration(600)}>
            <EnhancedCard variant="elevated" style={styles.checkInCard}>
              <Text style={[styles.checkInTitle, { color: colors.text }]}>How are you feeling today?</Text>
              <Text style={[styles.checkInSubtitle, { color: colors.textSecondary }]}>
                Help us personalize your learning experience
              </Text>
              <View style={styles.moodSelector}>
                {moodOptions.map((mood, index) => (
                  <Animated.View
                    key={mood.id}
                    entering={FadeInUp.delay(1100 + index * 100).duration(500)}
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

          {/* Smart Recommendations */}
          <Animated.View entering={FadeInUp.delay(1200).duration(600)}>
            <SmartRecommendations 
              userMood={selectedMood}
              currentStreak={userActivity.streak}
              timeOfDay={currentTime.getHours()}
            />
          </Animated.View>

          {/* Enhanced Featured Courses */}
          {!loading && featuredCourses.length > 0 && (
            <Animated.View entering={FadeInUp.delay(1400).duration(600)} style={styles.featuredSection}>
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
                    entering={FadeInRight.delay(1500 + index * 200).duration(600)}
                    style={styles.featuredCourseCard}
                  >
                    <EnhancedCard
                      variant="elevated"
                      interactive
                      glowEffect
                      onPress={() => router.push(`/course/${course.id}`)}
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
                        <View style={[styles.difficultyBadge, { backgroundColor: colors.warning[500] }]}>
                          <Text style={styles.difficultyText}>{course.level}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.courseContent}>
                        <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={2}>
                          {course.title}
                        </Text>
                        <Text style={[styles.courseInstructor, { color: colors.textSecondary }]}>
                          {course.instructor.name}
                        </Text>
                        
                        <View style={styles.courseStats}>
                          <View style={styles.courseStat}>
                            <Star size={12} color={colors.warning[500]} fill={colors.warning[500]} />
                            <Text style={[styles.courseStatText, { color: colors.textSecondary }]}>
                              {course.rating}
                            </Text>
                          </View>
                          <View style={styles.courseStat}>
                            <Clock size={12} color={colors.neutral[500]} />
                            <Text style={[styles.courseStatText, { color: colors.textSecondary }]}>
                              {Math.floor(course.duration / 60)}h {course.duration % 60}m
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
          )}

          {/* Daily Tip with Enhanced Interaction */}
          <Animated.View entering={FadeInUp.delay(1600).duration(600)}>
            <GlassCard style={styles.dailyTipCard}>
              <View style={styles.tipHeader}>
                <View style={[styles.tipIcon, { backgroundColor: colors.warning[500] }]}>
                  <Coffee size={24} color="white" />
                </View>
                <View>
                  <Text style={[styles.tipTitle, { color: colors.text }]}>Daily Wisdom</Text>
                  <Text style={[styles.tipTime, { color: colors.textSecondary }]}>
                    {currentTime.toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                "The expert in anything was once a beginner. Focus on progress, not perfection."
              </Text>
              <View style={styles.tipActions}>
                <TouchableOpacity style={styles.saveButton}>
                  <Heart size={16} color={colors.warning[500]} />
                  <Text style={[styles.saveButtonText, { color: colors.warning[600] }]}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                  <Text style={[styles.shareButtonText, { color: colors.primary[500] }]}>Share</Text>
                </TouchableOpacity>
              </View>
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
    alignItems: 'flex-start',
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
  userStatus: {
    fontSize: 14,
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
  insightBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightTextContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressOverviewCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
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
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 12,
  },
  statProgress: {
    marginTop: 8,
    marginBottom: 8,
  },
  statTrend: {
    fontSize: 10,
    fontWeight: '600',
  },
  checkInCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  checkInTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  checkInSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodOption: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 80,
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
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
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
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
  tipTime: {
    fontSize: 12,
    marginTop: 2,
  },
  tipText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  tipActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  shareButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});