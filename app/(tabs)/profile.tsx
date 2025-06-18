import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Switch
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Settings, 
  Award, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  ChartBar as BarChart,
  User,
  Bell,
  Lock,
  CreditCard,
  CircleHelp as HelpCircle,
  FileText,
  LogOut,
  Moon,
  Github,
  Linkedin,
  Link,
  Shield,
  Sync
} from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { achievements, recentActivities, learningPaths } from '@/data/mockData';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
}

function SettingItem({ icon, title, subtitle, onPress, rightElement }: SettingItemProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  return (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.divider }]} 
      onPress={onPress}
    >
      <View style={[styles.settingIconContainer, { backgroundColor: colors.primary[50] }]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {rightElement || <ChevronRight size={20} color={colors.neutral[400]} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [notifications, setNotifications] = useState(true);

  // Mock integration status
  const [integrationStatus, setIntegrationStatus] = useState({
    github: { connected: true, lastSync: '2025-01-15T10:30:00Z' },
    linkedin: { connected: true, lastSync: '2025-01-15T09:15:00Z' },
  });

  const handleProfileIntegration = () => {
    router.push('/profile-integration');
  };

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        </Animated.View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Card */}
          <Animated.View entering={FadeInUp.delay(100).duration(500)} style={[styles.profileCard, { backgroundColor: colors.background }]}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.avatar}
            />
            
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text }]}>Alex Johnson</Text>
              <Text style={[styles.email, { color: colors.textSecondary }]}>alex.johnson@example.com</Text>
              <View style={[styles.membershipBadge, { backgroundColor: colors.secondary[100] }]}>
                <Text style={[styles.membershipText, { color: colors.secondary[700] }]}>Premium Member</Text>
              </View>
            </View>
            
            <Button
              title="Edit Profile"
              variant="outline"
              size="small"
              onPress={() => {}}
              style={styles.editButton}
            />
          </Animated.View>

          {/* Profile Integration Status */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.integrationSection}>
            <View style={styles.integrationHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Integration</Text>
              <TouchableOpacity onPress={handleProfileIntegration}>
                <Text style={[styles.manageText, { color: colors.primary[500] }]}>Manage</Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.integrationCard, { backgroundColor: colors.background }]}>
              <View style={styles.integrationPlatforms}>
                <View style={styles.platformStatus}>
                  <View style={[styles.platformIcon, { backgroundColor: '#24292e' }]}>
                    <Github size={20} color="white" />
                  </View>
                  <View style={styles.platformInfo}>
                    <Text style={[styles.platformName, { color: colors.text }]}>GitHub</Text>
                    <Text style={[styles.platformStatus, { color: integrationStatus.github.connected ? colors.success[500] : colors.error[500] }]}>
                      {integrationStatus.github.connected ? 'Connected' : 'Not connected'}
                    </Text>
                    {integrationStatus.github.connected && (
                      <Text style={[styles.lastSyncText, { color: colors.neutral[500] }]}>
                        Last sync: {formatLastSync(integrationStatus.github.lastSync)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.platformActions}>
                    <TouchableOpacity style={[styles.syncButton, { backgroundColor: colors.primary[50] }]}>
                      <Sync size={16} color={colors.primary[500]} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.platformStatus}>
                  <View style={[styles.platformIcon, { backgroundColor: '#0077b5' }]}>
                    <Linkedin size={20} color="white" />
                  </View>
                  <View style={styles.platformInfo}>
                    <Text style={[styles.platformName, { color: colors.text }]}>LinkedIn</Text>
                    <Text style={[styles.platformStatus, { color: integrationStatus.linkedin.connected ? colors.success[500] : colors.error[500] }]}>
                      {integrationStatus.linkedin.connected ? 'Connected' : 'Not connected'}
                    </Text>
                    {integrationStatus.linkedin.connected && (
                      <Text style={[styles.lastSyncText, { color: colors.neutral[500] }]}>
                        Last sync: {formatLastSync(integrationStatus.linkedin.lastSync)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.platformActions}>
                    <TouchableOpacity style={[styles.syncButton, { backgroundColor: colors.primary[50] }]}>
                      <Sync size={16} color={colors.primary[500]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.integrationCTA, { backgroundColor: colors.primary[50] }]}
                onPress={handleProfileIntegration}
              >
                <View style={styles.integrationCTAContent}>
                  <View style={[styles.integrationCTAIcon, { backgroundColor: colors.primary[500] }]}>
                    <Link size={20} color="white" />
                  </View>
                  <View style={styles.integrationCTAText}>
                    <Text style={[styles.integrationCTATitle, { color: colors.primary[700] }]}>
                      Enhance Your Profile
                    </Text>
                    <Text style={[styles.integrationCTADescription, { color: colors.primary[600] }]}>
                      Connect more platforms to showcase your complete professional journey
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.primary[500]} />
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          {/* Stats Section */}
          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={[styles.statsContainer, { backgroundColor: colors.background }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>7</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Courses</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.neutral[200] }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>42</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Hours</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.neutral[200] }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Certificates</Text>
            </View>
          </Animated.View>
          
          {/* Learning Progress */}
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Learning Paths</Text>
              <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: colors.primary[500] }]}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {learningPaths.map((path, index) => (
              <Animated.View
                key={path.id}
                entering={FadeInRight.delay(500 + index * 100).duration(500)}
                style={[styles.learningPathCard, { backgroundColor: colors.background }]}
              >
                <View style={styles.pathInfo}>
                  <Text style={[styles.pathTitle, { color: colors.text }]}>{path.title}</Text>
                  <Text style={[styles.pathDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {path.description}
                  </Text>
                  <View style={styles.pathMetaData}>
                    <BookOpen size={14} color={colors.neutral[500]} />
                    <Text style={[styles.pathMetaText, { color: colors.neutral[600] }]}>{path.courses.length} courses</Text>
                    <Clock size={14} color={colors.neutral[500]} style={{ marginLeft: 12 }} />
                    <Text style={[styles.pathMetaText, { color: colors.neutral[600] }]}>
                      {path.courses.reduce((total, course) => total + course.duration, 0) / 60} hours
                    </Text>
                  </View>
                </View>
                
                <View style={styles.pathProgress}>
                  <View style={[styles.progressBar, { backgroundColor: colors.neutral[200] }]}>
                    <View style={[styles.progressFill, { backgroundColor: colors.primary[500], width: `${path.progress}%` }]} />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>{path.progress}%</Text>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
          
          {/* Achievements */}
          <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
              <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: colors.primary[500] }]}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.achievementsContainer}>
              {achievements.map((achievement, index) => (
                <Animated.View
                  key={achievement.id}
                  entering={FadeInUp.delay(700 + index * 100).duration(500)}
                  style={[styles.achievementCard, { backgroundColor: colors.background }]}
                >
                  <View style={[
                    styles.achievementIconContainer,
                    { backgroundColor: achievement.completed ? colors.success[500] : colors.neutral[200] }
                  ]}>
                    <Award
                      size={24}
                      color={achievement.completed ? 'white' : colors.neutral[400]}
                    />
                  </View>
                  <Text style={[styles.achievementTitle, { color: colors.text }]}>{achievement.title}</Text>
                  <View style={[styles.achievementProgressBar, { backgroundColor: colors.neutral[200] }]}>
                    <View 
                      style={[
                        styles.achievementProgressFill, 
                        { backgroundColor: colors.success[500], width: `${achievement.progress}%` }
                      ]} 
                    />
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
          
          {/* Recent Activity */}
          <Animated.View entering={FadeInUp.delay(800).duration(500)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            </View>
            
            {recentActivities.map((activity, index) => (
              <Animated.View
                key={activity.id}
                entering={FadeInRight.delay(900 + index * 100).duration(500)}
                style={[styles.activityItem, { borderBottomColor: colors.neutral[100] }]}
              >
                <View 
                  style={[
                    styles.activityIconContainer,
                    activity.type === 'course_progress' && { backgroundColor: colors.primary[500] },
                    activity.type === 'achievement' && { backgroundColor: colors.warning[500] },
                    activity.type === 'coaching' && { backgroundColor: colors.accent[500] }
                  ]}
                >
                  {activity.type === 'course_progress' && <BookOpen size={16} color="white" />}
                  {activity.type === 'achievement' && <Award size={16} color="white" />}
                  {activity.type === 'coaching' && <Clock size={16} color="white" />}
                </View>
                
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                  <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>{activity.description}</Text>
                  <Text style={[styles.activityTime, { color: colors.neutral[500] }]}>{activity.time}</Text>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
          
          {/* Analytics Section */}
          <Animated.View entering={FadeInUp.delay(1000).duration(500)}>
            <TouchableOpacity style={[styles.analyticsCard, { backgroundColor: colors.neutral[50] }]}>
              <View style={styles.analyticsHeader}>
                <BarChart size={20} color={colors.primary[500]} />
                <Text style={[styles.analyticsTitle, { color: colors.text }]}>Learning Analytics</Text>
              </View>
              <Text style={[styles.analyticsDescription, { color: colors.textSecondary }]}>
                Track your progress and get insights into your learning habits
              </Text>
              <View style={styles.analyticsAction}>
                <Text style={[styles.analyticsActionText, { color: colors.primary[500] }]}>View Analytics</Text>
                <ChevronRight size={16} color={colors.primary[500]} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Settings Section */}
          <Animated.View entering={FadeInUp.delay(1100).duration(500)} style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Settings</Text>

            <SettingItem
              icon={<User size={22} color={colors.primary[500]} />}
              title="Profile Information"
              subtitle="Edit your personal details"
              onPress={() => {}}
            />

            <SettingItem
              icon={<Bell size={22} color={colors.primary[500]} />}
              title="Notifications"
              subtitle={notifications ? "On" : "Off"}
              onPress={() => {}}
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: colors.neutral[200], true: colors.primary[200] }}
                  thumbColor={notifications ? colors.primary[500] : colors.neutral[400]}
                />
              }
            />

            <SettingItem
              icon={<Lock size={22} color={colors.primary[500]} />}
              title="Password & Security"
              subtitle="Update your password and security settings"
              onPress={() => {}}
            />

            <SettingItem
              icon={<CreditCard size={22} color={colors.primary[500]} />}
              title="Subscription"
              subtitle="Premium Plan - $9.99/month"
              onPress={() => {}}
            />
          </Animated.View>

          {/* Preferences Section */}
          <Animated.View entering={FadeInUp.delay(1200).duration(500)} style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>

            <SettingItem
              icon={<Moon size={22} color={colors.primary[500]} />}
              title="Dark Mode"
              subtitle={isDarkMode ? "On" : "Off"}
              onPress={() => {}}
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.neutral[200], true: colors.primary[200] }}
                  thumbColor={isDarkMode ? colors.primary[500] : colors.neutral[400]}
                />
              }
            />
          </Animated.View>

          {/* Support Section */}
          <Animated.View entering={FadeInUp.delay(1300).duration(500)} style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>

            <SettingItem
              icon={<HelpCircle size={22} color={colors.primary[500]} />}
              title="Help Center"
              subtitle="Get help with your account"
              onPress={() => {}}
            />

            <SettingItem
              icon={<FileText size={22} color={colors.primary[500]} />}
              title="Terms of Service"
              onPress={() => {}}
            />

            <SettingItem
              icon={<FileText size={22} color={colors.primary[500]} />}
              title="Privacy Policy"
              onPress={() => {}}
            />
          </Animated.View>

          {/* Logout Button */}
          <Animated.View entering={FadeInUp.delay(1400).duration(500)}>
            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: colors.error[50] }]} 
              onPress={() => {}}
            >
              <LogOut size={22} color={colors.error[500]} />
              <Text style={[styles.logoutText, { color: colors.error[600] }]}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Version Info */}
          <Animated.View entering={FadeInUp.delay(1500).duration(500)} style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: colors.neutral[500] }]}>Version 1.0.0</Text>
          </Animated.View>
          
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 8,
  },
  membershipBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  editButton: {
    marginLeft: 8,
  },
  integrationSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  manageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  integrationCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  integrationPlatforms: {
    marginBottom: 16,
  },
  platformStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  lastSyncText: {
    fontSize: 12,
  },
  platformActions: {
    marginLeft: 8,
  },
  syncButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  integrationCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  integrationCTAContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  integrationCTAIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  integrationCTAText: {
    flex: 1,
  },
  integrationCTATitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  integrationCTADescription: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  learningPathCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pathInfo: {
    marginBottom: 12,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  pathDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  pathMetaData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  pathProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '30%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementProgressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
  },
  analyticsCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  analyticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  analyticsDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  analyticsAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyticsActionText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
  },
  boltBadgeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  boltBadgeText: {
    fontSize: 12,
  },
});