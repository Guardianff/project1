import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, BookOpen, Star, Users, Play } from 'lucide-react-native';
import { Course } from '@/types/course';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from './EnhancedCard';
import { ProgressIndicator } from './ProgressIndicator';
import { Badge } from './Badge';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface CourseCardProps {
  course: Course;
  index?: number; // For staggered animations
  variant?: 'default' | 'compact' | 'featured';
}

export function CourseCard({ course, index = 0, variant = 'default' }: CourseCardProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const handlePress = () => {
    // Navigate to course detail screen
    router.push(`/course/${course.id}`);
  };

  // Format duration (minutes to hours and minutes)
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 
      ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`
      : `${mins}m`;
  };

  const formatEnrollmentCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (variant === 'compact') {
    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 100).duration(500)}
        style={styles.compactContainer}
      >
        <EnhancedCard
          variant="elevated"
          interactive
          glowEffect
          onPress={handlePress}
          style={styles.compactCard}
        >
          <View style={styles.compactContent}>
            <Image source={{ uri: course.thumbnail }} style={styles.compactImage} />
            <View style={styles.compactInfo}>
              <Text style={[styles.compactTitle, { color: colors.text }]} numberOfLines={2}>
                {course.title}
              </Text>
              <Text style={[styles.compactInstructor, { color: colors.textSecondary }]}>
                {course.instructor.name}
              </Text>
              <View style={styles.compactMeta}>
                <View style={styles.compactMetaItem}>
                  <Star size={12} color={colors.warning[500]} fill={colors.warning[500]} />
                  <Text style={[styles.compactMetaText, { color: colors.textSecondary }]}>
                    {course.rating}
                  </Text>
                </View>
                <View style={styles.compactMetaItem}>
                  <Clock size={12} color={colors.neutral[500]} />
                  <Text style={[styles.compactMetaText, { color: colors.textSecondary }]}>
                    {formatDuration(course.duration)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {course.progress > 0 && (
            <ProgressIndicator
              progress={course.progress}
              size="sm"
              showLabel={false}
              style={styles.compactProgress}
            />
          )}
        </EnhancedCard>
      </Animated.View>
    );
  }

  if (variant === 'featured') {
    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 150).duration(600)}
        style={styles.featuredContainer}
      >
        <EnhancedCard
          variant="glass"
          interactive
          glowEffect
          onPress={handlePress}
          style={styles.featuredCard}
        >
          <View style={styles.featuredImageContainer}>
            <Image source={{ uri: course.thumbnail }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay}>
              <View style={[styles.playButton, { backgroundColor: colors.primary[500] }]}>
                <Play size={20} color="white" />
              </View>
            </View>
            {course.isFeatured && (
              <View style={[styles.featuredBadge, { backgroundColor: colors.secondary[500] }]}>
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
          </View>
          
          <View style={styles.featuredContent}>
            <Badge
              label={course.level}
              variant="primary"
              size="small"
              style={styles.levelBadge}
            />
            
            <Text style={[styles.featuredTitle, { color: colors.text }]} numberOfLines={2}>
              {course.title}
            </Text>
            <Text style={[styles.featuredDescription, { color: colors.textSecondary }]} numberOfLines={2}>
              {course.description}
            </Text>
            
            <View style={styles.featuredMeta}>
              <View style={styles.featuredMetaItem}>
                <Image source={{ uri: course.instructor.avatar }} style={styles.instructorAvatar} />
                <Text style={[styles.instructorName, { color: colors.textSecondary }]}>
                  {course.instructor.name}
                </Text>
              </View>
              
              <View style={styles.featuredStats}>
                <View style={styles.featuredStatItem}>
                  <Star size={14} color={colors.warning[500]} fill={colors.warning[500]} />
                  <Text style={[styles.featuredStatText, { color: colors.textSecondary }]}>
                    {course.rating} ({course.reviewsCount})
                  </Text>
                </View>
                <View style={styles.featuredStatItem}>
                  <Users size={14} color={colors.neutral[500]} />
                  <Text style={[styles.featuredStatText, { color: colors.textSecondary }]}>
                    {formatEnrollmentCount(course.enrolledCount)}
                  </Text>
                </View>
              </View>
            </View>
            
            {course.progress > 0 && (
              <ProgressIndicator
                progress={course.progress}
                size="md"
                showLabel
                label={`${course.progress}% complete`}
                style={styles.featuredProgress}
              />
            )}
          </View>
        </EnhancedCard>
      </Animated.View>
    );
  }

  // Default variant
  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={styles.defaultContainer}
    >
      <EnhancedCard
        variant="elevated"
        interactive
        glowEffect
        onPress={handlePress}
        style={styles.defaultCard}
      >
        <Image source={{ uri: course.thumbnail }} style={styles.defaultImage} />
        
        {course.isFeatured && (
          <View style={[styles.featuredBadge, { backgroundColor: colors.secondary[500] }]}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.defaultContent}>
          <Badge
            label={course.level}
            variant="neutral"
            size="small"
            style={styles.levelBadge}
          />
          
          <Text style={[styles.defaultTitle, { color: colors.text }]} numberOfLines={2}>
            {course.title}
          </Text>
          <Text style={[styles.defaultDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {course.description}
          </Text>
          
          <View style={styles.defaultMeta}>
            <View style={styles.defaultMetaItem}>
              <Clock size={14} color={colors.neutral[500]} />
              <Text style={[styles.defaultMetaText, { color: colors.textSecondary }]}>
                {formatDuration(course.duration)}
              </Text>
            </View>
            
            <View style={styles.defaultMetaItem}>
              <BookOpen size={14} color={colors.neutral[500]} />
              <Text style={[styles.defaultMetaText, { color: colors.textSecondary }]}>
                {course.lessonsCount} lessons
              </Text>
            </View>
            
            <View style={styles.defaultMetaItem}>
              <Star size={14} color={colors.warning[500]} fill={colors.warning[500]} />
              <Text style={[styles.defaultMetaText, { color: colors.textSecondary }]}>
                {course.rating} ({course.reviewsCount})
              </Text>
            </View>
          </View>
          
          {course.progress > 0 && (
            <ProgressIndicator
              progress={course.progress}
              size="sm"
              showLabel
              label={`${course.progress}% complete`}
              style={styles.defaultProgress}
            />
          )}
          
          <View style={styles.defaultFooter}>
            <View style={styles.instructorContainer}>
              <Image source={{ uri: course.instructor.avatar }} style={styles.instructorImage} />
              <Text style={[styles.instructorName, { color: colors.textSecondary }]}>
                {course.instructor.name}
              </Text>
            </View>
            
            {course.price ? (
              <Text style={[styles.price, { color: colors.text }]}>${course.price}</Text>
            ) : (
              <Text style={[styles.free, { color: colors.success[500] }]}>Free</Text>
            )}
          </View>
        </View>
      </EnhancedCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Compact variant
  compactContainer: {
    width: '100%',
    marginBottom: 12,
  },
  compactCard: {
    padding: 12,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  compactInstructor: {
    fontSize: 14,
    marginBottom: 8,
  },
  compactMeta: {
    flexDirection: 'row',
  },
  compactMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  compactMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  compactProgress: {
    marginTop: 12,
  },

  // Featured variant
  featuredContainer: {
    width: 300,
    marginRight: 16,
  },
  featuredCard: {
    padding: 0,
    overflow: 'hidden',
  },
  featuredImageContainer: {
    position: 'relative',
    height: 160,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  featuredDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuredMeta: {
    marginBottom: 16,
  },
  featuredMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredStats: {
    flexDirection: 'row',
  },
  featuredStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  featuredStatText: {
    fontSize: 12,
    marginLeft: 4,
  },
  featuredProgress: {
    marginTop: 8,
  },

  // Default variant
  defaultContainer: {
    width: '100%',
    marginBottom: 16,
  },
  defaultCard: {
    padding: 0,
    overflow: 'hidden',
  },
  defaultImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  defaultContent: {
    padding: 16,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  defaultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  defaultDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  defaultMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  defaultMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  defaultMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  defaultProgress: {
    marginBottom: 12,
  },
  defaultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  instructorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  instructorName: {
    fontSize: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  free: {
    fontSize: 16,
    fontWeight: '600',
  },
});