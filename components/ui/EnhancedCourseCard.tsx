import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, BookOpen, Star, Play, Users } from 'lucide-react-native';
import { Course } from '@/types/course';
import { DesignTokens, AccessibilityTokens } from '@/constants/DesignSystem';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from './EnhancedCard';
import { EnhancedButton } from './EnhancedButton';
import Animated, { 
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface EnhancedCourseCardProps {
  course: Course;
  index?: number;
  layout?: 'grid' | 'list';
}

const { width: screenWidth } = Dimensions.get('window');

export function EnhancedCourseCard({ 
  course, 
  index = 0, 
  layout = 'grid' 
}: EnhancedCourseCardProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? DesignTokens.colors : DesignTokens.colors;
  
  // Animation values
  const scale = useSharedValue(1);
  const elevation = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1 + elevation.value * 0.1,
      },
      android: {
        elevation: 2 + elevation.value * 4,
      },
    }),
  }));
  
  const handlePress = () => {
    router.push(`/course/${course.id}`);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    elevation.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    elevation.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return colors.success[500];
      case 'intermediate':
        return colors.warning[500];
      case 'advanced':
        return colors.error[500];
      default:
        return colors.neutral[500];
    }
  };

  const cardWidth = layout === 'grid' 
    ? (screenWidth - DesignTokens.spacing[8]) / 2 - DesignTokens.spacing[2]
    : screenWidth - DesignTokens.spacing[8];

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).duration(400).springify()}
      style={[
        styles.container,
        { width: cardWidth },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`Course: ${course.title}`}
        accessibilityHint="Tap to view course details"
      >
        <EnhancedCard variant="elevated" size="md" style={styles.card}>
          {/* Course Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: course.thumbnail }} 
              style={styles.courseImage}
              accessibilityIgnoresInvertColors
            />
            
            {/* Featured Badge */}
            {course.isFeatured && (
              <View style={[styles.featuredBadge, { backgroundColor: colors.accent[500] }]}>
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
            
            {/* Play Button Overlay */}
            <View style={styles.playOverlay}>
              <View style={[styles.playButton, { backgroundColor: colors.primary[500] }]}>
                <Play size={16} color={colors.neutral[0]} fill={colors.neutral[0]} />
              </View>
            </View>
          </View>
          
          {/* Course Content */}
          <View style={styles.content}>
            {/* Header with Level and Rating */}
            <View style={styles.header}>
              <View style={[
                styles.levelBadge, 
                { backgroundColor: `${getLevelColor(course.level)}20` }
              ]}>
                <Text style={[
                  styles.levelText, 
                  { color: getLevelColor(course.level) }
                ]}>
                  {course.level}
                </Text>
              </View>
              
              <View style={styles.rating}>
                <Star 
                  size={14} 
                  color={colors.warning[500]} 
                  fill={colors.warning[500]} 
                />
                <Text style={[styles.ratingText, { color: colors.neutral[600] }]}>
                  {course.rating}
                </Text>
              </View>
            </View>
            
            {/* Title */}
            <Text 
              style={[
                styles.title, 
                { 
                  color: colors.neutral[900],
                  fontFamily: DesignTokens.typography.fontFamilies.sans[0],
                }
              ]} 
              numberOfLines={2}
            >
              {course.title}
            </Text>
            
            {/* Description */}
            <Text 
              style={[
                styles.description, 
                { 
                  color: colors.neutral[600],
                  fontFamily: DesignTokens.typography.fontFamilies.sans[0],
                }
              ]} 
              numberOfLines={2}
            >
              {course.description}
            </Text>
            
            {/* Metadata */}
            <View style={styles.metadata}>
              <View style={styles.metaItem}>
                <Clock size={14} color={colors.neutral[500]} />
                <Text style={[styles.metaText, { color: colors.neutral[600] }]}>
                  {formatDuration(course.duration)}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <BookOpen size={14} color={colors.neutral[500]} />
                <Text style={[styles.metaText, { color: colors.neutral[600] }]}>
                  {course.lessonsCount} lessons
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <Users size={14} color={colors.neutral[500]} />
                <Text style={[styles.metaText, { color: colors.neutral[600] }]}>
                  {formatEnrollmentCount(course.enrolledCount)}
                </Text>
              </View>
            </View>
            
            {/* Progress Bar */}
            {course.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.neutral[200] }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colors.primary[500], 
                        width: `${course.progress}%` 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.neutral[600] }]}>
                  {course.progress}% complete
                </Text>
              </View>
            )}
            
            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.instructor}>
                <Image 
                  source={{ uri: course.instructor.avatar }} 
                  style={styles.instructorAvatar} 
                />
                <Text style={[styles.instructorName, { color: colors.neutral[600] }]}>
                  {course.instructor.name}
                </Text>
              </View>
              
              <View style={styles.pricing}>
                {course.price ? (
                  <Text style={[styles.price, { color: colors.neutral[900] }]}>
                    ${course.price}
                  </Text>
                ) : (
                  <Text style={[styles.free, { color: colors.success[600] }]}>
                    Free
                  </Text>
                )}
              </View>
            </View>
            
            {/* Action Button */}
            <EnhancedButton
              title={course.progress > 0 ? "Continue" : "Start Learning"}
              variant="primary"
              size="sm"
              fullWidth
              onPress={handlePress}
              icon={<Play size={16} color={colors.neutral[0]} />}
              iconPosition="left"
              style={styles.actionButton}
            />
          </View>
        </EnhancedCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: DesignTokens.spacing[4],
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredBadge: {
    position: 'absolute',
    top: DesignTokens.spacing[3],
    right: DesignTokens.spacing[3],
    paddingHorizontal: DesignTokens.spacing[2],
    paddingVertical: DesignTokens.spacing[1],
    borderRadius: DesignTokens.borderRadius.sm,
  },
  featuredText: {
    color: 'white',
    fontSize: DesignTokens.typography.fontSizes.xs,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...DesignTokens.shadows.md,
  },
  content: {
    padding: DesignTokens.spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing[3],
  },
  levelBadge: {
    paddingHorizontal: DesignTokens.spacing[2],
    paddingVertical: DesignTokens.spacing[1],
    borderRadius: DesignTokens.borderRadius.sm,
  },
  levelText: {
    fontSize: DesignTokens.typography.fontSizes.xs,
    fontWeight: DesignTokens.typography.fontWeights.medium,
    textTransform: 'capitalize',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing[1],
  },
  ratingText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.medium,
  },
  title: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
    lineHeight: DesignTokens.typography.lineHeights.snug,
    marginBottom: DesignTokens.spacing[2],
  },
  description: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    lineHeight: DesignTokens.typography.lineHeights.normal,
    marginBottom: DesignTokens.spacing[3],
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignTokens.spacing[3],
    marginBottom: DesignTokens.spacing[3],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing[1],
  },
  metaText: {
    fontSize: DesignTokens.typography.fontSizes.xs,
    fontWeight: DesignTokens.typography.fontWeights.medium,
  },
  progressContainer: {
    marginBottom: DesignTokens.spacing[4],
  },
  progressBar: {
    height: 6,
    borderRadius: DesignTokens.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: DesignTokens.spacing[1],
  },
  progressFill: {
    height: '100%',
    borderRadius: DesignTokens.borderRadius.sm,
  },
  progressText: {
    fontSize: DesignTokens.typography.fontSizes.xs,
    fontWeight: DesignTokens.typography.fontWeights.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing[4],
  },
  instructor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  instructorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: DesignTokens.spacing[2],
  },
  instructorName: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.medium,
    flex: 1,
  },
  pricing: {
    marginLeft: DesignTokens.spacing[2],
  },
  price: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.bold,
  },
  free: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.bold,
  },
  actionButton: {
    marginTop: DesignTokens.spacing[2],
  },
});