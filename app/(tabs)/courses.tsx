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
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Filter, Grid3x3, List, LayoutGrid, SlidersHorizontal, TrendingUp } from 'lucide-react-native';
import { DesignTokens, AccessibilityTokens } from '@/constants/DesignSystem';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedSearchBar } from '@/components/ui/EnhancedSearchBar';
import { EnhancedCourseCard } from '@/components/ui/EnhancedCourseCard';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { Badge } from '@/components/ui/Badge';
import { categories, featuredCourses, recommendedCourses } from '@/data/mockData';
import { Course } from '@/types/course';
import Animated, { 
  FadeInUp, 
  FadeInRight, 
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const allCourses = [...featuredCourses, ...recommendedCourses];

export default function CoursesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? DesignTokens.colors : DesignTokens.colors;

  const levels = ['beginner', 'intermediate', 'advanced'];

  // Animation values
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  // Filter courses based on search, categories, and level
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = searchQuery === '' || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(course.category);

    const matchesLevel = !selectedLevel || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Sort courses
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
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

  const handleFilterPress = () => {
    // Open filter modal/sheet
    console.log('Open filters');
  };

  const renderCategoryFilter = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        { 
          backgroundColor: colors.neutral[100],
          borderColor: colors.neutral[200],
        },
        selectedCategories.includes(item.name) && { 
          backgroundColor: colors.primary[50], 
          borderColor: colors.primary[300],
        }
      ]}
      onPress={() => toggleCategoryFilter(item.name)}
      accessibilityRole="button"
      accessibilityState={{ selected: selectedCategories.includes(item.name) }}
    >
      <Text
        style={[
          styles.filterChipText,
          { 
            color: colors.neutral[700],
            fontFamily: DesignTokens.typography.fontFamilies.sans[0],
          },
          selectedCategories.includes(item.name) && { 
            color: colors.primary[700], 
            fontWeight: DesignTokens.typography.fontWeights.semibold,
          }
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderCourseItem = ({ item, index }: { item: Course; index: number }) => (
    <EnhancedCourseCard 
      course={item} 
      index={index} 
      layout={viewMode}
    />
  );

  const renderHeader = () => (
    <Animated.View entering={FadeInUp.duration(400)}>
      {/* Main Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[
              styles.headerTitle, 
              { 
                color: colors.neutral[900],
                fontFamily: DesignTokens.typography.fontFamilies.sans[0],
              }
            ]}>
              Discover Courses
            </Text>
            <Text style={[
              styles.headerSubtitle, 
              { 
                color: colors.neutral[600],
                fontFamily: DesignTokens.typography.fontFamilies.sans[0],
              }
            ]}>
              Learn new skills and advance your career
            </Text>
          </View>
          <TouchableOpacity 
            onPress={handleCategoriesPress}
            style={[styles.categoriesButton, { backgroundColor: colors.primary[50] }]}
            accessibilityLabel="View all categories"
          >
            <LayoutGrid size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <EnhancedSearchBar
        placeholder="Search for courses, topics, instructors..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={handleFilterPress}
        showFilter={true}
      />

      {/* Quick Stats */}
      <Animated.View 
        entering={FadeInUp.delay(100).duration(400)}
        style={styles.statsContainer}
      >
        <EnhancedCard variant="filled" size="sm" style={styles.statsCard}>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary[600] }]}>
                {allCourses.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.neutral[600] }]}>
                Courses
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success[600] }]}>
                {categories.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.neutral[600] }]}>
                Categories
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.warning[600] }]}>
                4.8
              </Text>
              <Text style={[styles.statLabel, { color: colors.neutral[600] }]}>
                Avg Rating
              </Text>
            </View>
          </View>
        </EnhancedCard>
      </Animated.View>

      {/* Browse Categories Button */}
      <Animated.View 
        entering={FadeInUp.delay(200).duration(400)}
        style={styles.browseCategoriesContainer}
      >
        <EnhancedButton
          title="Browse All Categories"
          variant="outline"
          size="md"
          icon={<LayoutGrid size={18} color={colors.primary[500]} />}
          iconPosition="left"
          onPress={handleCategoriesPress}
          style={styles.browseCategoriesButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderFilters = () => (
    <Animated.View entering={FadeInUp.delay(300).duration(400)}>
      {/* Category Filters */}
      <View style={styles.filtersSection}>
        <Text style={[
          styles.filterSectionTitle, 
          { 
            color: colors.neutral[900],
            fontFamily: DesignTokens.typography.fontFamilies.sans[0],
          }
        ]}>
          Categories
        </Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesFilterList}
        />
      </View>

      {/* Level and Sort Controls */}
      <View style={styles.controlsRow}>
        <View style={styles.levelFilters}>
          <Text style={[
            styles.controlLabel, 
            { 
              color: colors.neutral[700],
              fontFamily: DesignTokens.typography.fontFamilies.sans[0],
            }
          ]}>
            Level:
          </Text>
          <View style={styles.levelButtons}>
            {levels.map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  { 
                    backgroundColor: colors.neutral[100],
                    borderColor: colors.neutral[200],
                  },
                  selectedLevel === level && { 
                    backgroundColor: colors.primary[50], 
                    borderColor: colors.primary[300],
                  }
                ]}
                onPress={() => toggleLevelFilter(level)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedLevel === level }}
              >
                <Text 
                  style={[
                    styles.levelButtonText,
                    { color: colors.neutral[700] },
                    selectedLevel === level && { 
                      color: colors.primary[700], 
                      fontWeight: DesignTokens.typography.fontWeights.semibold,
                    }
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.viewControls}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              { backgroundColor: colors.neutral[100] },
              viewMode === 'grid' && { backgroundColor: colors.primary[50] }
            ]}
            onPress={() => setViewMode('grid')}
            accessibilityLabel="Grid view"
          >
            <Grid3x3 
              size={18} 
              color={viewMode === 'grid' ? colors.primary[600] : colors.neutral[600]} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              { backgroundColor: colors.neutral[100] },
              viewMode === 'list' && { backgroundColor: colors.primary[50] }
            ]}
            onPress={() => setViewMode('list')}
            accessibilityLabel="List view"
          >
            <List 
              size={18} 
              color={viewMode === 'list' ? colors.primary[600] : colors.neutral[600]} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters */}
      {(selectedCategories.length > 0 || selectedLevel) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={[
            styles.activeFiltersLabel, 
            { 
              color: colors.neutral[700],
              fontFamily: DesignTokens.typography.fontFamilies.sans[0],
            }
          ]}>
            Active filters:
          </Text>
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
              <Text style={[
                styles.clearFiltersText, 
                { 
                  color: colors.primary[600],
                  fontFamily: DesignTokens.typography.fontFamilies.sans[0],
                }
              ]}>
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );

  const renderResults = () => (
    <Animated.View entering={FadeInUp.delay(400).duration(400)}>
      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <View style={styles.resultsInfo}>
          <Text style={[
            styles.resultsCount, 
            { 
              color: colors.neutral[900],
              fontFamily: DesignTokens.typography.fontFamilies.sans[0],
            }
          ]}>
            {sortedCourses.length} courses found
          </Text>
          <Text style={[
            styles.resultsSubtext, 
            { 
              color: colors.neutral[600],
              fontFamily: DesignTokens.typography.fontFamilies.sans[0],
            }
          ]}>
            Sorted by {sortBy}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.sortButton, { backgroundColor: colors.neutral[100] }]}
          accessibilityLabel="Sort options"
        >
          <SlidersHorizontal size={16} color={colors.neutral[600]} />
          <Text style={[
            styles.sortButtonText, 
            { 
              color: colors.neutral[700],
              fontFamily: DesignTokens.typography.fontFamilies.sans[0],
            }
          ]}>
            Sort
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.neutral[50] }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        <FlatList
          data={sortedCourses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          contentContainerStyle={[
            styles.coursesList,
            { paddingHorizontal: DesignTokens.spacing[4] }
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary[500]]}
              tintColor={colors.primary[500]}
            />
          }
          ListHeaderComponent={
            <View>
              {renderHeader()}
              {renderFilters()}
              {renderResults()}
            </View>
          }
          ListEmptyComponent={
            <Animated.View 
              entering={FadeInUp.delay(500).duration(400)}
              style={styles.emptyState}
            >
              <EnhancedCard variant="outlined" size="lg" style={styles.emptyStateCard}>
                <TrendingUp size={48} color={colors.neutral[400]} />
                <Text style={[styles.emptyStateTitle, { color: colors.neutral[900] }]}>
                  No courses found
                </Text>
                <Text style={[styles.emptyStateMessage, { color: colors.neutral[600] }]}>
                  Try adjusting your search or filters to find what you're looking for
                </Text>
                <EnhancedButton
                  title="Clear Filters"
                  variant="outline"
                  onPress={clearFilters}
                  style={styles.emptyStateButton}
                />
              </EnhancedCard>
            </Animated.View>
          }
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={[
                styles.footerText, 
                { 
                  color: colors.neutral[500],
                  fontFamily: DesignTokens.typography.fontFamilies.sans[0],
                }
              ]}>
                Built with ❤️ on Bolt
              </Text>
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
    paddingHorizontal: DesignTokens.spacing[4],
    paddingVertical: DesignTokens.spacing[5],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: DesignTokens.typography.fontSizes['4xl'],
    fontWeight: DesignTokens.typography.fontWeights.bold,
    lineHeight: DesignTokens.typography.lineHeights.tight,
    marginBottom: DesignTokens.spacing[1],
  },
  headerSubtitle: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    lineHeight: DesignTokens.typography.lineHeights.normal,
  },
  categoriesButton: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...DesignTokens.shadows.sm,
  },
  statsContainer: {
    paddingHorizontal: DesignTokens.spacing[4],
    marginBottom: DesignTokens.spacing[4],
  },
  statsCard: {
    padding: DesignTokens.spacing[4],
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: DesignTokens.typography.fontSizes['2xl'],
    fontWeight: DesignTokens.typography.fontWeights.bold,
    marginBottom: DesignTokens.spacing[1],
  },
  statLabel: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.medium,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  browseCategoriesContainer: {
    paddingHorizontal: DesignTokens.spacing[4],
    marginBottom: DesignTokens.spacing[6],
  },
  browseCategoriesButton: {
    alignSelf: 'flex-start',
  },
  filtersSection: {
    marginBottom: DesignTokens.spacing[4],
  },
  filterSectionTitle: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
    marginHorizontal: DesignTokens.spacing[4],
    marginBottom: DesignTokens.spacing[3],
  },
  categoriesFilterList: {
    paddingHorizontal: DesignTokens.spacing[4],
  },
  filterChip: {
    paddingHorizontal: DesignTokens.spacing[3],
    paddingVertical: DesignTokens.spacing[2],
    borderRadius: DesignTokens.borderRadius.xl,
    marginRight: DesignTokens.spacing[2],
    borderWidth: 1,
    minHeight: AccessibilityTokens.minTouchTarget,
    justifyContent: 'center',
  },
  filterChipText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.medium,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing[4],
    marginBottom: DesignTokens.spacing[4],
  },
  levelFilters: {
    flex: 1,
  },
  controlLabel: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.medium,
    marginBottom: DesignTokens.spacing[2],
  },
  levelButtons: {
    flexDirection: 'row',
    gap: DesignTokens.spacing[2],
  },
  levelButton: {
    paddingHorizontal: DesignTokens.spacing[3],
    paddingVertical: DesignTokens.spacing[2],
    borderRadius: DesignTokens.borderRadius.md,
    borderWidth: 1,
    minHeight: AccessibilityTokens.minTouchTarget,
    justifyContent: 'center',
  },
  levelButtonText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.medium,
  },
  viewControls: {
    flexDirection: 'row',
    gap: DesignTokens.spacing[1],
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFiltersContainer: {
    paddingHorizontal: DesignTokens.spacing[4],
    marginBottom: DesignTokens.spacing[4],
  },
  activeFiltersLabel: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.medium,
    marginBottom: DesignTokens.spacing[2],
  },
  activeFiltersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: DesignTokens.spacing[2],
  },
  activeFilterBadge: {
    marginBottom: DesignTokens.spacing[1],
  },
  clearFiltersText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing[4],
    marginBottom: DesignTokens.spacing[4],
  },
  resultsInfo: {
    flex: 1,
  },
  resultsCount: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
    marginBottom: DesignTokens.spacing[1],
  },
  resultsSubtext: {
    fontSize: DesignTokens.typography.fontSizes.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing[3],
    paddingVertical: DesignTokens.spacing[2],
    borderRadius: DesignTokens.borderRadius.md,
    gap: DesignTokens.spacing[2],
  },
  sortButtonText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.medium,
  },
  coursesList: {
    paddingBottom: DesignTokens.spacing[20],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DesignTokens.spacing[16],
  },
  emptyStateCard: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emptyStateTitle: {
    fontSize: DesignTokens.typography.fontSizes['2xl'],
    fontWeight: DesignTokens.typography.fontWeights.semibold,
    marginTop: DesignTokens.spacing[4],
    marginBottom: DesignTokens.spacing[2],
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: DesignTokens.typography.fontSizes.base,
    lineHeight: DesignTokens.typography.lineHeights.relaxed,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing[6],
  },
  emptyStateButton: {
    minWidth: 120,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing[8],
  },
  footerText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
  },
});