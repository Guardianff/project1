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
  Dumbbell
} from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useAI } from '@/context/AIContext';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import Animated, { FadeInUp, FadeInRight, SlideInRight } from 'react-native-reanimated';

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
    { id: 'workout', title: 'Start Workout', icon: <Dumbbell size={20} color="white" />, color: '#10B981' },
    { id: 'learning', title: 'Continue Learning', icon: <BookOpen size={20} color="white" />, color: '#3B82F6' },
    { id: 'meeting', title: 'Join Meeting', icon: <Calendar size={20} color="white" />, color: '#8B5CF6' },
    { id: 'ai', title: 'Ask AI', icon: <Zap size={20} color="white" />, color: '#F59E0B' },
  ];

  const progressStats = [
    { label: 'Streak', value: '7 days', icon: <TrendingUp size={16} color={colors.success[500]} />, color: colors.success[500] },
    { label: 'Goals', value: '3/4', icon: <Target size={16} color={colors.primary[500]} />, color: colors.primary[500] },
    { label: 'Completed', value: '85%', icon: <Award size={16} color={colors.warning[500]} />, color: colors.warning[500] },
  ];

  const moodOptions = [
    { id: 'happy', icon: <Smile size={24} color={colors.success[500]} />, label: 'Great' },
    { id: 'neutral', icon: <Meh size={24} color={colors.warning[500]} />, label: 'Okay' },
    { id: 'sad', icon: <Frown size={24} color={colors.error[500]} />, label: 'Tough' },
  ];

  const dailyTip = "Focus on one skill at a time. Mastery comes from depth, not breadth.";

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.duration(400)}
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
        
        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <SearchBar
            placeholder="Search courses, topics, instructors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Animated.View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Daily Check-in */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(500)}
            style={[styles.checkInCard, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.checkInTitle, { color: colors.text }]}>How are you feeling today?</Text>
            <View style={styles.moodSelector}>
              {moodOptions.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodOption,
                    { backgroundColor: colors.neutral[50] },
                    selectedMood === mood.id && { backgroundColor: colors.primary[50], borderColor: colors.primary[200] }
                  ]}
                  onPress={() => handleMoodSelect(mood.id)}
                >
                  {mood.icon}
                  <Text style={[
                    styles.moodLabel, 
                    { color: colors.textSecondary },
                    selectedMood === mood.id && { color: colors.primary[600] }
                  ]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* AI Suggestion Banner */}
          {aiSuggestion && (
            <Animated.View 
              entering={SlideInRight.delay(300).duration(500)}
              style={[styles.aiSuggestionBanner, { backgroundColor: colors.primary[50] }]}
            >
              <View style={styles.aiSuggestionContent}>
                <View style={[styles.aiIcon, { backgroundColor: colors.primary[500] }]}>
                  <Zap size={20} color="white" />
                </View>
                <View style={styles.aiTextContent}>
                  <Text style={[styles.aiSuggestionTitle, { color: colors.primary[700] }]}>
                    AI Suggestion
                  </Text>
                  <Text style={[styles.aiSuggestionText, { color: colors.primary[600] }]}>
                    {aiSuggestion}
                  </Text>
                </View>
              </View>
              <Button
                title="Let's Go"
                variant="primary"
                size="small"
                onPress={() => router.push('/ai-assistant')}
                style={styles.aiActionButton}
              />
            </Animated.View>
          )}

          {/* Today's Plan */}
          <Animated.View 
            entering={FadeInUp.delay(400).duration(500)}
            style={[styles.todaysPlanCard, { backgroundColor: colors.background }]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Today's Plan</Text>
              <TouchableOpacity>
                <ChevronRight size={20} color={colors.neutral[400]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.planItems}>
              <View style={styles.planItem}>
                <BookOpen size={16} color={colors.primary[500]} />
                <Text style={[styles.planItemText, { color: colors.text }]}>{todaysPlan.course}</Text>
              </View>
              <View style={styles.planItem}>
                <Dumbbell size={16} color={colors.success[500]} />
                <Text style={[styles.planItemText, { color: colors.text }]}>{todaysPlan.workout}</Text>
              </View>
              <View style={styles.planItem}>
                <Calendar size={16} color={colors.accent[500]} />
                <Text style={[styles.planItemText, { color: colors.text }]}>{todaysPlan.coaching}</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Daily Progress</Text>
                <Text style={[styles.progressValue, { color: colors.text }]}>{todaysPlan.progress}%</Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.neutral[200] }]}>
                <View style={[
                  styles.progressFill, 
                  { backgroundColor: colors.primary[500], width: `${todaysPlan.progress}%` }
                ]} />
              </View>
            </View>
          </Animated.View>

          {/* Progress Overview */}
          <Animated.View 
            entering={FadeInUp.delay(500).duration(500)}
            style={[styles.progressOverviewCard, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>Progress Overview</Text>
            <View style={styles.statsGrid}>
              {progressStats.map((stat, index) => (
                <Animated.View
                  key={stat.label}
                  entering={FadeInRight.delay(600 + index * 100).duration(500)}
                  style={[styles.statItem, { backgroundColor: colors.neutral[50] }]}
                >
                  <View style={styles.statIcon}>
                    {stat.icon}
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View 
            entering={FadeInUp.delay(600).duration(500)}
            style={styles.quickActionsContainer}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <Animated.View
                  key={action.id}
                  entering={FadeInUp.delay(700 + index * 100).duration(500)}
                  style={[styles.quickActionItem, { width: (screenWidth - 60) / 2 }]}
                >
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: action.color }]}
                    activeOpacity={0.8}
                  >
                    {action.icon}
                    <Text style={styles.quickActionText}>{action.title}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Daily Tip */}
          <Animated.View 
            entering={FadeInUp.delay(800).duration(500)}
            style={[styles.dailyTipCard, { backgroundColor: colors.warning[50] }]}
          >
            <View style={styles.tipHeader}>
              <View style={[styles.tipIcon, { backgroundColor: colors.warning[500] }]}>
                <Coffee size={20} color="white" />
              </View>
              <Text style={[styles.tipTitle, { color: colors.warning[700] }]}>Daily Tip</Text>
            </View>
            <Text style={[styles.tipText, { color: colors.warning[600] }]}>{dailyTip}</Text>
            <TouchableOpacity style={styles.saveButton}>
              <Heart size={16} color={colors.warning[500]} />
              <Text style={[styles.saveButtonText, { color: colors.warning[600] }]}>Save to Journal</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Resume Last Activity */}
          <Animated.View 
            entering={FadeInUp.delay(900).duration(500)}
            style={[styles.resumeCard, { backgroundColor: colors.background }]}
          >
            <View style={styles.resumeContent}>
              <View style={styles.resumeInfo}>
                <Text style={[styles.resumeTitle, { color: colors.text }]}>Continue Learning</Text>
                <Text style={[styles.resumeSubtitle, { color: colors.textSecondary }]}>
                  React Native Advanced - Lesson 8
                </Text>
                <Text style={[styles.resumeProgress, { color: colors.primary[500] }]}>
                  12 minutes left
                </Text>
              </View>
              <Button
                title="Resume"
                variant="primary"
                size="small"
                icon={<Play size={16} color="white" />}
                iconPosition="left"
                onPress={() => {}}
                style={styles.resumeButton}
              />
            </View>
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
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  checkInCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodOption: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 80,
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  aiSuggestionBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiSuggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiTextContent: {
    flex: 1,
  },
  aiSuggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  aiSuggestionText: {
    fontSize: 14,
  },
  aiActionButton: {
    marginLeft: 12,
  },
  todaysPlanCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  planItems: {
    marginBottom: 20,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressOverviewCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    marginBottom: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  dailyTipCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    fontWeight: '500',
    marginLeft: 6,
  },
  resumeCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resumeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumeInfo: {
    flex: 1,
  },
  resumeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  resumeSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  resumeProgress: {
    fontSize: 12,
    fontWeight: '500',
  },
  resumeButton: {
    marginLeft: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});