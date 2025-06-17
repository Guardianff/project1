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
  Clock
} from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface Notification {
  id: string;
  type: 'course' | 'progress' | 'challenge' | 'milestone' | 'announcement';
  category: 'coding' | 'fitness' | 'language' | 'general';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'milestone',
    category: 'language',
    title: 'Spanish Milestone Achieved!',
    message: 'Congratulations! You\'ve completed 50 Spanish lessons and earned the "Conversationalist" badge.',
    timestamp: '2025-01-15T10:30:00Z',
    isRead: false,
    actionUrl: '/achievements'
  },
  {
    id: '2',
    type: 'challenge',
    category: 'fitness',
    title: 'Daily Workout Reminder',
    message: 'Time for your 30-minute HIIT workout! Keep your streak going - you\'re on day 12.',
    timestamp: '2025-01-15T08:00:00Z',
    isRead: false,
    actionUrl: '/fitness/workout'
  },
  {
    id: '3',
    type: 'course',
    category: 'coding',
    title: 'New Course Available',
    message: 'Advanced React Native Development is now available. Perfect for your current skill level!',
    timestamp: '2025-01-14T16:45:00Z',
    isRead: true,
    actionUrl: '/courses/react-native-advanced'
  },
  {
    id: '4',
    type: 'progress',
    category: 'coding',
    title: 'Weekly Progress Update',
    message: 'Great week! You completed 3 coding challenges and improved your JavaScript skills by 15%.',
    timestamp: '2025-01-14T12:00:00Z',
    isRead: true,
    actionUrl: '/progress'
  },
  {
    id: '5',
    type: 'announcement',
    category: 'general',
    title: 'New Feature: AI Study Buddy',
    message: 'Meet your new AI-powered study companion! Get personalized learning recommendations and instant help.',
    timestamp: '2025-01-13T14:20:00Z',
    isRead: false,
    actionUrl: '/features/ai-buddy'
  },
  {
    id: '6',
    type: 'challenge',
    category: 'language',
    title: 'French Speaking Challenge',
    message: 'Join this week\'s pronunciation challenge! Practice with native speakers and win exclusive badges.',
    timestamp: '2025-01-13T09:15:00Z',
    isRead: true,
    actionUrl: '/challenges/french-speaking'
  },
  {
    id: '7',
    type: 'milestone',
    category: 'fitness',
    title: 'Strength Training Milestone',
    message: 'You\'ve increased your bench press by 20lbs this month! Your dedication is paying off.',
    timestamp: '2025-01-12T18:30:00Z',
    isRead: true,
    actionUrl: '/fitness/progress'
  },
  {
    id: '8',
    type: 'course',
    category: 'language',
    title: 'Mandarin Course Recommendation',
    message: 'Based on your learning style, we recommend "Business Mandarin for Professionals".',
    timestamp: '2025-01-12T11:00:00Z',
    isRead: true,
    actionUrl: '/courses/business-mandarin'
  }
];

const notificationCategories = [
  { id: 'all', name: 'All', count: 8 },
  { id: 'coding', name: 'Coding', count: 2 },
  { id: 'fitness', name: 'Fitness', count: 2 },
  { id: 'language', name: 'Language', count: 3 },
  { id: 'general', name: 'General', count: 1 }
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

  const getNotificationIcon = (type: string, category: string) => {
    const iconProps = { size: 24, color: colors.primary[500] };
    
    if (category === 'coding') return <Code {...iconProps} />;
    if (category === 'fitness') return <Dumbbell {...iconProps} />;
    if (category === 'language') return <Globe {...iconProps} />;
    
    switch (type) {
      case 'milestone':
        return <Trophy {...iconProps} color={colors.warning[500]} />;
      case 'challenge':
        return <Target {...iconProps} color={colors.accent[500]} />;
      case 'course':
        return <BookOpen {...iconProps} color={colors.primary[500]} />;
      case 'announcement':
        return <Megaphone {...iconProps} color={colors.secondary[500]} />;
      default:
        return <Bell {...iconProps} />;
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
      // In a real app, navigate to the specific URL
      console.log('Navigate to:', notification.actionUrl);
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
          entering={FadeInUp.delay(100).duration(400)}
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
              entering={FadeInUp.delay(200).duration(400)}
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
                entering={FadeInRight.delay(index * 50).duration(400)}
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
                        {!notification.isRead && (
                          <View style={[styles.unreadDot, { backgroundColor: colors.primary[500] }]} />
                        )}
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
                      
                      <View style={styles.notificationMeta}>
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
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
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