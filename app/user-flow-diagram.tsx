import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brain, Target, Rocket, Dumbbell, Palette, BookOpen, Compass, RotateCcw, MessageCircle, Chrome as Home, TrendingUp, Play, Calendar, Bell, Search, Filter, Grid3x3, Award, ChartBar as BarChart3, Settings, User, LogOut, Camera, Music, Activity, Briefcase, Code, Languages, Heart, Zap, Sparkles, ChevronRight, Plus, Clock, Users, Star, Download, Share2, Eye, CircleCheck as CheckCircle, ArrowRight, Lightbulb, Coffee, Moon, Sun, Volume2, Mic, Globe, Smartphone, Monitor, Tablet, Headphones, FileText, Video, Image as ImageIcon, Bookmark, Flag, Repeat, Shuffle, SkipForward, Pause } from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp, FadeInRight, SlideInRight } from 'react-native-reanimated';

interface FlowNode {
  id: string;
  title: string;
  description?: string;
  type: 'start' | 'action' | 'decision' | 'screen' | 'feature' | 'end';
  icon?: React.ReactNode;
  color?: string;
  connections?: string[];
  position: { x: number; y: number };
  category?: string;
}

interface FlowConnection {
  from: string;
  to: string;
  label?: string;
  type?: 'primary' | 'secondary' | 'conditional';
}

const flowNodes: FlowNode[] = [
  // AI Assistant Flow
  {
    id: 'ai-start',
    title: 'AI Assistant',
    description: 'What would you like to work on today?',
    type: 'start',
    icon: <Brain size={24} color="white" />,
    color: '#8B5CF6',
    position: { x: 50, y: 50 },
    category: 'ai'
  },
  {
    id: 'set-goal',
    title: 'Set a Goal',
    type: 'action',
    icon: <Target size={20} color="white" />,
    color: '#EF4444',
    position: { x: 200, y: 100 },
    category: 'ai'
  },
  {
    id: 'career-plan',
    title: 'Career Plan',
    type: 'action',
    icon: <Rocket size={20} color="white" />,
    color: '#3B82F6',
    position: { x: 200, y: 150 },
    category: 'ai'
  },
  {
    id: 'fitness-plan',
    title: 'Fitness Plan',
    type: 'action',
    icon: <Dumbbell size={20} color="white" />,
    color: '#10B981',
    position: { x: 200, y: 200 },
    category: 'ai'
  },
  {
    id: 'passion-plan',
    title: 'Passion Plan',
    type: 'action',
    icon: <Heart size={20} color="white" />,
    color: '#F59E0B',
    position: { x: 200, y: 250 },
    category: 'ai'
  },
  {
    id: 'skills-plan',
    title: 'Skills Plan',
    type: 'action',
    icon: <BookOpen size={20} color="white" />,
    color: '#06B6D4',
    position: { x: 200, y: 300 },
    category: 'ai'
  },
  {
    id: 'daily-plan',
    title: 'Review Daily Plan',
    type: 'screen',
    icon: <Compass size={20} color="white" />,
    color: '#8B5CF6',
    position: { x: 200, y: 350 },
    category: 'ai'
  },
  {
    id: 'preferences',
    title: 'Update Preferences',
    type: 'action',
    icon: <Settings size={20} color="white" />,
    color: '#6B7280',
    position: { x: 200, y: 400 },
    category: 'ai'
  },
  {
    id: 'ai-chat',
    title: 'Ask Me Anything',
    type: 'feature',
    icon: <MessageCircle size={20} color="white" />,
    color: '#8B5CF6',
    position: { x: 200, y: 450 },
    category: 'ai'
  },

  // Home Tab Flow
  {
    id: 'home-tab',
    title: 'Home Tab',
    type: 'screen',
    icon: <Home size={24} color="white" />,
    color: '#3B82F6',
    position: { x: 500, y: 50 },
    category: 'home'
  },
  {
    id: 'todays-plan',
    title: "Today's Plan",
    description: 'Course → Workout → Breaks',
    type: 'feature',
    icon: <Calendar size={20} color="white" />,
    color: '#10B981',
    position: { x: 650, y: 100 },
    category: 'home'
  },
  {
    id: 'progress-overview',
    title: 'Progress Overview',
    description: 'Goals, streaks, growth %',
    type: 'feature',
    icon: <TrendingUp size={20} color="white" />,
    color: '#F59E0B',
    position: { x: 650, y: 150 },
    category: 'home'
  },
  {
    id: 'resume-activity',
    title: 'Resume Last Activity',
    description: 'Context-aware smart resume',
    type: 'action',
    icon: <Play size={20} color="white" />,
    color: '#EF4444',
    position: { x: 650, y: 200 },
    category: 'home'
  },
  {
    id: 'daily-tip',
    title: 'Daily Tip / AI Insight',
    description: 'Scrollable, save-to-journal',
    type: 'feature',
    icon: <Lightbulb size={20} color="white" />,
    color: '#8B5CF6',
    position: { x: 650, y: 250 },
    category: 'home'
  },

  // Courses Tab Flow
  {
    id: 'courses-tab',
    title: 'Courses Tab',
    type: 'screen',
    icon: <BookOpen size={24} color="white" />,
    color: '#06B6D4',
    position: { x: 900, y: 50 },
    category: 'courses'
  },
  {
    id: 'category-selector',
    title: 'Category Selector',
    description: 'Design, Development, Business, etc.',
    type: 'feature',
    icon: <Grid3x3 size={20} color="white" />,
    color: '#8B5CF6',
    position: { x: 1050, y: 100 },
    category: 'courses'
  },
  {
    id: 'course-filters',
    title: 'Course Filters',
    description: 'Level, Duration, Format, Language',
    type: 'feature',
    icon: <Filter size={20} color="white" />,
    color: '#6B7280',
    position: { x: 1050, y: 150 },
    category: 'courses'
  },
  {
    id: 'smart-search',
    title: 'Smart Search',
    description: 'AI-enhanced autocomplete',
    type: 'feature',
    icon: <Search size={20} color="white" />,
    color: '#10B981',
    position: { x: 1050, y: 200 },
    category: 'courses'
  },
  {
    id: 'course-preview',
    title: 'Course Preview Modal',
    description: 'Enroll | Start | Download | Schedule',
    type: 'screen',
    icon: <Eye size={20} color="white" />,
    color: '#F59E0B',
    position: { x: 1200, y: 150 },
    category: 'courses'
  },

  // Coaching Tab Flow
  {
    id: 'coaching-tab',
    title: 'Coaching Tab',
    type: 'screen',
    icon: <Users size={24} color="white" />,
    color: '#10B981',
    position: { x: 50, y: 600 },
    category: 'coaching'
  },
  {
    id: 'coach-categories',
    title: 'Coach Categories',
    description: 'Fitness | Career | Mindfulness | Productivity | Life',
    type: 'feature',
    icon: <Award size={20} color="white" />,
    color: '#8B5CF6',
    position: { x: 200, y: 650 },
    category: 'coaching'
  },
  {
    id: 'schedule-session',
    title: 'Schedule Session',
    description: 'In-app calendar, auto-suggested slots',
    type: 'action',
    icon: <Calendar size={20} color="white" />,
    color: '#3B82F6',
    position: { x: 200, y: 700 },
    category: 'coaching'
  },
  {
    id: 'join-meeting',
    title: 'Join Meeting',
    description: 'In-app/external video',
    type: 'action',
    icon: <Video size={20} color="white" />,
    color: '#EF4444',
    position: { x: 200, y: 750 },
    category: 'coaching'
  },
  {
    id: 'session-notes',
    title: 'View Notes',
    description: 'Past session notes, AI summaries',
    type: 'feature',
    icon: <FileText size={20} color="white" />,
    color: '#F59E0B',
    position: { x: 200, y: 800 },
    category: 'coaching'
  },
  {
    id: 'coach-matching',
    title: 'Match Me with a Coach',
    description: 'AI wizard form',
    type: 'feature',
    icon: <Zap size={20} color="white" />,
    color: '#8B5CF6',
    position: { x: 200, y: 850 },
    category: 'coaching'
  },

  // Resources Tab Flow
  {
    id: 'resources-tab',
    title: 'Resources Tab',
    type: 'screen',
    icon: <FileText size={24} color="white" />,
    color: '#F59E0B',
    position: { x: 500, y: 600 },
    category: 'resources'
  },
  {
    id: 'resource-types',
    title: 'Resource Types',
    description: 'eBooks | Templates | Meal Plans | Meditation | Articles | Certified Docs',
    type: 'feature',
    icon: <Grid3x3 size={20} color="white" />,
    color: '#06B6D4',
    position: { x: 650, y: 650 },
    category: 'resources'
  },
  {
    id: 'resource-modal',
    title: 'Resource Modal',
    description: 'Open | Download | Add to Favorites | Add to Daily Plan',
    type: 'screen',
    icon: <Download size={20} color="white" />,
    color: '#10B981',
    position: { x: 800, y: 700 },
    category: 'resources'
  },
  {
    id: 'ai-recommender',
    title: 'AI Recommender',
    description: 'Goal-based suggestions',
    type: 'feature',
    icon: <Sparkles size={20} color="white" />,
    color: '#8B5CF6',
    position: { x: 650, y: 750 },
    category: 'resources'
  },

  // Profile Tab Flow
  {
    id: 'profile-tab',
    title: 'Profile Tab',
    type: 'screen',
    icon: <User size={24} color="white" />,
    color: '#6B7280',
    position: { x: 900, y: 600 },
    category: 'profile'
  },
  {
    id: 'edit-profile',
    title: 'Edit Profile',
    description: 'Name, avatar, interests',
    type: 'action',
    icon: <User size={20} color="white" />,
    color: '#3B82F6',
    position: { x: 1050, y: 650 },
    category: 'profile'
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Badges, streaks, challenges',
    type: 'feature',
    icon: <Award size={20} color="white" />,
    color: '#F59E0B',
    position: { x: 1050, y: 700 },
    category: 'profile'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Time spent, categories, patterns',
    type: 'feature',
    icon: <BarChart3 size={20} color="white" />,
    color: '#10B981',
    position: { x: 1050, y: 750 },
    category: 'profile'
  },
  {
    id: 'goals-overview',
    title: 'Goals Overview',
    description: 'Active, completed, upcoming',
    type: 'feature',
    icon: <Target size={20} color="white" />,
    color: '#EF4444',
    position: { x: 1050, y: 800 },
    category: 'profile'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Dark mode, notifications, support',
    type: 'screen',
    icon: <Settings size={20} color="white" />,
    color: '#6B7280',
    position: { x: 1050, y: 850 },
    category: 'profile'
  },

  // Notifications Flow
  {
    id: 'notifications',
    title: 'Notifications Page',
    description: 'All | Courses | Coaching | Resources | AI Messages',
    type: 'screen',
    icon: <Bell size={24} color="white" />,
    color: '#EF4444',
    position: { x: 1300, y: 50 },
    category: 'notifications'
  },
  {
    id: 'notification-filters',
    title: 'Notification Filters',
    description: 'Clear all, mark read, filter, categories',
    type: 'feature',
    icon: <Filter size={20} color="white" />,
    color: '#6B7280',
    position: { x: 1450, y: 100 },
    category: 'notifications'
  },
  {
    id: 'ai-summaries',
    title: 'AI Summaries',
    description: 'This week: 3 missed sessions, 2 wins',
    type: 'feature',
    icon: <Brain size={20} color="white" />,
    color: '#8B5CF6',
    position: { x: 1450, y: 150 },
    category: 'notifications'
  }
];

const flowConnections: FlowConnection[] = [
  // AI Assistant connections
  { from: 'ai-start', to: 'set-goal', label: '🎯 Set a Goal' },
  { from: 'ai-start', to: 'career-plan', label: '🚀 Career' },
  { from: 'ai-start', to: 'fitness-plan', label: '💪 Fitness' },
  { from: 'ai-start', to: 'passion-plan', label: '🎨 Passion' },
  { from: 'ai-start', to: 'skills-plan', label: '📘 Skills' },
  { from: 'ai-start', to: 'daily-plan', label: '🧭 Review Daily Plan' },
  { from: 'ai-start', to: 'preferences', label: '🔄 Update Preferences' },
  { from: 'ai-start', to: 'ai-chat', label: '💬 Ask Me Anything' },

  // Home Tab connections
  { from: 'home-tab', to: 'todays-plan', label: 'Tap for breakdown' },
  { from: 'home-tab', to: 'progress-overview', label: 'Opens analytics' },
  { from: 'home-tab', to: 'resume-activity', label: 'Smart resume' },
  { from: 'home-tab', to: 'daily-tip', label: 'Scrollable tips' },

  // Courses Tab connections
  { from: 'courses-tab', to: 'category-selector', label: 'Browse categories' },
  { from: 'courses-tab', to: 'smart-search', label: 'Search courses' },
  { from: 'category-selector', to: 'course-filters', label: 'Apply filters' },
  { from: 'course-filters', to: 'course-preview', label: 'Tap course' },
  { from: 'smart-search', to: 'course-preview', label: 'Select result' },

  // Coaching Tab connections
  { from: 'coaching-tab', to: 'coach-categories', label: 'Browse coaches' },
  { from: 'coaching-tab', to: 'schedule-session', label: '📅 Schedule' },
  { from: 'coaching-tab', to: 'join-meeting', label: '🎥 Join' },
  { from: 'coaching-tab', to: 'session-notes', label: '📓 View Notes' },
  { from: 'coaching-tab', to: 'coach-matching', label: '🤖 Match Me' },

  // Resources Tab connections
  { from: 'resources-tab', to: 'resource-types', label: 'Browse types' },
  { from: 'resource-types', to: 'resource-modal', label: 'Tap resource' },
  { from: 'resources-tab', to: 'ai-recommender', label: 'Get suggestions' },

  // Profile Tab connections
  { from: 'profile-tab', to: 'edit-profile', label: 'Edit profile' },
  { from: 'profile-tab', to: 'achievements', label: 'View badges' },
  { from: 'profile-tab', to: 'analytics', label: 'View analytics' },
  { from: 'profile-tab', to: 'goals-overview', label: 'View goals' },
  { from: 'profile-tab', to: 'settings', label: 'Open settings' },

  // Notifications connections
  { from: 'notifications', to: 'notification-filters', label: 'Filter notifications' },
  { from: 'notifications', to: 'ai-summaries', label: 'View summaries' },

  // Cross-tab connections
  { from: 'ai-start', to: 'home-tab', label: 'Navigate to Home' },
  { from: 'home-tab', to: 'courses-tab', label: 'Continue Learning' },
  { from: 'home-tab', to: 'coaching-tab', label: 'Join Meeting' },
  { from: 'todays-plan', to: 'courses-tab', label: 'Start course' },
  { from: 'resume-activity', to: 'courses-tab', label: 'Resume course' }
];

export default function UserFlowDiagram() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const categories = [
    { id: 'all', name: 'All Features', color: '#6B7280' },
    { id: 'ai', name: 'AI Assistant', color: '#8B5CF6' },
    { id: 'home', name: 'Home Tab', color: '#3B82F6' },
    { id: 'courses', name: 'Courses', color: '#06B6D4' },
    { id: 'coaching', name: 'Coaching', color: '#10B981' },
    { id: 'resources', name: 'Resources', color: '#F59E0B' },
    { id: 'profile', name: 'Profile', color: '#6B7280' },
    { id: 'notifications', name: 'Notifications', color: '#EF4444' }
  ];

  const filteredNodes = selectedCategory && selectedCategory !== 'all' 
    ? flowNodes.filter(node => node.category === selectedCategory)
    : flowNodes;

  const filteredConnections = flowConnections.filter(conn => {
    const fromNode = flowNodes.find(n => n.id === conn.from);
    const toNode = flowNodes.find(n => n.id === conn.to);
    
    if (!selectedCategory || selectedCategory === 'all') return true;
    
    return (fromNode?.category === selectedCategory || toNode?.category === selectedCategory);
  });

  const renderNode = (node: FlowNode, index: number) => (
    <Animated.View
      key={node.id}
      entering={FadeInUp.delay(index * 50).duration(400)}
      style={[
        styles.flowNode,
        {
          backgroundColor: node.color || colors.primary[500],
          left: node.position.x * zoomLevel,
          top: node.position.y * zoomLevel,
          transform: [{ scale: zoomLevel }]
        },
        node.type === 'start' && styles.startNode,
        node.type === 'screen' && styles.screenNode,
        node.type === 'feature' && styles.featureNode,
        node.type === 'action' && styles.actionNode
      ]}
    >
      <View style={styles.nodeIcon}>
        {node.icon}
      </View>
      <View style={styles.nodeContent}>
        <Text style={styles.nodeTitle} numberOfLines={2}>
          {node.title}
        </Text>
        {node.description && (
          <Text style={styles.nodeDescription} numberOfLines={3}>
            {node.description}
          </Text>
        )}
      </View>
      {node.type === 'start' && (
        <View style={styles.startIndicator}>
          <Sparkles size={16} color="white" />
        </View>
      )}
    </Animated.View>
  );

  const renderConnection = (connection: FlowConnection, index: number) => {
    const fromNode = flowNodes.find(n => n.id === connection.from);
    const toNode = flowNodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return null;

    const startX = (fromNode.position.x + 100) * zoomLevel;
    const startY = (fromNode.position.y + 40) * zoomLevel;
    const endX = toNode.position.x * zoomLevel;
    const endY = (toNode.position.y + 40) * zoomLevel;

    return (
      <Animated.View
        key={`${connection.from}-${connection.to}`}
        entering={FadeInRight.delay(index * 30).duration(300)}
        style={[
          styles.connection,
          {
            left: startX,
            top: startY,
            width: Math.abs(endX - startX),
            height: 2,
            transform: [
              { 
                rotate: `${Math.atan2(endY - startY, endX - startX)}rad` 
              }
            ]
          }
        ]}
      >
        {connection.label && (
          <Text style={styles.connectionLabel}>
            {connection.label}
          </Text>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.duration(400)}
          style={styles.header}
        >
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Bolt Learning App
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Comprehensive User Flow Diagram
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.zoomButton, { backgroundColor: colors.neutral[100] }]}
              onPress={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
            >
              <Text style={[styles.zoomText, { color: colors.text }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.zoomLevel, { color: colors.text }]}>
              {Math.round(zoomLevel * 100)}%
            </Text>
            <TouchableOpacity 
              style={[styles.zoomButton, { backgroundColor: colors.neutral[100] }]}
              onPress={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
            >
              <Text style={[styles.zoomText, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.categoryContainer}
        >
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
                  selectedCategory === category.id && { 
                    backgroundColor: category.color + '20',
                    borderColor: category.color 
                  }
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                <View 
                  style={[
                    styles.categoryDot, 
                    { backgroundColor: category.color }
                  ]} 
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: colors.neutral[600] },
                    selectedCategory === category.id && { 
                      color: category.color, 
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

        {/* Flow Diagram */}
        <ScrollView 
          style={styles.diagramContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          minimumZoomScale={0.5}
          maximumZoomScale={2}
          zoomScale={zoomLevel}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.diagramContent,
              {
                width: 1600 * zoomLevel,
                height: 1000 * zoomLevel
              }
            ]}
          >
            {/* Render connections first (behind nodes) */}
            {filteredConnections.map((connection, index) => 
              renderConnection(connection, index)
            )}
            
            {/* Render nodes */}
            {filteredNodes.map((node, index) => renderNode(node, index))}
          </ScrollView>
        </ScrollView>

        {/* Legend */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(400)}
          style={[styles.legend, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.legendTitle, { color: colors.text }]}>Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Start Point</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Screen</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Feature</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Action</Text>
            </View>
          </View>
        </Animated.View>

        {/* Feature Summary */}
        <Animated.View 
          entering={FadeInUp.delay(300).duration(400)}
          style={[styles.summary, { backgroundColor: colors.neutral[50] }]}
        >
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Key Features Overview
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Brain size={20} color={colors.primary[500]} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                AI-Powered Assistant
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Target size={20} color={colors.success[500]} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                Goal Setting & Tracking
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <BookOpen size={20} color={colors.primary[500]} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                Multi-Category Learning
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Users size={20} color={colors.success[500]} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                1-on-1 Coaching
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Award size={20} color={colors.warning[500]} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                Digital Credentials
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <BarChart3 size={20} color={colors.primary[500]} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                Progress Analytics
              </Text>
            </View>
          </View>
        </Animated.View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    fontSize: 18,
    fontWeight: '600',
  },
  zoomLevel: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
  },
  categoryContainer: {
    paddingVertical: 12,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  diagramContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  diagramContent: {
    position: 'relative',
    padding: 20,
  },
  flowNode: {
    position: 'absolute',
    width: 180,
    minHeight: 80,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  startNode: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  screenNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  featureNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  actionNode: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  nodeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nodeContent: {
    flex: 1,
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  nodeDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 14,
  },
  startIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connection: {
    position: 'absolute',
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
  connectionLabel: {
    position: 'absolute',
    top: -20,
    left: '50%',
    fontSize: 10,
    color: '#64748B',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    transform: [{ translateX: -50 }],
  },
  legend: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  summary: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  summaryText: {
    fontSize: 12,
    marginLeft: 8,
  },
});