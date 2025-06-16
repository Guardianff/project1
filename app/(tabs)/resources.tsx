import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, 
  Download, 
  Award, 
  BookOpen, 
  FileText, 
  Code, 
  Briefcase, 
  Palette,
  ExternalLink,
  Filter
} from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'certificate' | 'guide' | 'template' | 'tool';
  category: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  icon: React.ReactNode;
  color: string;
}

const resourceCategories = [
  { id: 'saved', name: 'Saved', active: false },
  { id: 'tools', name: 'Tools', active: false },
  { id: 'guides', name: 'Guides', active: true },
  { id: 'templates', name: 'Templates', active: false },
];

const resources: Resource[] = [
  {
    id: '1',
    title: 'Figma Design System',
    description: 'Complete design system template',
    type: 'tool',
    category: 'Design',
    fileType: 'Figma File',
    fileSize: '15.2 MB',
    downloadUrl: '#',
    icon: <Palette size={20} color="#22C55E" />,
    color: '#22C55E'
  },
  {
    id: '2',
    title: 'Code Snippet Manager',
    description: 'Organize and share code snippets',
    type: 'tool',
    category: 'Development',
    fileType: 'Web App',
    fileSize: 'Online',
    downloadUrl: '#',
    icon: <Code size={20} color="#3B82F6" />,
    color: '#3B82F6'
  },
  {
    id: '3',
    title: 'Getting Started with React',
    description: 'Comprehensive React learning guide',
    type: 'guide',
    category: 'Development',
    fileType: 'PDF',
    fileSize: '8.7 MB',
    downloadUrl: '#',
    icon: <BookOpen size={20} color="#22C55E" />,
    color: '#22C55E'
  },
  {
    id: '4',
    title: 'UX Research Methods',
    description: 'Guide to user research techniques',
    type: 'guide',
    category: 'Research',
    fileType: 'PDF',
    fileSize: '5.1 MB',
    downloadUrl: '#',
    icon: <FileText size={20} color="#06B6D4" />,
    color: '#06B6D4'
  },
  {
    id: '5',
    title: 'Project Proposal Template',
    description: 'Professional project proposal format',
    type: 'template',
    category: 'Business',
    fileType: 'DOCX',
    fileSize: '1.2 MB',
    downloadUrl: '#',
    icon: <Briefcase size={20} color="#8B5CF6" />,
    color: '#8B5CF6'
  },
  {
    id: '6',
    title: 'Wireframe Kit',
    description: 'Mobile and web wireframe templates',
    type: 'template',
    category: 'Design',
    fileType: 'Sketch File',
    fileSize: '12.8 MB',
    downloadUrl: '#',
    icon: <Palette size={20} color="#22C55E" />,
    color: '#22C55E'
  }
];

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('guides');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'guides' ? true : 
      (activeCategory === 'tools' && resource.type === 'tool') ||
      (activeCategory === 'templates' && resource.type === 'template') ||
      (activeCategory === 'saved' && false); // No saved items for demo
    
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (resource: Resource) => {
    // In a real app, this would trigger the download
    console.log('Downloading:', resource.title);
  };

  const handleOpen = (resource: Resource) => {
    // In a real app, this would open the resource
    console.log('Opening:', resource.title);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Resources</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.neutral[100] }]}>
              <Search size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.neutral[100] }]}>
              <Download size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Learning Resources Header */}
        <View style={styles.learningHeader}>
          <Text style={[styles.learningTitle, { color: colors.text }]}>Learning Resources</Text>
          <Text style={[styles.learningSubtitle, { color: colors.textSecondary }]}>
            Tools, guides, and materials to enhance your learning
          </Text>
        </View>

        {/* Featured Cards */}
        <View style={styles.featuredContainer}>
          <TouchableOpacity style={[styles.featuredCard, styles.certificatesCard]}>
            <Award size={32} color="white" />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Certificates</Text>
              <Text style={styles.featuredSubtitle}>Professional certifications</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.featuredCard, styles.guidesCard]}>
            <BookOpen size={32} color="white" />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Study Guides</Text>
              <Text style={styles.featuredSubtitle}>Comprehensive guides</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          {resourceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                activeCategory === category.id && styles.activeCategoryTab,
                { backgroundColor: activeCategory === category.id ? colors.primary[50] : 'transparent' }
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  { color: activeCategory === category.id ? colors.primary[600] : colors.textSecondary }
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.neutral[50] }]}>
          <Search size={20} color={colors.neutral[400]} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search resources..."
            placeholderTextColor={colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        {/* Resources List */}
        <ScrollView style={styles.resourcesList} showsVerticalScrollIndicator={false}>
          {filteredResources.map((resource) => (
            <View key={resource.id} style={[styles.resourceCard, { backgroundColor: colors.background }]}>
              <View style={styles.resourceHeader}>
                <View style={[styles.resourceIcon, { backgroundColor: `${resource.color}15` }]}>
                  {resource.icon}
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={[styles.resourceTitle, { color: colors.text }]}>
                    {resource.title}
                  </Text>
                  <Text style={[styles.resourceDescription, { color: colors.textSecondary }]}>
                    {resource.description}
                  </Text>
                  <View style={styles.resourceMeta}>
                    <View style={[styles.categoryBadge, { backgroundColor: resource.color }]}>
                      <Text style={styles.categoryBadgeText}>{resource.category}</Text>
                    </View>
                    <Text style={[styles.fileInfo, { color: colors.textSecondary }]}>
                      {resource.fileType} • {resource.fileSize}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.resourceActions}>
                <Button
                  title="Download"
                  variant="outline"
                  size="small"
                  icon={<Download size={16} color={colors.primary[500]} />}
                  iconPosition="left"
                  onPress={() => handleDownload(resource)}
                  style={styles.actionButton}
                />
                <Button
                  title="Open"
                  variant="ghost"
                  size="small"
                  icon={<ExternalLink size={16} color={colors.primary[500]} />}
                  iconPosition="left"
                  onPress={() => handleOpen(resource)}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ))}

          {filteredResources.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No resources found
              </Text>
              <Text style={[styles.emptyStateMessage, { color: colors.textSecondary }]}>
                Try adjusting your search or category filter
              </Text>
            </View>
          )}

          {/* Built on Bolt badge */}
          <View style={styles.boltBadgeContainer}>
            <Text style={[styles.boltBadgeText, { color: colors.textSecondary }]}>
              Built on Bolt
            </Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learningHeader: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  learningTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  learningSubtitle: {
    fontSize: 14,
  },
  featuredContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  featuredCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minHeight: 80,
  },
  certificatesCard: {
    backgroundColor: '#22C55E',
  },
  guidesCard: {
    backgroundColor: '#3B82F6',
  },
  featuredContent: {
    marginLeft: 12,
    flex: 1,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  featuredSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryTab: {
    // backgroundColor set dynamically
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 4,
  },
  resourcesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resourceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  fileInfo: {
    fontSize: 12,
  },
  resourceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
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
    marginVertical: 24,
  },
  boltBadgeText: {
    fontSize: 12,
  },
});