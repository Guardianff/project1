import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, BookOpen, Star } from 'lucide-react-native';
import { Course } from '@/types/course';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface CourseCardProps {
  course: Course;
  index?: number; // For staggered animations
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
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

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).duration(400).springify()}
      style={styles.animatedContainer}
    >
      <TouchableOpacity 
        style={[styles.container, { backgroundColor: colors.background }]} 
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: course.thumbnail }} style={styles.image} />
        
        {course.isFeatured && (
          <View style={[styles.featuredBadge, { backgroundColor: colors.secondary[500] }]}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.content}>
          <View style={[styles.levelBadge, { backgroundColor: colors.neutral[100] }]}>
            <Text style={[styles.levelText, { color: colors.neutral[700] }]}>{course.level}</Text>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{course.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{course.description}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.neutral[500]} />
              <Text style={[styles.metaText, { color: colors.neutral[600] }]}>{formatDuration(course.duration)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <BookOpen size={14} color={colors.neutral[500]} />
              <Text style={[styles.metaText, { color: colors.neutral[600] }]}>{course.lessonsCount} lessons</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Star size={14} color={colors.warning[500]} />
              <Text style={[styles.metaText, { color: colors.neutral[600] }]}>{course.rating} ({course.reviewsCount})</Text>
            </View>
          </View>
          
          {course.progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.neutral[200] }]}>
                <View style={[styles.progressFill, { backgroundColor: colors.primary[500], width: `${course.progress}%` }]} />
              </View>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>{course.progress}% complete</Text>
            </View>
          )}
          
          <View style={styles.footer}>
            <View style={styles.instructorContainer}>
              <Image source={{ uri: course.instructor.avatar }} style={styles.instructorImage} />
              <Text style={[styles.instructorName, { color: colors.neutral[600] }]}>{course.instructor.name}</Text>
            </View>
            
            {course.price ? (
              <Text style={[styles.price, { color: colors.text }]}>${course.price}</Text>
            ) : (
              <Text style={[styles.free, { color: colors.success[500] }]}>Free</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    width: '100%',
    marginBottom: 16,
  },
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
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
  content: {
    padding: 16,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
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