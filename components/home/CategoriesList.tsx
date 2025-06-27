import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Category } from '@/types/course';
import { Colors, getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { 
  Palette, Code, Briefcase, TrendingUp, Camera, Music, Activity, User 
} from 'lucide-react-native';

interface CategoriesListProps {
  categories: Category[];
}

export function CategoriesList({ categories }: CategoriesListProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const getCategoryIcon = (iconName: string) => {
    const iconProps = { size: 24, color: colors.primary[500] };
    
    switch (iconName) {
      case 'palette':
        return <Palette {...iconProps} />;
      case 'code':
        return <Code {...iconProps} />;
      case 'briefcase':
        return <Briefcase {...iconProps} />;
      case 'trending-up':
        return <TrendingUp {...iconProps} />;
      case 'camera':
        return <Camera {...iconProps} />;
      case 'music':
        return <Music {...iconProps} />;
      case 'activity':
        return <Activity {...iconProps} />;
      case 'user':
      default:
        return <User {...iconProps} />;
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => router.push(`/categories/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary[50] }]}>
        {getCategoryIcon(item.icon)}
      </View>
      <Text style={[styles.categoryName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
      <Text style={[styles.courseCount, { color: colors.textSecondary }]}>{item.courses} courses</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Browse Categories</Text>
      </View>
      
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryItem: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  courseCount: {
    fontSize: 12,
    textAlign: 'center',
  },
});
