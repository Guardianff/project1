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
  Share,
  Alert,
  Dimensions
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
  Filter, 
  Grid3x3, 
  List, 
  Calendar, 
  Building, 
  Share2, 
  Copy, 
  CircleCheck as CheckCircle, 
  X, 
  Eye, 
  Users, 
  Star, 
  Clock, 
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
  Target
} from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Animated, { FadeInUp, FadeInRight, SlideInRight } from 'react-native-reanimated';

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
  downloads?: number;
  rating?: number;
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
  }
];

const resources: Resource[] = [
  {
    id: '1',
    title: 'Advanced Design System Kit',
    description: 'Complete design system with 200+ components',
    type: 'tool',
    category: 'Design',
    fileType: 'Figma File',
    fileSize: '15.2 MB',
    downloadUrl: '#',
    icon: <Palette size={24} color="white" />,
    color: '#8B5CF6',
    downloads: 1250,
    rating: 4.9
  },
  {
    id: '2',
    title: 'React Native Boilerplate',
    description: 'Production-ready React Native starter template',
    type: 'tool',
    category: 'Development',
    fileType: 'GitHub Repo',
    fileSize: 'Online',
    downloadUrl: '#',
    icon: <Code size={24} color="white" />,
    color: '#06B6D4',
    downloads: 2100,
    rating: 4.8
  },
  {
    id: '3',
    title: 'Mobile App Marketing Guide',
    description: 'Complete guide to app store optimization',
    type: 'guide',
    category: 'Marketing',
    fileType: 'PDF',
    fileSize: '8.7 MB',
    downloadUrl: '#',
    icon: <TrendingUp size={24} color="white" />,
    color: '#F59E0B',
    downloads: 890,
    rating: 4.7
  },
  {
    id: '4',
    title: 'User Research Toolkit',
    description: 'Templates and methods for user research',
    type: 'template',
    category: 'Research',
    fileType: 'Notion Template',
    fileSize: 'Online',
    downloadUrl: '#',
    icon: <Target size={24} color="white" />,
    color: '#EF4444',
    downloads: 650,
    rating: 4.6
  }
];

const featuredResources = [
  {
    id: 'featured1',
    title: 'Premium Design Assets',
    subtitle: 'Exclusive collection of UI components',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    gradient: ['#8B5CF6', '#EC4899'],
    icon: <Sparkles size={32} color="white" />
  },
  {
    id: 'featured2',
    title: 'Developer Tools Suite',
    subtitle: 'Essential tools for modern development',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    gradient: ['#06B6D4', '#3B82F6'],
    icon: <Zap size={32} color="white" />
  }
];

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState<DigitalBadge | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  
  // Loading states for async operations
  const [isSharing, setIsSharing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: <Grid3x3 size={18} color={colors.primary[500]} /> },
    { id: 'tools', name: 'Tools', icon: <Code size={18} color={colors.primary[500]} /> },
    { id: 'guides', name: 'Guides', icon: <BookOpen size={18} color={colors.primary[500]} /> },
    { id: 'templates', name: 'Templates', icon: <FileText size={18} color={colors.primary[500]} /> },
    { id: 'badges', name: 'Badges', icon: <Award size={18} color={colors.primary[500]} /> },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || 
      (activeCategory === 'tools' && resource.type === 'tool') ||
      (activeCategory === 'guides' && resource.type === 'guide') ||
      (activeCategory === 'templates' && resource.type === 'template');
    
    return matchesSearch && matchesCategory;
  });

  const filteredBadges = digitalBadges.filter(badge => {
    return searchQuery === '' || 
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDownload = async (resource: Resource) => {
    try {
      console.log('Downloading:', resource.title);
      Alert.alert('Download Started', `Downloading ${resource.title}...`);
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Failed', 'Unable to download the resource. Please try again.');
    }
  };

  const handleShare = async (badge: DigitalBadge) => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      const shareContent = {
        message: `Check out my ${badge.name} certification from ${badge.issuer}! ${badge.verificationUrl}`,
        title: badge.name,
      };

      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({
            title: shareContent.title,
            text: shareContent.message,
            url: badge.verificationUrl,
          });
        } else {
          await handleCopyLink(badge);
        }
      } else {
        await Share.share(shareContent);
      }
    } catch (error: any) {
      console.error('Error sharing badge:', error);
      Alert.alert('Share Failed', 'Unable to share the badge. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async (badge: DigitalBadge) => {
    if (isCopying) return;
    
    setIsCopying(true);
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(badge.verificationUrl);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = badge.verificationUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
      }
      
      Alert.alert('Copied!', 'Verification link copied to clipboard');
    } catch (error: any) {
      console.error('Error copying link:', error);
      Alert.alert('Copy Failed', 'Unable to copy the link. Please try again.');
    } finally {
      setIsCopying(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const renderFeaturedCard = (item: typeof featuredResources[0], index: number) => (
    <Animated.View
      key={item.id}
      entering={SlideInRight.delay(index * 200).duration(600)}
      style={[styles.featuredCard, { width: screenWidth * 0.85 }]}
    >
      <TouchableOpacity style={styles.featuredCardContent} activeOpacity={0.9}>
        <Image source={{ uri: item.image }} style={styles.featuredCardImage} />
        <View style={[styles.featuredCardOverlay, { 
          background: `linear-gradient(135deg, ${item.gradient[0]}CC, ${item.gradient[1]}CC)` 
        }]}>
          <View style={styles.featuredCardHeader}>
            <View style={styles.featuredCardIcon}>
              {item.icon}
            </View>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          </View>
          <View style={styles.featuredCardBody}>
            <Text style={styles.featuredCardTitle}>{item.title}</Text>
            <Text style={styles.featuredCardSubtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.featuredCardFooter}>
            <Text style={styles.exploreText}>Explore Collection</Text>
            <ExternalLink size={20} color="white" />
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
      <View style={styles.resourceCardHeader}>
        <View style={[styles.resourceIconContainer, { backgroundColor: resource.color }]}>
          {resource.icon}
        </View>
        <View style={styles.resourceCardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.neutral[100] }]}
            onPress={() => handleDownload(resource)}
          >
            <Download size={16} color={colors.neutral[600]} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.neutral[100] }]}
          >
            <ExternalLink size={16} color={colors.neutral[600]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resourceCardContent}>
        <Text style={[styles.resourceCardTitle, { color: colors.text }]} numberOfLines={2}>
          {resource.title}
        </Text>
        <Text style={[styles.resourceCardDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {resource.description}
        </Text>

        <View style={styles.resourceCardMeta}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: colors.neutral[500] }]}>Type:</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{resource.fileType}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: colors.neutral[500] }]}>Size:</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{resource.fileSize}</Text>
          </View>
        </View>

        <View style={styles.resourceCardFooter}>
          <View style={styles.resourceStats}>
            <View style={styles.statItem}>
              <Download size={14} color={colors.neutral[500]} />
              <Text style={[styles.statText, { color: colors.neutral[600] }]}>
                {resource.downloads?.toLocaleString() || '0'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Star size={14} color={colors.warning[500]} />
              <Text style={[styles.statText, { color: colors.neutral[600] }]}>
                {resource.rating || '0'}
              </Text>
            </View>
          </View>
          <Badge label={resource.category} variant="neutral" size="small" />
        </View>
      </View>
    </Animated.View>
  );

  const renderBadgeCard = (badge: DigitalBadge, index: number) => (
    <Animated.View
      key={badge.id}
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={[styles.badgeCard, { backgroundColor: colors.background }]}
    >
      <TouchableOpacity
        onPress={() => setSelectedBadge(badge)}
        style={styles.badgeCardContent}
        activeOpacity={0.9}
      >
        <View style={styles.badgeCardHeader}>
          <Image source={{ uri: badge.badgeImage }} style={styles.badgeImage} />
          {badge.isVerified && (
            <View style={[styles.verifiedBadge, { backgroundColor: colors.success[500] }]}>
              <CheckCircle size={16} color="white" />
            </View>
          )}
        </View>

        <View style={styles.badgeCardBody}>
          <Text style={[styles.badgeTitle, { color: colors.text }]} numberOfLines={2}>
            {badge.name}
          </Text>
          <Text style={[styles.badgeIssuer, { color: colors.textSecondary }]}>
            {badge.issuer}
          </Text>
          <Text style={[styles.badgeDate, { color: colors.neutral[500] }]}>
            {formatDate(badge.dateEarned)}
          </Text>

          <View style={styles.badgeStats}>
            <View style={styles.badgeStatItem}>
              <Eye size={12} color={colors.neutral[500]} />
              <Text style={[styles.badgeStatText, { color: colors.neutral[600] }]}>
                {badge.viewCount}
              </Text>
            </View>
            <View style={styles.badgeStatItem}>
              <Share2 size={12} color={colors.neutral[500]} />
              <Text style={[styles.badgeStatText, { color: colors.neutral[600] }]}>
                {badge.shareCount}
              </Text>
            </View>
          </View>

          <View style={styles.badgeTags}>
            <Badge label={badge.skillLevel} variant="primary" size="small" />
            <Badge label={badge.category} variant="neutral" size="small" />
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
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Resources</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Tools, guides, and credentials to accelerate your growth
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.neutral[100] }]}>
                <Search size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.neutral[100] }]}>
                <Download size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(400)}
          style={[styles.searchContainer, { backgroundColor: colors.neutral[50] }]}
        >
          <Search size={20} color={colors.neutral[400]} />
          <Text style={[styles.searchPlaceholder, { color: colors.neutral[400] }]}>
            Search resources, tools, and badges...
          </Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={18} color={colors.neutral[400]} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Featured Resources */}
          <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Collections</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            >
              {featuredResources.map((item, index) => renderFeaturedCard(item, index))}
            </ScrollView>
          </Animated.View>

          {/* Category Navigation */}
          <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.section}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: colors.neutral[100] },
                    activeCategory === category.id && { 
                      backgroundColor: colors.primary[50], 
                      borderColor: colors.primary[200] 
                    }
                  ]}
                  onPress={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: colors.neutral[600] },
                      activeCategory === category.id && { 
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

          {/* Content Grid */}
          <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {activeCategory === 'badges' ? 'Digital Badges' : 'Learning Resources'}
              </Text>
              <TouchableOpacity style={styles.viewModeButton}>
                {viewMode === 'grid' ? 
                  <List size={20} color={colors.neutral[500]} /> : 
                  <Grid3x3 size={20} color={colors.neutral[500]} />
                }
              </TouchableOpacity>
            </View>

            <View style={styles.contentGrid}>
              {activeCategory === 'badges' ? (
                filteredBadges.map((badge, index) => renderBadgeCard(badge, index))
              ) : (
                filteredResources.map((resource, index) => renderResourceCard(resource, index))
              )}
            </View>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
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

              <ScrollView style={styles.modalBody}>
                <View style={styles.badgeDetailHeader}>
                  <Image source={{ uri: selectedBadge.badgeImage }} style={styles.badgeDetailImage} />
                  <Text style={[styles.badgeDetailName, { color: colors.text }]}>
                    {selectedBadge.name}
                  </Text>
                  <Text style={[styles.badgeDetailIssuer, { color: colors.textSecondary }]}>
                    {selectedBadge.issuer}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    title={isSharing ? "Sharing..." : "Share Badge"}
                    variant="primary"
                    icon={<Share2 size={16} color="white" />}
                    iconPosition="left"
                    onPress={() => handleShare(selectedBadge)}
                    disabled={isSharing}
                    style={styles.shareButton}
                  />
                  <Button
                    title={isCopying ? "Copying..." : "Copy Link"}
                    variant="outline"
                    icon={<Copy size={16} color={colors.primary[500]} />}
                    iconPosition="left"
                    onPress={() => handleCopyLink(selectedBadge)}
                    disabled={isCopying}
                    style={styles.copyButton}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  viewModeButton: {
    padding: 8,
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    height: 200,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredCardContent: {
    flex: 1,
  },
  featuredCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'space-between',
  },
  featuredCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featuredCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredCardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  featuredCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  featuredCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exploreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  contentGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resourceCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  resourceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resourceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceCardContent: {
    flex: 1,
  },
  resourceCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  resourceCardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  resourceCardMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 12,
    marginRight: 6,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  resourceCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  badgeCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  badgeCardContent: {
    alignItems: 'center',
  },
  badgeCardHeader: {
    position: 'relative',
    marginBottom: 12,
  },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCardBody: {
    alignItems: 'center',
  },
  badgeTitle: {
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
  badgeStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  badgeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeStatText: {
    fontSize: 10,
  },
  badgeTags: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
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
  modalBody: {
    padding: 20,
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
  badgeDetailName: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeDetailIssuer: {
    fontSize: 16,
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
  },
  shareButton: {
    // Primary button styling
  },
  copyButton: {
    // Outline button styling
  },
  bottomSpacing: {
    height: 100,
  },
});
