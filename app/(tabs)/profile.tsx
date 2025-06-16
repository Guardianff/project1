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
  Moon
} from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { achievements, recentActivities, learningPaths } from '@/data/mockData';

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
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        </View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: colors.background }]}>
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
          </View>
          
          {/* Stats Section */}
          <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
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
          </View>
          
          {/* Learning Progress */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Learning Paths</Text>
              <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: colors.primary[500] }]}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {learningPaths.map((path) => (
              <TouchableOpacity key={path.id} style={[styles.learningPathCard, { backgroundColor: colors.background }]}>
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
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Achievements */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
              <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: colors.primary[500] }]}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.achievementsContainer}>
              {achievements.map((achievement) => (
                <TouchableOpacity key={achievement.id} style={[styles.achievementCard, { backgroundColor: colors.background }]}>
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
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Recent Activity */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            </View>
            
            {recentActivities.map((activity) => (
              <View key={activity.id} style={[styles.activityItem, { borderBottomColor: colors.neutral[100] }]}>
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
              </View>
            ))}
          </View>
          
          {/* Analytics Section */}
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

          {/* Settings Section */}
          <View style={styles.sectionContainer}>
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
          </View>

          {/* Preferences Section */}
          <View style={styles.sectionContainer}>
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
          </View>

          {/* Support Section */}
          <View style={styles.sectionContainer}>
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
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.error[50] }]} 
            onPress={() => {}}
          >
            <LogOut size={22} color={colors.error[500]} />
            <Text style={[styles.logoutText, { color: colors.error[600] }]}>Log Out</Text>
          </TouchableOpacity>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: colors.neutral[500] }]}>Version 1.0.0</Text>
          </View>
          
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