import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Search, BookOpen } from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { SearchBar } from '@/components/ui/SearchBar';
import { FeaturedCourseCarousel } from '@/components/home/FeaturedCourseCarousel';
import { CategoriesList } from '@/components/home/CategoriesList';
import { CoachingSessionsList } from '@/components/home/CoachingSessionsList';
import { CourseCard } from '@/components/ui/CourseCard';
import { 
  featuredCourses, 
  categories, 
  recommendedCourses, 
  upcomingCoachingSessions 
} from '@/data/mockData';
import { Button } from '@/components/ui/Button';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good morning,</Text>
            <Text style={[styles.userName, { color: colors.text }]}>Alex</Text>
          </View>
          
          <View style={styles.headerActions}>
            <Button
              title=""
              variant="ghost"
              icon={<Bell size={24} color={colors.text} />}
              onPress={handleNotificationPress}
              style={styles.iconButton}
            />
            <View style={[styles.notificationBadge, { backgroundColor: colors.error[500] }]} />
          </View>
        </View>
        
        {/* Search Bar */}
        <SearchBar
          placeholder="Search courses, topics, instructors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Featured Courses Carousel */}
          <FeaturedCourseCarousel courses={featuredCourses} />
          
          {/* Categories */}
          <CategoriesList categories={categories} />
          
          {/* Upcoming Coaching Sessions */}
          {upcomingCoachingSessions.length > 0 && (
            <CoachingSessionsList sessions={upcomingCoachingSessions} />
          )}
          
          {/* Recommended Courses */}
          <View style={styles.recommendedSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended for you</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Based on your interests</Text>
            </View>
            
            {recommendedCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </View>
          
          {/* Explore button */}
          <View style={styles.exploreBtnContainer}>
            <Button
              title="Explore all courses"
              variant="outline"
              icon={<BookOpen size={18} color={colors.primary[500]} />}
              iconPosition="left"
              onPress={() => {}}
              style={styles.exploreBtn}
            />
          </View>
          
          {/* "Built on Bolt" badge */}
          <View style={styles.boltBadgeContainer}>
            <Text style={[styles.boltBadgeText, { color: colors.textSecondary }]}>Built on Bolt</Text>
          </View>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  recommendedSection: {
    marginTop: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  exploreBtnContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  exploreBtn: {
    minWidth: 200,
  },
  boltBadgeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  boltBadgeText: {
    fontSize: 12,
  },
});