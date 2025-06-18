import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput,
  Modal,
  Image,
  Share,
  Clipboard,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Download, Award, BookOpen, FileText, Code, Briefcase, Palette, ExternalLink, Filter, Grid3x3, List, Calendar, Building, Share2, Copy, CircleCheck as CheckCircle, X, Eye, Users, Star, Clock, Shield } from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface DigitalBadge {
  id: string;
  name: string;
  description: string;
  issuer: string;
  issuerLogo: string;
  badgeImage: string;
  dateEarned: string;
  verificationUrl: string;
  isVerified: boolean;
  category: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  credentialType: 'certification' | 'badge' | 'course_completion' | 'skill_assessment';
  shareCount: number;
  viewCount: number;
  tags: string[];
}

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

const digitalBadges: DigitalBadge[] = [
  {
    id: 'badge1',
    name: 'React Native Expert',
    description: 'Demonstrated advanced proficiency in React Native development, including navigation, state management, and performance optimization.',
    issuer: 'Meta Developer Certification',
    issuerLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    badgeImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    dateEarned: '2024-12-15',
    verificationUrl: 'https://verify.meta.com/badge/react-native-expert',
    isVerified: true,
    category: 'Development',
    skillLevel: 'expert',
    credentialType: 'certification',
    shareCount: 45,
    viewCount: 234,
    tags: ['React Native', 'Mobile Development', 'JavaScript', 'Cross-platform']
  },
  {
    id: 'badge2',
    name: 'UI/UX Design Professional',
    description: 'Completed comprehensive training in user interface and user experience design principles, including user research and prototyping.',
    issuer: 'Google Design Certificate',
    issuerLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    badgeImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    dateEarned: '2024-11-20',
    verificationUrl: 'https://verify.google.com/badge/ux-design-pro',
    isVerified: true,
    category: 'Design',
    skillLevel: 'advanced',
    credentialType: 'certification',
    shareCount: 32,
    viewCount: 187,
    tags: ['UI Design', 'UX Research', 'Prototyping', 'Figma']
  },
  {
    id: 'badge3',
    name: 'JavaScript Fundamentals',
    description: 'Successfully completed foundational JavaScript programming course covering ES6+, DOM manipulation, and asynchronous programming.',
    issuer: 'freeCodeCamp',
    issuerLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    badgeImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    dateEarned: '2024-10-05',
    verificationUrl: 'https://verify.freecodecamp.org/badge/js-fundamentals',
    isVerified: true,
    category: 'Development',
    skillLevel: 'intermediate',
    credentialType: 'course_completion',
    shareCount: 28,
    viewCount: 156,
    tags: ['JavaScript', 'Programming', 'Web Development', 'ES6']
  },
  {
    id: 'badge4',
    name: 'Digital Marketing Specialist',
    description: 'Demonstrated expertise in digital marketing strategies, SEO, social media marketing, and analytics.',
    issuer: 'HubSpot Academy',
    issuerLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    badgeImage: 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=400',
    dateEarned: '2024-09-12',
    verificationUrl: 'https://verify.hubspot.com/badge/digital-marketing',
    isVerified: true,
    category: 'Marketing',
    skillLevel: 'advanced',
    credentialType: 'certification',
    shareCount: 41,
    viewCount: 203,
    tags: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics']
  },
  {
    id: 'badge5',
    name: 'Project Management Professional',
    description: 'Certified in project management methodologies including Agile, Scrum, and traditional project management approaches.',
    issuer: 'Project Management Institute',
    issuerLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    badgeImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    dateEarned: '2024-08-30',
    verificationUrl: 'https://verify.pmi.org/badge/pmp-professional',
    isVerified: true,
    category: 'Business',
    skillLevel: 'expert',
    credentialType: 'certification',
    shareCount: 67,
    viewCount: 312,
    tags: ['Project Management', 'Agile', 'Scrum', 'Leadership']
  },
  {
    id: 'badge6',
    name: 'Data Analysis with Python',
    description: 'Completed advanced data analysis course using Python, pandas, and visualization libraries.',
    issuer: 'Coursera - IBM',
    issuerLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    badgeImage: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=400',
    dateEarned: '2024-07-18',
    verificationUrl: 'https://verify.coursera.org/badge/data-analysis-python',
    isVerified: true,
    category: 'Data Science',
    skillLevel: 'intermediate',
    credentialType: 'course_completion',
    shareCount: 23,
    viewCount: 134,
    tags: ['Python', 'Data Analysis', 'Pandas', 'Visualization']
  }
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
  }
];

const resourceCategories = [
  { id: 'saved', name: 'Saved', active: false },
  { id: 'tools', name: 'Tools', active: false },
  { id: 'guides', name: 'Guides', active: true },
  { id: 'templates', name: 'Templates', active: false },
  { id: 'badges', name: 'Badges', active: false },
];

const badgeCategories = ['All', 'Development', 'Design', 'Marketing', 'Business', 'Data Science'];
const skillLevels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const credentialTypes = ['All', 'Certification', 'Badge', 'Course Completion', 'Skill Assessment'];

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('guides');
  const [selectedBadge, setSelectedBadge] = useState<DigitalBadge | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Badge filters
  const [badgeCategory, setBadgeCategory] = useState('All');
  const [skillLevel, setSkillLevel] = useState('All');
  const [credentialType, setCredentialType] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'issuer'>('date');

  // Filter badges based on current filters
  const filteredBadges = digitalBadges.filter(badge => {
    const matchesSearch = searchQuery === '' || 
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = badgeCategory === 'All' || badge.category === badgeCategory;
    const matchesSkillLevel = skillLevel === 'All' || badge.skillLevel === skillLevel.toLowerCase();
    const matchesCredentialType = credentialType === 'All' || 
      badge.credentialType === credentialType.toLowerCase().replace(' ', '_');
    
    return matchesSearch && matchesCategory && matchesSkillLevel && matchesCredentialType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'issuer':
        return a.issuer.localeCompare(b.issuer);
      case 'date':
      default:
        return new Date(b.dateEarned).getTime() - new Date(a.dateEarned).getTime();
    }
  });

  // Filter resources based on current filters
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
    console.log('Downloading:', resource.title);
  };

  const handleOpen = (resource: Resource) => {
    console.log('Opening:', resource.title);
  };

  const handleBadgePress = (badge: DigitalBadge) => {
    setSelectedBadge(badge);
  };

  const handleShare = async (badge: DigitalBadge) => {
    try {
      if (Platform.OS === 'web') {
        // Web sharing
        if (navigator.share) {
          await navigator.share({
            title: badge.name,
            text: `Check out my ${badge.name} certification from ${badge.issuer}!`,
            url: badge.verificationUrl,
          });
        } else {
          // Fallback for web browsers without native sharing
          await Clipboard.setString(`Check out my ${badge.name} certification from ${badge.issuer}! ${badge.verificationUrl}`);
          Alert.alert('Copied to clipboard', 'Badge details copied to clipboard');
        }
      } else {
        // Mobile sharing
        await Share.share({
          message: `Check out my ${badge.name} certification from ${badge.issuer}! ${badge.verificationUrl}`,
          title: badge.name,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = async (badge: DigitalBadge) => {
    try {
      await Clipboard.setString(badge.verificationUrl);
      Alert.alert('Copied!', 'Verification link copied to clipboard');
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderBadgeCard = (badge: DigitalBadge, index: number) => (
    <Animated.View
      key={badge.id}
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={[
        styles.badgeCard,
        { backgroundColor: colors.background },
        viewMode === 'list' && styles.badgeCardList
      ]}
    >
      <TouchableOpacity
        onPress={() => handleBadgePress(badge)}
        style={styles.badgeCardContent}
        activeOpacity={0.8}
      >
        <View style={styles.badgeImageContainer}>
          <Image source={{ uri: badge.badgeImage }} style={styles.badgeImage} />
          {badge.isVerified && (
            <View style={[styles.verifiedBadge, { backgroundColor: colors.success[500] }]}>
              <CheckCircle size={16} color="white" />
            </View>
          )}
        </View>
        
        <View style={styles.badgeInfo}>
          <Text style={[styles.badgeName, { color: colors.text }]} numberOfLines={2}>
            {badge.name}
          </Text>
          <Text style={[styles.badgeIssuer, { color: colors.textSecondary }]}>
            {badge.issuer}
          </Text>
          <Text style={[styles.badgeDate, { color: colors.neutral[500] }]}>
            Earned {formatDate(badge.dateEarned)}
          </Text>
          
          <View style={styles.badgeMetrics}>
            <View style={styles.badgeMetric}>
              <Eye size={12} color={colors.neutral[500]} />
              <Text style={[styles.badgeMetricText, { color: colors.neutral[600] }]}>
                {badge.viewCount}
              </Text>
            </View>
            <View style={styles.badgeMetric}>
              <Share2 size={12} color={colors.neutral[500]} />
              <Text style={[styles.badgeMetricText, { color: colors.neutral[600] }]}>
                {badge.shareCount}
              </Text>
            </View>
          </View>
          
          <View style={styles.badgeTags}>
            <Badge
              label={badge.skillLevel}
              variant="primary"
              size="small"
            />
            <Badge
              label={badge.category}
              variant="neutral"
              size="small"
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderResourceCard = (resource: Resource, index: number) => (
    <Animated.View
      key={resource.id}
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={[styles.resourceCard, { backgroundColor: colors.background }]}
    >
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
    </Animated.View>
  );

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

        {/* Search and Controls */}
        <View style={[styles.searchContainer, { backgroundColor: colors.neutral[50] }]}>
          <Search size={20} color={colors.neutral[400]} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search resources..."
            placeholderTextColor={colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {activeCategory === 'badges' && (
            <>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} color={colors.neutral[400]} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.viewModeButton}
                onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? 
                  <List size={20} color={colors.neutral[400]} /> : 
                  <Grid3x3 size={20} color={colors.neutral[400]} />
                }
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Badge Filters */}
        {activeCategory === 'badges' && showFilters && (
          <Animated.View 
            entering={FadeInUp.duration(300)}
            style={[styles.filtersPanel, { backgroundColor: colors.neutral[50] }]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterGroup}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>Category:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {badgeCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.filterChip,
                        { backgroundColor: colors.neutral[100] },
                        badgeCategory === cat && { backgroundColor: colors.primary[100] }
                      ]}
                      onPress={() => setBadgeCategory(cat)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        { color: badgeCategory === cat ? colors.primary[700] : colors.neutral[600] }
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.filterGroup}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>Level:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {skillLevels.map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.filterChip,
                        { backgroundColor: colors.neutral[100] },
                        skillLevel === level && { backgroundColor: colors.primary[100] }
                      ]}
                      onPress={() => setSkillLevel(level)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        { color: skillLevel === level ? colors.primary[700] : colors.neutral[600] }
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {/* Content */}
        <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false}>
          {activeCategory === 'badges' ? (
            <View style={[
              styles.badgesContainer,
              viewMode === 'grid' ? styles.badgesGrid : styles.badgesList
            ]}>
              {filteredBadges.length === 0 ? (
                <View style={styles.emptyState}>
                  <Award size={48} color={colors.neutral[400]} />
                  <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                    No badges found
                  </Text>
                  <Text style={[styles.emptyStateMessage, { color: colors.textSecondary }]}>
                    Try adjusting your search or filters
                  </Text>
                </View>
              ) : (
                filteredBadges.map((badge, index) => renderBadgeCard(badge, index))
              )}
            </View>
          ) : (
            <View style={styles.resourcesContainer}>
              {filteredResources.length === 0 ? (
                <View style={styles.emptyState}>
                  <FileText size={48} color={colors.neutral[400]} />
                  <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                    No resources found
                  </Text>
                  <Text style={[styles.emptyStateMessage, { color: colors.textSecondary }]}>
                    Try adjusting your search or category filter
                  </Text>
                </View>
              ) : (
                filteredResources.map((resource, index) => renderResourceCard(resource, index))
              )}
            </View>
          )}

          {/* Built on Bolt badge */}
          <View style={styles.boltBadgeContainer}>
            <Text style={[styles.boltBadgeText, { color: colors.textSecondary }]}>
              Built on Bolt
            </Text>
          </View>
        </ScrollView>

        {/* Badge Detail Modal */}
        <Modal
          visible={selectedBadge !== null}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedBadge(null)}
        >
          {selectedBadge && (
            <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedBadge(null)}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Badge Details</Text>
                <View style={styles.modalHeaderSpacer} />
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.badgeDetailHeader}>
                  <Image source={{ uri: selectedBadge.badgeImage }} style={styles.badgeDetailImage} />
                  <View style={styles.badgeDetailInfo}>
                    <Text style={[styles.badgeDetailName, { color: colors.text }]}>
                      {selectedBadge.name}
                    </Text>
                    <View style={styles.issuerContainer}>
                      <Image source={{ uri: selectedBadge.issuerLogo }} style={styles.issuerLogo} />
                      <Text style={[styles.badgeDetailIssuer, { color: colors.textSecondary }]}>
                        {selectedBadge.issuer}
                      </Text>
                    </View>
                    <View style={styles.verificationContainer}>
                      {selectedBadge.isVerified ? (
                        <View style={styles.verifiedStatus}>
                          <Shield size={16} color={colors.success[500]} />
                          <Text style={[styles.verifiedText, { color: colors.success[600] }]}>
                            Verified Credential
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.unverifiedStatus}>
                          <Shield size={16} color={colors.warning[500]} />
                          <Text style={[styles.unverifiedText, { color: colors.warning[600] }]}>
                            Pending Verification
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.badgeDetailSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                  <Text style={[styles.badgeDescription, { color: colors.textSecondary }]}>
                    {selectedBadge.description}
                  </Text>
                </View>

                <View style={styles.badgeDetailSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Calendar size={16} color={colors.neutral[500]} />
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Earned</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {formatDate(selectedBadge.dateEarned)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Star size={16} color={colors.neutral[500]} />
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Level</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {selectedBadge.skillLevel.charAt(0).toUpperCase() + selectedBadge.skillLevel.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Building size={16} color={colors.neutral[500]} />
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Type</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {selectedBadge.credentialType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Users size={16} color={colors.neutral[500]} />
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Views</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {selectedBadge.viewCount}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.badgeDetailSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills</Text>
                  <View style={styles.tagsContainer}>
                    {selectedBadge.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        label={tag}
                        variant="neutral"
                        size="small"
                        style={styles.skillTag}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    title="Share Badge"
                    variant="primary"
                    icon={<Share2 size={16} color="white" />}
                    iconPosition="left"
                    onPress={() => handleShare(selectedBadge)}
                    style={styles.shareButton}
                  />
                  <Button
                    title="Copy Link"
                    variant="outline"
                    icon={<Copy size={16} color={colors.primary[500]} />}
                    iconPosition="left"
                    onPress={() => handleCopyLink(selectedBadge)}
                    style={styles.copyButton}
                  />
                  <Button
                    title="Verify"
                    variant="ghost"
                    icon={<ExternalLink size={16} color={colors.primary[500]} />}
                    iconPosition="left"
                    onPress={() => {
                      // Open verification URL
                      console.log('Opening verification:', selectedBadge.verificationUrl);
                    }}
                    style={styles.verifyButton}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          )}
        </Modal>
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
    marginLeft: 8,
  },
  viewModeButton: {
    padding: 4,
    marginLeft: 8,
  },
  filtersPanel: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contentList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  badgesContainer: {
    paddingBottom: 80,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgesList: {
    // List layout
  },
  badgeCard: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: '48%',
  },
  badgeCardList: {
    width: '100%',
  },
  badgeCardContent: {
    padding: 16,
  },
  badgeImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInfo: {
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeIssuer: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeMetrics: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  badgeMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeMetricText: {
    fontSize: 10,
  },
  badgeTags: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  resourcesContainer: {
    paddingBottom: 80,
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
    marginTop: 16,
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
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalHeaderSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  badgeDetailHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeDetailImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  badgeDetailInfo: {
    alignItems: 'center',
  },
  badgeDetailName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  issuerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  issuerLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeDetailIssuer: {
    fontSize: 16,
  },
  verificationContainer: {
    marginBottom: 8,
  },
  verifiedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  unverifiedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unverifiedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  badgeDetailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  badgeDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    marginBottom: 4,
  },
  actionButtons: {
    gap: 12,
    marginTop: 24,
  },
  shareButton: {
    // Primary button styling
  },
  copyButton: {
    // Outline button styling
  },
  verifyButton: {
    // Ghost button styling
  },
});