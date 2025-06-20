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
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Filter, ChevronDown, Grid3x3 as Grid3X3, LayoutGrid } from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { SearchBar } from '@/components/ui/SearchBar';
import { CourseCard } from '@/components/ui/CourseCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { categories, featuredCourses, recommendedCourses } from '@/data/mockData';
import { Course } from '@/types/course';

// Combine all courses for display
const allCourses = [...featuredCourses, ...recommendedCourses];

export default function CoursesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
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
            fontWeight: '500' 
          }
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderCourseItem = ({ item, index }: { item: Course; index: number }) => (
    <CourseCard course={item} index={index} />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Courses</Text>
            <TouchableOpacity onPress={handleCategoriesPress}>
              <Text style={[styles.viewCategoriesText, { color: colors.primary[500] }]}>
                View Categories
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search for courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Browse Categories Button */}
        <View style={styles.browseCategoriesContainer}>
          <Button
            title="Browse All Categories"
            variant="outline"
            icon={<LayoutGrid size={18} color={colors.primary[500]} />}
            iconPosition="left"
            onPress={handleCategoriesPress}
            style={styles.browseCategoriesButton}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          {/* Category Filter */}
          <FlatList
            data={categories}
            renderItem={renderCategoryFilter}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesFilterList}
          />

          <View style={styles.filtersRow}>
            {/* Level Filter Dropdown */}
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
              
              {/* Level selection options */}
              <View style={[styles.levelOptions, { backgroundColor: colors.background }]}>
                {levels.map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelOption,
                      selectedLevel === level && { backgroundColor: colors.primary[50] }
                    ]}
                    onPress={() => toggleLevelFilter(level)}
                  >
                    <Text 
                      style={[
                        styles.levelOptionText,
                        { color: colors.text },
                        selectedLevel === level && { 
                          color: colors.primary[600], 
                          fontWeight: '500' 
                        }
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filter Button */}
            <Button
              title="Filters"
              variant="outline"
              size="small"
              icon={<Filter size={16} color={colors.primary[500]} />}
              iconPosition="left"
              onPress={() => {}}
              style={styles.filterButton}
            />
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
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
          </Text>
        </View>

        {/* Course List */}
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.coursesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary[500]]}
              tintColor={colors.primary[500]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No courses found</Text>
              <Text style={[styles.emptyStateMessage, { color: colors.textSecondary }]}>Try adjusting your search or filters</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.boltBadgeContainer}>
              <Text style={[styles.boltBadgeText, { color: colors.textSecondary }]}>Built on Bolt</Text>
            </View>
          }
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  viewCategoriesText: {
    fontSize: 14,
    fontWeight: '500',
  },
  browseCategoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  browseCategoriesButton: {
    alignSelf: 'flex-start',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoriesFilterList: {
    paddingBottom: 12,
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
    fontSize: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
    marginRight: 4,
  },
  levelOptions: {
    position: 'absolute',
    top: 34,
    left: 40,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
    display: 'none', // This would be toggled with state in a real app
  },
  levelOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  levelOptionText: {
    fontSize: 14,
  },
  filterButton: {
    paddingHorizontal: 12,
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
    fontSize: 12,
    fontWeight: '500',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
  },
  coursesList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  boltBadgeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  boltBadgeText: {
    fontSize: 12,
  },
});