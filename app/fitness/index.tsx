import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Dumbbell, Clock, Calendar, Heart, TrendingUp, Play, Flame, Activity, Zap, Plus } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BoltBadge } from '@/components/ui/BoltBadge';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface Workout {
  id: string;
  title: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  category: 'cardio' | 'strength' | 'flexibility' | 'recovery';
  thumbnail: string;
  instructor: string;
  calories: number;
}

export default function FitnessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fitnessStats = {
    streak: 7,
    weeklyWorkouts: 4,
    monthlyWorkouts: 16,
    totalMinutes: 420,
    caloriesBurned: 2450,
  };

  const workouts: Workout[] = [
    {
      id: '1',
      title: '15-Minute HIIT',
      duration: 15,
      intensity: 'high',
      category: 'cardio',
      thumbnail: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
      instructor: 'Sarah Johnson',
      calories: 180,
    },
    {
      id: '2',
      title: 'Full Body Strength',
      duration: 30,
      intensity: 'medium',
      category: 'strength',
      thumbnail: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
      instructor: 'Michael Chen',
      calories: 250,
    },
    {
      id: '3',
      title: 'Morning Yoga Flow',
      duration: 20,
      intensity: 'low',
      category: 'flexibility',
      thumbnail: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=800',
      instructor: 'Emma Wilson',
      calories: 120,
    },
    {
      id: '4',
      title: 'Recovery Stretching',
      duration: 15,
      intensity: 'low',
      category: 'recovery',
      thumbnail: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800',
      instructor: 'David Lee',
      calories: 80,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Workouts' },
    { id: 'cardio', name: 'Cardio' },
    { id: 'strength', name: 'Strength' },
    { id: 'flexibility', name: 'Flexibility' },
    { id: 'recovery', name: 'Recovery' },
  ];

  const filteredWorkouts = selectedCategory === 'all' 
    ? workouts 
    : workouts.filter(workout => workout.category === selectedCategory);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return colors.success[500];
      case 'medium': return colors.warning[500];
      case 'high': return colors.error[500];
      default: return colors.neutral[500];
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cardio': return <Heart size={16} color={colors.error[500]} />;
      case 'strength': return <Dumbbell size={16} color={colors.primary[500]} />;
      case 'flexibility': return <Activity size={16} color={colors.accent[500]} />;
      case 'recovery': return <Zap size={16} color={colors.success[500]} />;
      default: return <Dumbbell size={16} color={colors.neutral[500]} />;
    }
  };

  const handleStartWorkout = (workout: Workout) => {
    Alert.alert(
      `Start ${workout.title}`,
      `Ready to begin this ${workout.duration}-minute ${workout.category} workout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Now', onPress: () => startWorkoutSession(workout) },
      ]
    );
  };

  const startWorkoutSession = (workout: Workout) => {
    // In a real app, this would navigate to a workout session screen
    Alert.alert('Workout Started', `Enjoy your ${workout.title} workout!`);
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Fitness</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Stay active and healthy
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary[500] }]}
            onPress={() => Alert.alert('Create Workout', 'Create a custom workout plan')}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Fitness Stats */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.statsSection}>
            <GlassCard style={styles.statsCard}>
              <View style={styles.statsHeader}>
                <View style={[styles.streakBadge, { backgroundColor: colors.warning[50] }]}>
                  <Flame size={16} color={colors.warning[500]} />
                  <Text style={[styles.streakText, { color: colors.warning[600] }]}>
                    {fitnessStats.streak}-Day Streak
                  </Text>
                </View>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {fitnessStats.weeklyWorkouts}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    This Week
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {fitnessStats.totalMinutes}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Minutes
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {fitnessStats.caloriesBurned}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Calories
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Quick Start */}
          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.quickStartSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Start</Text>
            
            <View style={styles.quickStartGrid}>
              <TouchableOpacity 
                style={[styles.quickStartCard, { backgroundColor: colors.primary[500] }]}
                onPress={() => handleStartWorkout(workouts[0])}
              >
                <Dumbbell size={24} color="white" />
                <Text style={styles.quickStartText}>15-Min HIIT</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickStartCard, { backgroundColor: colors.success[500] }]}
                onPress={() => handleStartWorkout(workouts[2])}
              >
                <Activity size={24} color="white" />
                <Text style={styles.quickStartText}>Morning Yoga</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickStartCard, { backgroundColor: colors.warning[500] }]}
                onPress={() => handleStartWorkout(workouts[1])}
              >
                <TrendingUp size={24} color="white" />
                <Text style={styles.quickStartText}>Strength</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickStartCard, { backgroundColor: colors.accent[500] }]}
                onPress={() => handleStartWorkout(workouts[3])}
              >
                <Zap size={24} color="white" />
                <Text style={styles.quickStartText}>Recovery</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Category Filter */}
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.categoriesSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: colors.neutral[100] },
                    selectedCategory === category.id && { 
                      backgroundColor: colors.primary[50], 
                      borderColor: colors.primary[200] 
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: colors.neutral[600] },
                      selectedCategory === category.id && { 
                        color: colors.primary[600], 
                        fontWeight: '600' 
                      }
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Workouts List */}
          <View style={styles.workoutsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Workouts</Text>
            
            {filteredWorkouts.map((workout, index) => (
              <Animated.View
                key={workout.id}
                entering={FadeInRight.delay(500 + index * 100).duration(500)}
              >
                <EnhancedCard
                  variant="elevated"
                  interactive
                  glowEffect
                  onPress={() => handleStartWorkout(workout)}
                  style={styles.workoutCard}
                >
                  <View style={styles.workoutContent}>
                    <Image source={{ uri: workout.thumbnail }} style={styles.workoutImage} />
                    
                    <View style={styles.workoutInfo}>
                      <View style={styles.workoutHeader}>
                        <Badge
                          label={workout.category}
                          variant="neutral"
                          size="small"
                          style={{ backgroundColor: `${getCategoryIcon(workout.category).props.color}15` }}
                          textStyle={{ color: getCategoryIcon(workout.category).props.color }}
                        />
                        <Badge
                          label={workout.intensity}
                          variant="neutral"
                          size="small"
                          style={{ backgroundColor: `${getIntensityColor(workout.intensity)}15` }}
                          textStyle={{ color: getIntensityColor(workout.intensity) }}
                        />
                      </View>
                      
                      <Text style={[styles.workoutTitle, { color: colors.text }]}>
                        {workout.title}
                      </Text>
                      
                      <Text style={[styles.workoutInstructor, { color: colors.textSecondary }]}>
                        {workout.instructor}
                      </Text>
                      
                      <View style={styles.workoutMeta}>
                        <View style={styles.metaItem}>
                          <Clock size={14} color={colors.neutral[500]} />
                          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                            {workout.duration} min
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Flame size={14} color={colors.warning[500]} />
                          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                            {workout.calories} cal
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.playButton, { backgroundColor: colors.primary[500] }]}
                      onPress={() => handleStartWorkout(workout)}
                    >
                      <Play size={20} color="white" fill="white" />
                    </TouchableOpacity>
                  </View>
                </EnhancedCard>
              </Animated.View>
            ))}
          </View>

          {/* Schedule Section */}
          <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.scheduleSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Schedule</Text>
              <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: colors.primary[500] }]}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <EnhancedCard variant="glass" style={styles.scheduleCard}>
              <View style={styles.scheduleItem}>
                <View style={[styles.scheduleDate, { backgroundColor: colors.primary[50] }]}>
                  <Text style={[styles.scheduleDay, { color: colors.primary[600] }]}>MON</Text>
                  <Text style={[styles.scheduleNumber, { color: colors.primary[700] }]}>15</Text>
                </View>
                
                <View style={styles.scheduleInfo}>
                  <Text style={[styles.scheduleTitle, { color: colors.text }]}>
                    Morning Yoga Flow
                  </Text>
                  <View style={styles.scheduleDetails}>
                    <View style={styles.scheduleDetail}>
                      <Clock size={14} color={colors.neutral[500]} />
                      <Text style={[styles.scheduleDetailText, { color: colors.textSecondary }]}>
                        7:00 AM • 20 min
                      </Text>
                    </View>
                    <View style={styles.scheduleDetail}>
                      <Activity size={14} color={colors.accent[500]} />
                      <Text style={[styles.scheduleDetailText, { color: colors.textSecondary }]}>
                        Flexibility
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Button
                  title="Join"
                  variant="primary"
                  size="small"
                  onPress={() => {}}
                  style={{ backgroundColor: colors.accent[500] }}
                />
              </View>
              
              <View style={styles.scheduleItem}>
                <View style={[styles.scheduleDate, { backgroundColor: colors.warning[50] }]}>
                  <Text style={[styles.scheduleDay, { color: colors.warning[600] }]}>WED</Text>
                  <Text style={[styles.scheduleNumber, { color: colors.warning[700] }]}>17</Text>
                </View>
                
                <View style={styles.scheduleInfo}>
                  <Text style={[styles.scheduleTitle, { color: colors.text }]}>
                    HIIT Cardio Blast
                  </Text>
                  <View style={styles.scheduleDetails}>
                    <View style={styles.scheduleDetail}>
                      <Clock size={14} color={colors.neutral[500]} />
                      <Text style={[styles.scheduleDetailText, { color: colors.textSecondary }]}>
                        6:30 PM • 30 min
                      </Text>
                    </View>
                    <View style={styles.scheduleDetail}>
                      <Heart size={14} color={colors.error[500]} />
                      <Text style={[styles.scheduleDetailText, { color: colors.textSecondary }]}>
                        Cardio
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Button
                  title="Join"
                  variant="primary"
                  size="small"
                  onPress={() => {}}
                  style={{ backgroundColor: colors.error[500] }}
                />
              </View>
            </EnhancedCard>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
        
        {/* Bolt Badge */}
        <BoltBadge 
          position="bottom-right" 
          variant={isDarkMode ? "white" : "black"}
          size="small"
        />
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
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsCard: {
    padding: 20,
  },
  statsHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
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
  quickStartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickStartGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStartCard: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  quickStartText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workoutsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  workoutCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  workoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  workoutImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutInstructor: {
    fontSize: 14,
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleCard: {
    padding: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.3)',
  },
  scheduleDate: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scheduleDay: {
    fontSize: 10,
    fontWeight: '600',
  },
  scheduleNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  scheduleDetailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 80,
  },
});