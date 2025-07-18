import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Filter, Import as SortAsc, BookOpen, Clock, Star, Users, Play } from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataService } from '@/services/DataService';
import { Course } from '@/types/course';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const [category, setCategory] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const categoryData = await DataService.getCategoryById(id || '');
        setCategory(categoryData);

        const coursesData = await DataService.getCoursesByCategory(id || '');
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryData();
    }
  }, [id]);

  // Filter and sort courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchQuery === '' || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return 0; // Would sort by creation date in real app
      case 'popular':
      default:
        return b.enrolledCount - a.enrolledCount;
    }
  });

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

  const handleCoursePress = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const renderCourse = (course: Course, index: number) => (
    <Animated.View
      key={course.id}
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={styles.courseCard}
    >
      <TouchableOpacity
        onPress={() => handleCoursePress(course.id)}
        style={[styles.courseCardContent, { backgroundColor: colors.background }]}
        activeOpacity={0.9}
      >
        <Image source={{ uri: course.thumbnail }} style={styles.courseImage} />
        
        {course.isFeatured && (
          <View style={[styles.featuredBadge, { backgroundColor: category?.color || colors.primary[500] }]}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.courseContent}>
          <View style={styles.courseHeader}>
            <Badge
              label={course.level}
              variant="neutral"
              size="small"
            />
            <View style={styles.ratingContainer}>
              <Star size={14} color={colors.warning[500]} fill={colors.warning[500]} />
              <Text style={[styles.ratingText, { color: colors.neutral[600] }]}>
                {course.rating} ({course.reviewsCount})
              </Text>
            </View>
          </View>
          
          <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={2}>
            {course.title}
          </Text>
          <Text style={[styles.courseDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {course.description}
          </Text>
          
          <View style={styles.instructorContainer}>
            <Image source={{ uri: course.instructor.avatar }} style={styles.instructorAvatar} />
            <Text style={[styles.instructorName, { color: colors.neutral[600] }]}>
              {course.instructor.name}
            </Text>
          </View>
          
          <View style={styles.courseMetrics}>
            <View style={styles.metric}>
              <Clock size={14} color={colors.neutral[500]} />
              <Text style={[styles.metricText, { color: colors.neutral[600] }]}>
                {formatDuration(course.duration)}
              </Text>
            </View>
            <View style={styles.metric}>
              <BookOpen size={14} color={colors.neutral[500]} />
              <Text style={[styles.metricText, { color: colors.neutral[600] }]}>
                {course.lessonsCount} lessons
              </Text>
            </View>
            <View style={styles.metric}>
              <Users size={14} color={colors.neutral[500]} />
              <Text style={[styles.metricText, { color: colors.neutral[600] }]}>
                {formatEnrollmentCount(course.enrolledCount)}
              </Text>
            </View>
          </View>
          
          <View style={styles.courseFooter}>
            {course.price ? (
              <Text style={[styles.price, { color: colors.text }]}>${course.price}</Text>
            ) : (
              <Text style={[styles.free, { color: colors.success[500] }]}>Free</Text>
            )}
            
            <Button
              title="Start Learning"
              variant="primary"
              size="small"
              icon={<Play size={16} color="white" />}
              iconPosition="left"
              onPress={() => handleCoursePress(course.id)}
              style={[styles.startButton, { backgroundColor: category?.color || colors.primary[500] }]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.duration(400)}
          style={[styles.header, { borderBottomColor: colors.divider }]}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{category?.name || 'Category'}</Text>
            <Text style={[styles.headerDescription, { color: colors.textSecondary }]}>
              {category?.description || 'Explore courses in this category'}
            </Text>
          </View>
        </Animated.View>

        {/* Search and Filters */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <SearchBar
            placeholder={`Search ${category?.name?.toLowerCase() || 'category'} courses...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <View style={styles.filtersContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersList}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { backgroundColor: colors.neutral[100] },
                  !selectedLevel && { backgroundColor: colors.primary[50], borderColor: colors.primary[200] }
                ]}
                onPress={() => setSelectedLevel(null)}
              >
                <Text style={[
                  styles.filterChipText,
                  { color: colors.neutral[600] },
                  !selectedLevel && { color: colors.primary[600], fontWeight: '600' }
                ]}>
                  All Levels
                </Text>
              </TouchableOpacity>
              
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterChip,
                    { backgroundColor: colors.neutral[100] },
                    selectedLevel === level && { backgroundColor: colors.primary[50], borderColor: colors.primary[200] }
                  ]}
                  onPress={() => setSelectedLevel(selectedLevel === level ? null : level)}
                >
                  <Text style={[
                    styles.filterChipText,
                    { color: colors.neutral[600] },
                    selectedLevel === level && { color: colors.primary[600], fontWeight: '600' }
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={[styles.sortButton, { backgroundColor: colors.neutral[100] }]}>
              <SortAsc size={16} color={colors.neutral[600]} />
              <Text style={[styles.sortButtonText, { color: colors.neutral[600] }]}>Sort</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Course Count */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.resultsContainer}
        >
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {sortedCourses.length} {sortedCourses.length === 1 ? 'course' : 'courses'} found
          </Text>
        </Animated.View>

        {/* Courses List */}
        <ScrollView 
          style={styles.coursesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.coursesContent}
        >
          {loading ? (
            <Animated.View 
              entering={FadeInUp.delay(300).duration(400)}
              style={styles.loadingContainer}
            >
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading courses...
              </Text>
            </Animated.View>
          ) : sortedCourses.length === 0 ? (
            <Animated.View 
              entering={FadeInUp.delay(300).duration(400)}
              style={styles.emptyState}
            >
              <BookOpen size={48} color={colors.neutral[400]} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No courses found
              </Text>
              <Text style={[styles.emptyStateMessage, { color: colors.textSecondary }]}>
                Try adjusting your search or filters
              </Text>
            </Animated.View>
          ) : (
            sortedCourses.map((course, index) => renderCourse(course, index))
          )}
          
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  headerContent: {
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filtersList: {
    paddingRight: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipText: {
    fontSize: 14,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 14,
    marginLeft: 4,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
  },
  coursesList: {
    flex: 1,
  },
  coursesContent: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  courseCard: {
    marginBottom: 16,
  },
  courseCardContent: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  courseImage: {
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
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  instructorName: {
    fontSize: 14,
  },
  courseMetrics: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metricText: {
    fontSize: 12,
    marginLeft: 4,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  free: {
    fontSize: 18,
    fontWeight: '700',
  },
  startButton: {
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 80,
  },
});