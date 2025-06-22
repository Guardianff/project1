import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Filter, ChevronDown, Grid3x3 as Grid3X3, LayoutGrid, TrendingUp, Star, Users, Clock } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedSearchBar } from '@/components/ui/EnhancedSearchBar';
import { CourseCard } from '@/components/ui/CourseCard';
import { ModernCard } from '@/components/ui/ModernCard';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { Badge } from '@/components/ui/Badge';
import { categories, featuredCourses, recommendedCourses } from '@/data/mockData';
import { Course } from '@/types/course';
import Animated, { FadeInUp, FadeInRight, SlideInRight } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Combine all courses for display
const allCourses = [...featuredCourses, ...recommendedCourses];

export default function CoursesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const levels = ['beginner', 'intermediate', 'advanced'];

  // Filter courses based on search, categories, and level
  const filteredCourses = allCourses.filter(course => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(course.category);

    // Level filter
    const matchesLevel = !selectedLevel || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const toggleCategoryFilter = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleLevelFilter = (level: string) => {
    if (selectedLevel === level) {
      setSelectedLevel(null);
    } else {
      setSelectedLevel(level);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevel(null);
  };

  const handleCategoriesPress = () => {
    router.push('/categories');
  };

  const renderCategoryFilter = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        { backgroundColor: colors.neutral[100] },
        selectedCategories.includes(item.name) && { 
          backgroundColor: colors.primary[50], 
          borderColor: colors.primary[200] 
        }
      ]}
      onPress={() => toggleCategoryFilter(item.name)}
    >
      <Text
        style={[
          styles.filterChipText,
          { color: colors.neutral[600] },
          selectedCategories.includes(item.name) && { 
            color: colors.primary[600], 
            fontWeight: '600' 
          }
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderCourseItem = ({ item, index }: { item: Course; index: number }) => (
    <CourseCard 
      course={item} 
      index={index} 
      variant={viewMode === 'grid' ? 'default' : 'compact'}
    />
  );

  const renderFeaturedCourse = ({ item, index }: { item: Course; index: number }) => (
    <CourseCard 
      course={item} 
      index={index} 
      variant="featured"
    />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Enhanced Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Discover</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Expand your skills with expert-led courses
            </Text>
          </View>
          
        </Animated.View>

        {/* Enhanced Search Bar */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <EnhancedSearchBar
            placeholder="Search courses, instructors, topics..."
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
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary[500]]}
              tintColor={colors.primary[500]}
            />
          }
        >
          {/* Quick Stats */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.statsSection}>
            <ModernCard variant="glass" size="sm" style={styles.statsCard}>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: colors.primary[50] }]}>
                    <TrendingUp size={20} color={colors.primary[500]} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>150+</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Courses</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: colors.success[50] }]}>
                    <Star size={20} color={colors.success[500]} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>4.8</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Rating</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: colors.accent[50] }]}>
                    <Users size={20} color={colors.accent[500]} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>50k+</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Students</Text>
                </View>
              </View>
            </ModernCard>
          </Animated.View>

          {/* Browse Categories Button */}
          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.browseCategoriesContainer}>
            <EnhancedButton
              title="Browse All Categories"
              variant="outline"
              icon={<LayoutGrid size={18} color={colors.primary[500]} />}
              iconPosition="left"
              onPress={handleCategoriesPress}
              style={styles.browseCategoriesButton}
              glow
            />
          </Animated.View>

          {/* Featured Courses */}
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Courses</Text>
              <Badge label="New" variant="primary" size="small" />
            </View>
            
            <FlatList
              data={featuredCourses}
              renderItem={renderFeaturedCourse}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
              snapToInterval={screenWidth * 0.85}
              snapToAlignment="start"
              decelerationRate="fast"
            />
          </Animated.View>

          {/* Category Filters */}
          <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.filtersContainer}>
            <Text style={[styles.filtersTitle, { color: colors.text }]}>Filter by Category</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryFilter}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesFilterList}
            />

            <View style={styles.filtersRow}>
              {/* Level Filter */}
              <View style={styles.levelFilter}>
                <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Level:</Text>
                <TouchableOpacity style={[styles.dropdown, { 
                  backgroundColor: colors.neutral[50], 
                  borderColor: colors.neutral[200] 
                }]}>
                  <Text style={[styles.dropdownText, { color: colors.text }]}>
                    {selectedLevel ? selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1) : 'All Levels'}
                  </Text>
                  <ChevronDown size={16} color={colors.neutral[500]} />
                </TouchableOpacity>
              </View>

              {/* View Mode Toggle */}
              <View style={styles.viewModeContainer}>
                <TouchableOpacity
                  style={[
                    styles.viewModeButton,
                    { backgroundColor: colors.neutral[100] },
                    viewMode === 'grid' && { backgroundColor: colors.primary[500] }
                  ]}
                  onPress={() => setViewMode('grid')}
                >
                  <Grid3X3 size={16} color={viewMode === 'grid' ? 'white' : colors.neutral[600]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.viewModeButton,
                    { backgroundColor: colors.neutral[100] },
                    viewMode === 'list' && { backgroundColor: colors.primary[500] }
                  ]}
                  onPress={() => setViewMode('list')}
                >
                  <LayoutGrid size={16} color={viewMode === 'list' ? 'white' : colors.neutral[600]} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || selectedLevel) && (
              <View style={styles.activeFiltersContainer}>
                <Text style={[styles.activeFiltersLabel, { color: colors.textSecondary }]}>Active filters:</Text>
                <View style={styles.activeFiltersList}>
                  {selectedCategories.map(category => (
                    <Badge
                      key={category}
                      label={category}
                      variant="primary"
                      size="small"
                      style={styles.activeFilterBadge}
                    />
                  ))}
                  {selectedLevel && (
                    <Badge
                      label={selectedLevel}
                      variant="secondary"
                      size="small"
                      style={styles.activeFilterBadge}
                    />
                  )}
                  <TouchableOpacity onPress={clearFilters}>
                    <Text style={[styles.clearFiltersText, { color: colors.primary[500] }]}>Clear all</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Results Count */}
          <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.resultsContainer}>
            <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
              {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
            </Text>
          </Animated.View>

          {/* Course List */}
          <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.coursesSection}>
            {filteredCourses.length === 0 ? (
              <InteractiveCard
                title="No courses found"
                subtitle="Try adjusting your search or filters"
                variant="compact"
                style={styles.emptyState}
              />
            ) : (
              <FlatList
                data={filteredCourses}
                renderItem={renderCourseItem}
                keyExtractor={(item) => item.id}
                numColumns={viewMode === 'grid' ? 1 : 1}
                scrollEnabled={false}
                contentContainerStyle={styles.coursesList}
              />
            )}
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  viewCategoriesText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsCard: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  browseCategoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  browseCategoriesButton: {
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesFilterList: {
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
    marginRight: 4,
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeFiltersContainer: {
    marginBottom: 12,
  },
  activeFiltersLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  activeFiltersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  activeFilterBadge: {
    marginRight: 8,
    marginBottom: 4,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
  },
  coursesSection: {
    paddingHorizontal: 20,
  },
  coursesList: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  bottomSpacing: {
    height: 100,
  },
});