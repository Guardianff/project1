import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Search,
  Palette,
  TrendingUp,
  Code,
  Briefcase,
  Camera,
  Music,
  User,
  Activity,
  ChevronRight,
  BookOpen,
  Users,
  Clock
} from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { SearchBar } from '@/components/ui/SearchBar';
import Animated, { FadeInUp, FadeInRight, SlideInRight } from 'react-native-reanimated';

interface CourseCategory {
  id: string;
  name: string;
  description: string;
  courseCount: number;
  studentCount: number;
  averageDuration: string;
  icon: React.ReactNode;
  color: string;
  gradient: string[];
  image: string;
  featured?: boolean;
}

const categories: CourseCategory[] = [
  {
    id: 'design',
    name: 'Design',
    description: 'UI/UX, Graphic Design, and Creative Arts',
    courseCount: 24,
    studentCount: 12500,
    averageDuration: '6-8 weeks',
    icon: <Palette size={28} color="white" />,
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Digital Marketing, SEO, and Brand Strategy',
    courseCount: 18,
    studentCount: 8900,
    averageDuration: '4-6 weeks',
    icon: <TrendingUp size={28} color="white" />,
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
    image: 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'development',
    name: 'Development',
    description: 'Web, Mobile, and Software Development',
    courseCount: 36,
    studentCount: 15600,
    averageDuration: '8-12 weeks',
    icon: <Code size={28} color="white" />,
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1D4ED8'],
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Entrepreneurship, Management, and Finance',
    courseCount: 22,
    studentCount: 9800,
    averageDuration: '6-10 weeks',
    icon: <Briefcase size={28} color="white" />,
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Digital Photography and Visual Storytelling',
    courseCount: 16,
    studentCount: 6700,
    averageDuration: '4-8 weeks',
    icon: <Camera size={28} color="white" />,
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0891B2'],
    image: 'https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Music Production, Theory, and Performance',
    courseCount: 14,
    studentCount: 5400,
    averageDuration: '6-12 weeks',
    icon: <Music size={28} color="white" />,
    color: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
    image: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'personal-development',
    name: 'Personal Development',
    description: 'Leadership, Communication, and Life Skills',
    courseCount: 20,
    studentCount: 11200,
    averageDuration: '4-6 weeks',
    icon: <User size={28} color="white" />,
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    description: 'Nutrition, Workout Plans, and Wellness',
    courseCount: 28,
    studentCount: 13800,
    averageDuration: '8-16 weeks',
    icon: <Activity size={28} color="white" />,
    color: '#F97316',
    gradient: ['#F97316', '#EA580C'],
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const screenWidth = Dimensions.get('window').width;

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredCategories = filteredCategories.filter(cat => cat.featured);
  const regularCategories = filteredCategories.filter(cat => !cat.featured);

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };

  const formatStudentCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const renderFeaturedCategory = (category: CourseCategory, index: number) => (
    <Animated.View
      key={category.id}
      entering={FadeInRight.delay(index * 100).duration(600)}
      style={[styles.featuredCard, { width: screenWidth - 32 }]}
    >
      <TouchableOpacity
        onPress={() => handleCategoryPress(category.id)}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: category.image }}
          style={styles.featuredCardBackground}
          imageStyle={styles.featuredCardImage}
        >
          <View style={[styles.featuredCardOverlay, { 
            backgroundColor: `${category.color}CC` 
          }]}>
            <View style={styles.featuredCardContent}>
              <View style={styles.featuredCardHeader}>
                <View style={styles.featuredCardIcon}>
                  {category.icon}
                </View>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Featured</Text>
                </View>
              </View>
              
              <Text style={styles.featuredCardTitle}>{category.name}</Text>
              <Text style={styles.featuredCardDescription}>{category.description}</Text>
              
              <View style={styles.featuredCardStats}>
                <View style={styles.featuredStat}>
                  <BookOpen size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.featuredStatText}>{category.courseCount} courses</Text>
                </View>
                <View style={styles.featuredStat}>
                  <Users size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.featuredStatText}>{formatStudentCount(category.studentCount)} students</Text>
                </View>
              </View>
              
              <View style={styles.featuredCardAction}>
                <Text style={styles.exploreText}>Explore Category</Text>
                <ChevronRight size={20} color="white" />
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderRegularCategory = (category: CourseCategory, index: number) => (
    <Animated.View
      key={category.id}
      entering={FadeInUp.delay(index * 50).duration(500)}
      style={styles.categoryCard}
    >
      <TouchableOpacity
        onPress={() => handleCategoryPress(category.id)}
        style={[styles.categoryCardContent, { backgroundColor: colors.background }]}
        activeOpacity={0.8}
      >
        <View style={styles.categoryCardHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
            {category.icon}
          </View>
          <ChevronRight size={20} color={colors.neutral[400]} />
        </View>
        
        <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.name}</Text>
        <Text style={[styles.categoryDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {category.description}
        </Text>
        
        <View style={styles.categoryStats}>
          <View style={styles.categoryStat}>
            <BookOpen size={14} color={colors.neutral[500]} />
            <Text style={[styles.categoryStatText, { color: colors.neutral[600] }]}>
              {category.courseCount}
            </Text>
          </View>
          <View style={styles.categoryStat}>
            <Users size={14} color={colors.neutral[500]} />
            <Text style={[styles.categoryStatText, { color: colors.neutral[600] }]}>
              {formatStudentCount(category.studentCount)}
            </Text>
          </View>
          <View style={styles.categoryStat}>
            <Clock size={14} color={colors.neutral[500]} />
            <Text style={[styles.categoryStatText, { color: colors.neutral[600] }]}>
              {category.averageDuration}
            </Text>
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Categories</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Explore learning paths
            </Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <SearchBar
            placeholder="Search categories and courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Animated.View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Featured Categories */}
          {featuredCategories.length > 0 && (
            <View style={styles.featuredSection}>
              <Animated.Text 
                entering={FadeInUp.delay(200).duration(400)}
                style={[styles.sectionTitle, { color: colors.text }]}
              >
                Featured Categories
              </Animated.Text>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
                snapToInterval={screenWidth - 16}
                snapToAlignment="start"
                decelerationRate="fast"
              >
                {featuredCategories.map((category, index) => 
                  renderFeaturedCategory(category, index)
                )}
              </ScrollView>
            </View>
          )}

          {/* All Categories */}
          <View style={styles.allCategoriesSection}>
            <Animated.Text 
              entering={FadeInUp.delay(300).duration(400)}
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              All Categories
            </Animated.Text>
            
            <View style={styles.categoriesGrid}>
              {regularCategories.map((category, index) => 
                renderRegularCategory(category, index)
              )}
            </View>
          </View>

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <Animated.View 
              entering={FadeInUp.delay(200).duration(400)}
              style={styles.emptyState}
            >
              <Search size={48} color={colors.neutral[400]} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No categories found
              </Text>
              <Text style={[styles.emptyStateMessage, { color: colors.textSecondary }]}>
                Try adjusting your search terms
              </Text>
            </Animated.View>
          )}

          {/* Bottom spacing */}
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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  featuredSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  featuredList: {
    paddingHorizontal: 16,
  },
  featuredCard: {
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 240,
  },
  featuredCardBackground: {
    width: '100%',
    height: '100%',
  },
  featuredCardImage: {
    borderRadius: 16,
  },
  featuredCardOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  featuredCardContent: {
    flex: 1,
  },
  featuredCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featuredCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  featuredCardDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  featuredCardStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featuredStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  featuredStatText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginLeft: 6,
  },
  featuredCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exploreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  allCategoriesSection: {
    paddingHorizontal: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 16,
  },
  categoryCardContent: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  categoryStats: {
    flexDirection: 'column',
    gap: 6,
  },
  categoryStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryStatText: {
    fontSize: 12,
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
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
    height: 40,
  },
});
