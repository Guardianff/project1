import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BookOpen, Clock, Zap, Brain, Coffee, Moon, Sun, Target } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { Badge } from '@/components/ui/Badge';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface SmartRecommendationsProps {
  userMood?: string | null;
  currentStreak: number;
  timeOfDay: number; // 0-23
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'course' | 'exercise' | 'challenge' | 'break';
  icon: React.ReactNode;
  color: string;
  reason: string;
}

export function SmartRecommendations({ userMood, currentStreak, timeOfDay }: SmartRecommendationsProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Time-based recommendations
    if (timeOfDay >= 6 && timeOfDay < 12) {
      recommendations.push({
        id: 'morning-focus',
        title: 'Morning Focus Session',
        description: 'Start your day with concentrated learning',
        duration: '25 min',
        difficulty: 'Medium',
        type: 'course',
        icon: <Sun size={20} color="white" />,
        color: colors.warning[500],
        reason: 'Perfect for morning productivity',
      });
    } else if (timeOfDay >= 12 && timeOfDay < 17) {
      recommendations.push({
        id: 'afternoon-challenge',
        title: 'Quick Challenge',
        description: 'Beat the afternoon slump with a brain teaser',
        duration: '10 min',
        difficulty: 'Easy',
        type: 'challenge',
        icon: <Zap size={20} color="white" />,
        color: colors.primary[500],
        reason: 'Boost your afternoon energy',
      });
    } else {
      recommendations.push({
        id: 'evening-review',
        title: 'Evening Review',
        description: 'Reflect on today\'s learning',
        duration: '15 min',
        difficulty: 'Easy',
        type: 'exercise',
        icon: <Moon size={20} color="white" />,
        color: colors.accent[500],
        reason: 'Wind down with reflection',
      });
    }

    // Mood-based recommendations
    if (userMood === 'energized') {
      recommendations.push({
        id: 'advanced-topic',
        title: 'Advanced React Patterns',
        description: 'Dive deep into complex concepts',
        duration: '45 min',
        difficulty: 'Hard',
        type: 'course',
        icon: <Brain size={20} color="white" />,
        color: colors.error[500],
        reason: 'You\'re energized for a challenge',
      });
    } else if (userMood === 'focused') {
      recommendations.push({
        id: 'deep-work',
        title: 'Deep Learning Session',
        description: 'Uninterrupted focus time',
        duration: '60 min',
        difficulty: 'Medium',
        type: 'course',
        icon: <Target size={20} color="white" />,
        color: colors.primary[600],
        reason: 'Perfect for focused learning',
      });
    } else if (userMood === 'tired') {
      recommendations.push({
        id: 'light-reading',
        title: 'Light Reading',
        description: 'Easy-to-digest content',
        duration: '10 min',
        difficulty: 'Easy',
        type: 'course',
        icon: <Coffee size={20} color="white" />,
        color: colors.neutral[500],
        reason: 'Gentle learning when tired',
      });
    }

    // Streak-based recommendations
    if (currentStreak >= 7) {
      recommendations.push({
        id: 'streak-bonus',
        title: 'Streak Bonus Challenge',
        description: 'Special challenge for streak masters',
        duration: '20 min',
        difficulty: 'Medium',
        type: 'challenge',
        icon: <BookOpen size={20} color="white" />,
        color: colors.success[500],
        reason: `Celebrating your ${currentStreak}-day streak!`,
      });
    }

    return recommendations.slice(0, 3); // Limit to 3 recommendations
  };

  const recommendations = generateRecommendations();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return colors.success[500];
      case 'Medium': return colors.warning[500];
      case 'Hard': return colors.error[500];
      default: return colors.neutral[500];
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended for You</Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
        Personalized based on your mood, time, and progress
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendationsList}
      >
        {recommendations.map((recommendation, index) => (
          <Animated.View
            key={recommendation.id}
            entering={FadeInRight.delay(index * 200).duration(600)}
            style={styles.recommendationCard}
          >
            <EnhancedCard
              variant="elevated"
              interactive
              glowEffect
              onPress={() => {}}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: recommendation.color }]}>
                  {recommendation.icon}
                </View>
                <View style={styles.badges}>
                  <Badge 
                    label={recommendation.difficulty} 
                    variant="neutral" 
                    size="small"
                    style={{ backgroundColor: getDifficultyColor(recommendation.difficulty) + '20' }}
                    textStyle={{ color: getDifficultyColor(recommendation.difficulty) }}
                  />
                  <Badge 
                    label={recommendation.duration} 
                    variant="neutral" 
                    size="small" 
                  />
                </View>
              </View>
              
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {recommendation.title}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {recommendation.description}
              </Text>
              
              <View style={[styles.reasonContainer, { backgroundColor: `${recommendation.color}15` }]}>
                <Text style={[styles.reasonText, { color: recommendation.color }]}>
                  {recommendation.reason}
                </Text>
              </View>
            </EnhancedCard>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  recommendationsList: {
    paddingHorizontal: 20,
  },
  recommendationCard: {
    width: 280,
    marginRight: 16,
  },
  card: {
    padding: 16,
    height: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    flex: 1,
  },
  reasonContainer: {
    padding: 8,
    borderRadius: 8,
    marginTop: 'auto',
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});