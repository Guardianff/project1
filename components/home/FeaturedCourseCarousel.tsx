import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { CirclePlay as PlayCircle } from 'lucide-react-native';
import { Course } from '@/types/course';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

interface FeaturedCourseCarouselProps {
  courses: Course[];
}

export function FeaturedCourseCarousel({ courses }: FeaturedCourseCarouselProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  // Calculate item width based on screen size
  const getItemWidth = () => {
    // On mobile, take full width
    if (width < 768) return width - 32; // Full width minus padding
    // On tablet, show 2 items
    if (width < 1024) return (width - 48) / 2; // Half width minus padding
    // On desktop, show 3 items
    return (width - 64) / 3; // One third width minus padding
  };

  const handleCoursePress = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={[styles.courseItem, { width: getItemWidth() }]}
      onPress={() => handleCoursePress(item.id)}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: item.thumbnail }}
        style={styles.courseImage}
        imageStyle={styles.courseImageBackground}
      >
        <View style={styles.courseOverlay}>
          <View style={styles.courseContent}>
            <View style={styles.courseHeader}>
              <View style={[styles.levelBadge, { backgroundColor: colors.primary[500] }]}>
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>

            <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.courseInstructor}>{item.instructor.name}</Text>
            
            <View style={styles.courseFooter}>
              <Button
                title="Continue"
                variant="primary"
                size="small"
                icon={<PlayCircle size={16} color="white" />}
                iconPosition="left"
                onPress={() => handleCoursePress(item.id)}
                style={styles.continueButton}
              />
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { backgroundColor: colors.primary[500], width: `${item.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{item.progress}% complete</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Continue Learning</Text>
        <TouchableOpacity onPress={() => router.push('/courses')}>
          <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        pagingEnabled={width < 768}
        snapToInterval={getItemWidth() + 16}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  courseItem: {
    marginRight: 16,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  courseImageBackground: {
    borderRadius: 12,
  },
  courseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  levelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  courseFooter: {
    marginTop: 8,
  },
  continueButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
});