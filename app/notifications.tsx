import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Switch,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Bell, 
  BellOff,
  Code, 
  Dumbbell, 
  Globe, 
  Trophy, 
  BookOpen, 
  Target,
  Megaphone,
  CheckCheck,
  Settings,
  Filter,
  Clock,
  Sparkles,
  Calendar,
  Users,
  MessageCircle
} from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface Notification {
  id: string;
  type: 'course' | 'progress' | 'challenge' | 'milestone' | 'announcement' | 'ai' | 'coaching' | 'resource';
  category: 'courses' | 'coaching' | 'resources' | 'ai' | 'general';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'ai',
    category: 'ai',
    title: 'AI Insight: Perfect Learning Time',
    message: 'Based on your activity, now is your optimal learning window. Ready to tackle that React Native lesson?',
    timestamp: '2025-01-15T10:30:00Z',
    isRead: false,
    priority: 'high',
    actionUrl: '/courses/react-native'
  },
  {
    id: '2',
    type: 'coaching',
    category: 'coaching',
    title: 'Coaching Session Reminder',
    message: 'Your career strategy session with Robert Williams starts in 30 minutes.',
    timestamp: '2025-01-15T09:30:00Z',
    isRead: false,
    priority: 'high',
    actionUrl: '/coaching/session/1'
  },
  {
    id: '3',
    type: 'milestone',
    category: 'courses',
    title: 'Congratulations! Course Completed',
    message: 'You\'ve successfully completed "UI/UX Design Fundamentals" and earned your certificate!',
    timestamp: '2025-01-14T16:45:00Z',
    isRead: true,
    priority: 'medium',
    actionUrl: '/achievements'
  },
  {
    id: '4',
    type: 'challenge',
    category: 'general',
    title: 'Weekly Challenge: 7-Day Streak',
    message: 'You\'re on day 6 of your learning streak! Complete one more lesson to earn the Consistency Champion badge.',
    timestamp: '2025-01-14T12:00:00Z',
    isRead: true,
    priority: 'medium',
    actionUrl: '/challenges'
  },
  {
    id: '5',
    type: 'resource',
    category: 'resources',
    title: 'New Resource Available',
    message: 'Advanced React Native Development Kit has been added to your resources library.',
    timestamp: '2025-01-13T14:20:00Z',
    isRead: false,
    priority: 'low',
    actionUrl: '/resources'
  },
  {
    id: '6',
    type: 'announcement',
    category: 'general',
    title: 'Platform Update: Enhanced AI Features',
    message: 'We\'ve upgraded our AI assistant with better personalization and goal tracking capabilities.',
    timestamp: '2025-01-13T09:15:00Z',
    isRead: true,
    priority: 'low',
    actionUrl: '/ai-assistant'
  }
];

const notificationCategories = [
  { id: 'all', name: 'All', count: 6, icon: <Bell size={16} color="#6B7280" /> },
  { id: 'courses', name: 'Courses', count: 1, icon: <BookOpen size={16} color="#3B82F6" /> },
  { id: 'coaching', name: 'Coaching', count: 1, icon: <Calendar size={16} color="#8B5CF6" /> },
  { id: 'resources', name: 'Resources', count: 1, icon: <Target size={16} color="#10B981" /> },
  { id: 'ai', name: 'AI Messages', count: 1, icon: <Sparkles size={16} color="#F59E0B" /> },
  { id: 'general', name: 'General', count: 2, icon: <Megaphone size={16} color="#EF4444" /> }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Filter notifications based on selected category
  const filteredNotifications = notifications.filter(notification => 
    selectedCategory === 'all' || notification.category === selectedCategory
  );

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // AI-generated summary
  const aiSummary = "You have 3 high-priority items: an upcoming coaching session, an AI learning recommendation, and a new resource. Your learning streak is at 6 days - one more to unlock a badge!";

  const getNotificationIcon = (type: string, category: string) => {
    const iconProps = { size: 24, color: colors.primary[500] };
    
    switch (type) {
      case 'ai':
        return <Sparkles {...iconProps} color={colors.warning[500]} />;
      case 'coaching':
        return <Calendar {...iconProps} color={colors.accent[500]} />;
      case 'milestone':
        return <Trophy {...iconProps} color={colors.success[500]} />;
      case 'challenge':
        return <Target {...iconProps} color={colors.primary[500]} />;
      case 'course':
        return <BookOpen {...iconProps} color={colors.primary[500]} />;
      case 'resource':
        return <Target {...iconProps} color={colors.success[500]} />;
      case 'announcement':
        return <Megaphone {...iconProps} color={colors.secondary[500]} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error[500];
      case 'medium':
        return colors.warning[500];
      case 'low':
      default:
        return colors.neutral[400];
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      console.log('Navigate to:', notification.actionUrl);
      router.back();
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      Alert.alert(
        'Notifications Enabled',
        'You\'ll now receive learning updates and reminders.',
        [{ text: 'OK' }]
      );
    }
  };

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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.error[500] }]}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Settings size={24} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>

        {/* AI Summary */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(400)}
          style={[styles.aiSummaryCard, { backgroundColor: colors.primary[50] }]}
        >
          <View style={styles.aiSummaryHeader}>
            <View style={[styles.aiSummaryIcon, { backgroundColor: colors.primary[500] }]}>
              <Sparkles size={20} color="white" />
            </View>
            <Text style={[styles.aiSummaryTitle, { color: colors.primary[700] }]}>
              AI Summary
            </Text>
          </View>
          <Text style={[styles.aiSummaryText, { color: colors.primary[600] }]}>
            {aiSummary}
          </Text>
        </Animated.View>

        {/* Settings Panel */}
        {showSettings && (
          <Animated.View 
            entering={FadeInUp.duration(300)}
            style={[styles.settingsPanel, { backgroundColor: colors.neutral[50] }]}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive learning reminders and updates
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: colors.neutral[200], true: colors.primary[200] }}
                thumbColor={notificationsEnabled ? colors.primary[500] : colors.neutral[400]}
              />
            </View>
            
            {unreadCount > 0 && (
              <Button
                title="Mark All as Read"
                variant="outline"
                size="small"
                icon={<CheckCheck size={16} color={colors.primary[500]} />}
                iconPosition="left"
                onPress={markAllAsRead}
                style={styles.markAllButton}
              />
            )}
          </Animated.View>
        )}

        {/* Category Filter */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.categoryContainer}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {notificationCategories.map((category) => (
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
                {category.icon}
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
                <View style={[
                  styles.categoryCount,
                  { backgroundColor: colors.neutral[200] },
                  selectedCategory === category.id && { backgroundColor: colors.primary[200] }
                ]}>
                  <Text style={[
                    styles.categoryCountText,
                    { color: colors.neutral[600] },
                    selectedCategory === category.id && { color: colors.primary[700] }
                  ]}>
                    {category.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Notifications List */}
        <ScrollView 
          style={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.notificationsContent}
        >
          {filteredNotifications.length === 0 ? (
            <Animated.View 
              entering={FadeInUp.delay(300).duration(400)}
              style={styles.emptyState}
            >
              <BellOff size={48} color={colors.neutral[400]} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No notifications
              </Text>
              <Text style={[styles.emptyStateMessage, { color: colors.textSecondary }]}>
                You're all caught up! Check back later for updates.
              </Text>
            </Animated.View>
          ) : (
            filteredNotifications.map((notification, index) => (
              <Animated.View
                key={notification.id}
                entering={FadeInRight.delay(300 + index * 50).duration(400)}
              >
                <TouchableOpacity
                  style={[
                    styles.notificationCard,
                    { backgroundColor: colors.background },
                    !notification.isRead && { 
                      backgroundColor: colors.primary[25],
                      borderLeftColor: colors.primary[500],
                      borderLeftWidth: 4
                    }
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.8}
                >
                  <View style={styles.notificationHeader}>
                    <View style={[
                      styles.notificationIcon,
                      { backgroundColor: colors.neutral[50] }
                    ]}>
                      {getNotificationIcon(notification.type, notification.category)}
                    </View>
                    
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationTitleRow}>
                        <Text 
                          style={[
                            styles.notificationTitle, 
                            { color: colors.text },
                            !notification.isRead && { fontWeight: '700' }
                          ]}
                          numberOfLines={1}
                        >
                          {notification.title}
                        </Text>
                        <View style={styles.notificationMeta}>
                          <View style={[
                            styles.priorityDot, 
                            { backgroundColor: getPriorityColor(notification.priority) }
                          ]} />
                          {!notification.isRead && (
                            <View style={[styles.unreadDot, { backgroundColor: colors.primary[500] }]} />
                          )}
                        </View>
                      </View>
                      
                      <Text 
                        style={[
                          styles.notificationMessage, 
                          { color: colors.textSecondary }
                        ]}
                        numberOfLines={2}
                      >
                        {notification.message}
                      </Text>
                      
                      <View style={styles.notificationFooter}>
                        <Clock size={12} color={colors.neutral[400]} />
                        <Text style={[styles.notificationTime, { color: colors.neutral[500] }]}>
                          {formatTimestamp(notification.timestamp)}
                        </Text>
                        <View style={[
                          styles.categoryBadge,
                          { backgroundColor: colors.neutral[100] }
                        ]}>
                          <Text style={[styles.categoryBadgeText, { color: colors.neutral[600] }]}>
                            {notification.category}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  aiSummaryCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
  },
  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiSummaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  aiSummaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingsPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  markAllButton: {
    alignSelf: 'flex-start',
  },
  categoryContainer: {
    paddingVertical: 12,
  },
  categoryList: {
    paddingHorizontal: 16,
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
  categoryChipText: {
    fontSize: 14,
    marginLeft: 6,
    marginRight: 6,
  },
  categoryCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  categoryCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    maxWidth: 280,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  bottomSpacing: {
    height: 80,
  },
});