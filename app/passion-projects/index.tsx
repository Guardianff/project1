import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Plus, Palette, Code, Camera, Music, Pencil, ChevronRight, Clock, Calendar, Users, Star, Bookmark, Share2 } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'design' | 'development' | 'photography' | 'music' | 'writing';
  thumbnail: string;
  progress: number;
  startDate: string;
  targetDate: string;
  collaborators: number;
  isPublic: boolean;
  isFeatured: boolean;
}

interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  category: 'design' | 'development' | 'photography' | 'music' | 'writing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: string;
  likes: number;
}

export default function PassionProjectsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const projects: Project[] = [
    {
      id: '1',
      title: 'Personal Portfolio Website',
      description: 'A showcase of my work and skills using React and Three.js',
      category: 'development',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      progress: 65,
      startDate: '2025-01-10',
      targetDate: '2025-02-28',
      collaborators: 1,
      isPublic: true,
      isFeatured: true,
    },
    {
      id: '2',
      title: 'Urban Photography Series',
      description: 'Capturing the essence of city life through street photography',
      category: 'photography',
      thumbnail: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=800',
      progress: 40,
      startDate: '2025-01-15',
      targetDate: '2025-03-15',
      collaborators: 0,
      isPublic: true,
      isFeatured: false,
    },
  ];

  const projectIdeas: ProjectIdea[] = [
    {
      id: '1',
      title: 'Mobile App Redesign',
      description: 'Redesign a popular app with a fresh, modern UI',
      category: 'design',
      difficulty: 'intermediate',
      timeEstimate: '2-3 weeks',
      likes: 245,
    },
    {
      id: '2',
      title: 'Podcast Series',
      description: 'Create a 5-episode podcast on a topic you\'re passionate about',
      category: 'music',
      difficulty: 'beginner',
      timeEstimate: '1-2 months',
      likes: 189,
    },
    {
      id: '3',
      title: 'Short Story Collection',
      description: 'Write a collection of 5 short stories with a common theme',
      category: 'writing',
      difficulty: 'intermediate',
      timeEstimate: '1-3 months',
      likes: 156,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'design', name: 'Design', icon: <Palette size={16} color={colors.secondary[500]} /> },
    { id: 'development', name: 'Development', icon: <Code size={16} color={colors.primary[500]} /> },
    { id: 'photography', name: 'Photography', icon: <Camera size={16} color={colors.accent[500]} /> },
    { id: 'music', name: 'Music', icon: <Music size={16} color={colors.error[500]} /> },
    { id: 'writing', name: 'Writing', icon: <Pencil size={16} color={colors.warning[500]} /> },
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const foundCategory = categories.find(c => c.id === category);
    return foundCategory?.icon || <Heart size={16} color={colors.neutral[500]} />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'design': return colors.secondary[500];
      case 'development': return colors.primary[500];
      case 'photography': return colors.accent[500];
      case 'music': return colors.error[500];
      case 'writing': return colors.warning[500];
      default: return colors.neutral[500];
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.success[500];
      case 'intermediate': return colors.warning[500];
      case 'advanced': return colors.error[500];
      default: return colors.neutral[500];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCreateProject = () => {
    Alert.alert(
      'Create New Project',
      'What type of project would you like to create?',
      categories.filter(c => c.id !== 'all').map(category => ({
        text: category.name,
        onPress: () => createProject(category.id),
      }))
    );
  };

  const createProject = (category: string) => {
    // In a real app, this would open a project creation form
    Alert.alert('Project Creation', `Creating a new ${category} project...`);
  };

  const handleProjectPress = (project: Project) => {
    // In a real app, this would navigate to the project details screen
    Alert.alert(
      project.title,
      `View or edit your ${project.category} project`,
      [
        { text: 'View Details', onPress: () => {} },
        { text: 'Edit Project', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleIdeaPress = (idea: ProjectIdea) => {
    Alert.alert(
      idea.title,
      `Would you like to start this ${idea.category} project?`,
      [
        { text: 'Save for Later', onPress: () => {} },
        { text: 'Start Project', onPress: () => createProject(idea.category) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.duration(500)}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Passion Projects</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Explore your creative side
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary[500] }]}
            onPress={handleCreateProject}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Inspiration Banner */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.bannerSection}>
            <GlassCard style={styles.inspirationBanner}>
              <View style={styles.bannerContent}>
                <View style={[styles.bannerIcon, { backgroundColor: colors.error[500] }]}>
                  <Heart size={24} color="white" />
                </View>
                <View style={styles.bannerText}>
                  <Text style={[styles.bannerTitle, { color: colors.text }]}>
                    Unleash Your Creativity
                  </Text>
                  <Text style={[styles.bannerDescription, { color: colors.textSecondary }]}>
                    Turn your ideas into reality with passion projects
                  </Text>
                </View>
              </View>
              <Button
                title="Explore Ideas"
                variant="primary"
                size="small"
                onPress={() => {}}
                style={{ backgroundColor: colors.error[500] }}
              />
            </GlassCard>
          </Animated.View>

          {/* Category Filter */}
          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.categoriesSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: colors.neutral[100] },
                    selectedCategory === category.id && { 
                      backgroundColor: colors.primary[50], 
                      borderColor: colors.primary[200] 
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  {category.icon && (
                    <View style={styles.categoryIcon}>
                      {category.icon}
                    </View>
                  )}
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: colors.neutral[600] },
                      selectedCategory === category.id && { 
                        color: colors.primary[600], 
                        fontWeight: '600' 
                      }
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* My Projects */}
          <View style={styles.projectsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>My Projects</Text>
            
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <Animated.View
                  key={project.id}
                  entering={FadeInRight.delay(400 + index * 100).duration(500)}
                >
                  <EnhancedCard
                    variant="elevated"
                    interactive
                    glowEffect
                    onPress={() => handleProjectPress(project)}
                    style={styles.projectCard}
                  >
                    <View style={styles.projectHeader}>
                      <Image source={{ uri: project.thumbnail }} style={styles.projectImage} />
                      
                      {project.isFeatured && (
                        <View style={[styles.featuredBadge, { backgroundColor: colors.warning[500] }]}>
                          <Star size={12} color="white" />
                          <Text style={styles.featuredText}>Featured</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.projectContent}>
                      <View style={styles.projectTitleRow}>
                        <Text style={[styles.projectTitle, { color: colors.text }]}>
                          {project.title}
                        </Text>
                        <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(project.category)}15` }]}>
                          {getCategoryIcon(project.category)}
                        </View>
                      </View>
                      
                      <Text style={[styles.projectDescription, { color: colors.textSecondary }]}>
                        {project.description}
                      </Text>
                      
                      <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                            Progress
                          </Text>
                          <Text style={[styles.progressValue, { color: colors.text }]}>
                            {project.progress}%
                          </Text>
                        </View>
                        <View style={[styles.progressBar, { backgroundColor: colors.neutral[200] }]}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                backgroundColor: getCategoryColor(project.category),
                                width: `${project.progress}%` 
                              }
                            ]} 
                          />
                        </View>
                      </View>
                      
                      <View style={styles.projectMeta}>
                        <View style={styles.metaItem}>
                          <Calendar size={14} color={colors.neutral[500]} />
                          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                            {formatDate(project.targetDate)}
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Users size={14} color={colors.neutral[500]} />
                          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                            {project.collaborators > 0 ? `${project.collaborators} collaborators` : 'Solo project'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.projectActions}>
                        <Button
                          title="Continue"
                          variant="primary"
                          size="small"
                          onPress={() => handleProjectPress(project)}
                          style={[styles.actionButton, { backgroundColor: getCategoryColor(project.category) }]}
                        />
                        <TouchableOpacity style={styles.iconButton}>
                          <Share2 size={20} color={colors.neutral[500]} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </EnhancedCard>
                </Animated.View>
              ))
            ) : (
              <Animated.View entering={FadeInUp.delay(400).duration(500)}>
                <EnhancedCard variant="glass" style={styles.emptyState}>
                  <View style={styles.emptyStateContent}>
                    <View style={[styles.emptyStateIcon, { backgroundColor: colors.neutral[100] }]}>
                      <Heart size={32} color={colors.neutral[400]} />
                    </View>
                    <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                      No projects yet
                    </Text>
                    <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
                      Start your first passion project to see it here
                    </Text>
                    <Button
                      title="Create Project"
                      variant="primary"
                      onPress={handleCreateProject}
                      style={styles.emptyStateButton}
                    />
                  </View>
                </EnhancedCard>
              </Animated.View>
            )}
          </View>

          {/* Project Ideas */}
          <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.ideasSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Project Ideas</Text>
              <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: colors.primary[500] }]}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ideasList}
            >
              {projectIdeas.map((idea, index) => (
                <Animated.View
                  key={idea.id}
                  entering={FadeInRight.delay(700 + index * 100).duration(500)}
                  style={styles.ideaCard}
                >
                  <EnhancedCard
                    variant="glass"
                    interactive
                    onPress={() => handleIdeaPress(idea)}
                    style={styles.ideaCardContent}
                  >
                    <View style={styles.ideaHeader}>
                      <View style={[styles.ideaIcon, { backgroundColor: getCategoryColor(idea.category) }]}>
                        {getCategoryIcon(idea.category)}
                      </View>
                      <Badge
                        label={idea.difficulty}
                        variant="neutral"
                        size="small"
                        style={{ backgroundColor: `${getDifficultyColor(idea.difficulty)}15` }}
                        textStyle={{ color: getDifficultyColor(idea.difficulty) }}
                      />
                    </View>
                    
                    <Text style={[styles.ideaTitle, { color: colors.text }]}>
                      {idea.title}
                    </Text>
                    <Text style={[styles.ideaDescription, { color: colors.textSecondary }]}>
                      {idea.description}
                    </Text>
                    
                    <View style={styles.ideaMeta}>
                      <View style={styles.metaItem}>
                        <Clock size={14} color={colors.neutral[500]} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                          {idea.timeEstimate}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Heart size={14} color={colors.error[500]} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                          {idea.likes}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.ideaActions}>
                      <Button
                        title="Start Project"
                        variant="primary"
                        size="small"
                        onPress={() => handleIdeaPress(idea)}
                        style={{ backgroundColor: getCategoryColor(idea.category) }}
                      />
                      <TouchableOpacity style={styles.bookmarkButton}>
                        <Bookmark size={20} color={colors.neutral[500]} />
                      </TouchableOpacity>
                    </View>
                  </EnhancedCard>
                </Animated.View>
              ))}
            </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inspirationBanner: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 12,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  projectsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  projectCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  projectHeader: {
    position: 'relative',
  },
  projectImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  projectContent: {
    padding: 16,
  },
  projectTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  projectDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  projectMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  projectActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    marginRight: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 232, 240, 0.2)',
  },
  emptyState: {
    padding: 24,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    minWidth: 150,
  },
  ideasSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ideasList: {
    paddingHorizontal: 20,
  },
  ideaCard: {
    width: 280,
    marginRight: 16,
  },
  ideaCardContent: {
    padding: 16,
  },
  ideaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ideaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ideaTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  ideaDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  ideaMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ideaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 232, 240, 0.2)',
  },
  bottomSpacing: {
    height: 80,
  },
});