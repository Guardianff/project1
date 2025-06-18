import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  Switch,
  Modal,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Github, Linkedin, Shield, RefreshCw, Settings, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, Users, Star, GitBranch, Code, Briefcase, GraduationCap, Award, Calendar, Globe, Lock, Clock as Unlock, Download, Upload, Eye, EyeOff, Zap, TrendingUp, Activity, Database, Key, FileText, ChartBar as BarChart3, FolderSync as Sync, X, ChevronRight, Info, ExternalLink } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Animated, { FadeInUp, FadeInRight, SlideInRight } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

interface PlatformConnection {
  id: 'github' | 'linkedin';
  name: string;
  icon: React.ReactNode;
  color: string;
  connected: boolean;
  lastSync: string | null;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  data?: any;
  permissions: string[];
}

interface SyncSettings {
  autoSync: boolean;
  syncFrequency: 'daily' | 'weekly' | 'manual';
  selectedFields: {
    github: string[];
    linkedin: string[];
  };
  conflictResolution: 'manual' | 'github_priority' | 'linkedin_priority' | 'newest';
}

interface DataField {
  id: string;
  name: string;
  description: string;
  platform: 'github' | 'linkedin' | 'both';
  type: 'text' | 'number' | 'array' | 'object';
  enabled: boolean;
  lastUpdated?: string;
  source?: 'github' | 'linkedin';
  hasConflict?: boolean;
}

interface SyncActivity {
  id: string;
  timestamp: string;
  type: 'sync' | 'conflict_resolution' | 'auth' | 'error';
  platform: 'github' | 'linkedin' | 'both';
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export default function ProfileIntegrationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  // State management
  const [connections, setConnections] = useState<PlatformConnection[]>([
    {
      id: 'github',
      name: 'GitHub',
      icon: <Github size={24} color="white" />,
      color: '#24292e',
      connected: false,
      lastSync: null,
      status: 'disconnected',
      permissions: ['read:user', 'read:repos', 'read:org'],
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin size={24} color="white" />,
      color: '#0077b5',
      connected: false,
      lastSync: null,
      status: 'disconnected',
      permissions: ['r_liteprofile', 'r_emailaddress', 'r_fullprofile'],
    },
  ]);

  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    autoSync: true,
    syncFrequency: 'daily',
    selectedFields: {
      github: ['profile', 'repositories', 'contributions', 'languages'],
      linkedin: ['profile', 'experience', 'education', 'skills'],
    },
    conflictResolution: 'manual',
  });

  const [dataFields, setDataFields] = useState<DataField[]>([
    // GitHub fields
    { id: 'gh_profile', name: 'Profile Information', description: 'Basic profile data', platform: 'github', type: 'object', enabled: true },
    { id: 'gh_repos', name: 'Repository Metrics', description: 'Stars, forks, commits', platform: 'github', type: 'array', enabled: true },
    { id: 'gh_contributions', name: 'Contribution Activity', description: 'Commit history and activity', platform: 'github', type: 'object', enabled: true },
    { id: 'gh_languages', name: 'Programming Languages', description: 'Language proficiency data', platform: 'github', type: 'array', enabled: true },
    
    // LinkedIn fields
    { id: 'li_profile', name: 'Professional Profile', description: 'Basic professional information', platform: 'linkedin', type: 'object', enabled: true },
    { id: 'li_experience', name: 'Work Experience', description: 'Employment history', platform: 'linkedin', type: 'array', enabled: true },
    { id: 'li_education', name: 'Education Background', description: 'Educational qualifications', platform: 'linkedin', type: 'array', enabled: true },
    { id: 'li_skills', name: 'Skills & Endorsements', description: 'Professional skills', platform: 'linkedin', type: 'array', enabled: true },
    { id: 'li_certifications', name: 'Certifications', description: 'Professional certifications', platform: 'linkedin', type: 'array', enabled: true },
  ]);

  const [syncActivities, setSyncActivities] = useState<SyncActivity[]>([
    {
      id: '1',
      timestamp: '2025-01-15T10:30:00Z',
      type: 'sync',
      platform: 'github',
      status: 'success',
      message: 'Successfully synced GitHub profile data',
    },
    {
      id: '2',
      timestamp: '2025-01-15T09:15:00Z',
      type: 'auth',
      platform: 'linkedin',
      status: 'success',
      message: 'LinkedIn authentication completed',
    },
    {
      id: '3',
      timestamp: '2025-01-14T16:45:00Z',
      type: 'conflict_resolution',
      platform: 'both',
      status: 'warning',
      message: 'Manual conflict resolution required for job title',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'conflicts' | 'activity'>('dashboard');
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Mock data for demonstration
  const mockGitHubData = {
    profile: {
      name: 'Alex Johnson',
      bio: 'Full-stack developer passionate about React Native and AI',
      location: 'San Francisco, CA',
      company: 'TechCorp',
      followers: 245,
      following: 180,
    },
    repositories: [
      { name: 'react-native-app', stars: 156, forks: 23, language: 'TypeScript' },
      { name: 'ai-chatbot', stars: 89, forks: 12, language: 'Python' },
      { name: 'portfolio-website', stars: 34, forks: 8, language: 'JavaScript' },
    ],
    contributions: {
      totalCommits: 1247,
      currentStreak: 15,
      longestStreak: 42,
    },
    languages: ['TypeScript', 'Python', 'JavaScript', 'Swift', 'Kotlin'],
  };

  const mockLinkedInData = {
    profile: {
      name: 'Alex Johnson',
      headline: 'Senior Full-Stack Developer | React Native Expert',
      location: 'San Francisco Bay Area',
      connections: 500,
    },
    experience: [
      {
        title: 'Senior Full-Stack Developer',
        company: 'TechCorp',
        duration: '2022 - Present',
        description: 'Leading mobile app development using React Native',
      },
      {
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        duration: '2020 - 2022',
        description: 'Built responsive web applications with React',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'Stanford University',
        year: '2020',
      },
    ],
    skills: ['React Native', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  };

  // Handlers
  const handleConnect = async (platformId: 'github' | 'linkedin') => {
    try {
      setConnections(prev => prev.map(conn => 
        conn.id === platformId 
          ? { ...conn, status: 'syncing' }
          : conn
      ));

      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));

      setConnections(prev => prev.map(conn => 
        conn.id === platformId 
          ? { 
              ...conn, 
              connected: true, 
              status: 'connected',
              lastSync: new Date().toISOString(),
              data: platformId === 'github' ? mockGitHubData : mockLinkedInData,
            }
          : conn
      ));

      addSyncActivity({
        type: 'auth',
        platform: platformId,
        status: 'success',
        message: `${platformId === 'github' ? 'GitHub' : 'LinkedIn'} authentication completed`,
      });

      Alert.alert('Success', `Successfully connected to ${platformId === 'github' ? 'GitHub' : 'LinkedIn'}!`);
    } catch (error) {
      setConnections(prev => prev.map(conn => 
        conn.id === platformId 
          ? { ...conn, status: 'error' }
          : conn
      ));

      addSyncActivity({
        type: 'auth',
        platform: platformId,
        status: 'error',
        message: `Failed to connect to ${platformId === 'github' ? 'GitHub' : 'LinkedIn'}`,
      });

      Alert.alert('Error', 'Failed to connect. Please try again.');
    }
  };

  const handleDisconnect = (platformId: 'github' | 'linkedin') => {
    Alert.alert(
      'Disconnect Account',
      `Are you sure you want to disconnect your ${platformId === 'github' ? 'GitHub' : 'LinkedIn'} account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            setConnections(prev => prev.map(conn => 
              conn.id === platformId 
                ? { ...conn, connected: false, status: 'disconnected', lastSync: null, data: undefined }
                : conn
            ));
          },
        },
      ]
    );
  };

  const handleManualSync = async (platformId?: 'github' | 'linkedin') => {
    try {
      setIsRefreshing(true);
      
      const platformsToSync = platformId ? [platformId] : connections.filter(c => c.connected).map(c => c.id);
      
      for (const platform of platformsToSync) {
        setConnections(prev => prev.map(conn => 
          conn.id === platform 
            ? { ...conn, status: 'syncing' }
            : conn
        ));

        // Simulate sync process
        await new Promise(resolve => setTimeout(resolve, 1500));

        setConnections(prev => prev.map(conn => 
          conn.id === platform 
            ? { 
                ...conn, 
                status: 'connected',
                lastSync: new Date().toISOString(),
              }
            : conn
        ));

        addSyncActivity({
          type: 'sync',
          platform: platform as 'github' | 'linkedin',
          status: 'success',
          message: `Successfully synced ${platform === 'github' ? 'GitHub' : 'LinkedIn'} data`,
        });
      }
    } catch (error) {
      addSyncActivity({
        type: 'sync',
        platform: platformId || 'both',
        status: 'error',
        message: 'Sync failed. Please try again.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const addSyncActivity = (activity: Omit<SyncActivity, 'id' | 'timestamp'>) => {
    const newActivity: SyncActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setSyncActivities(prev => [newActivity, ...prev]);
  };

  const toggleFieldEnabled = (fieldId: string) => {
    setDataFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, enabled: !field.enabled }
        : field
    ));
  };

  const updateSyncSettings = (key: keyof SyncSettings, value: any) => {
    setSyncSettings(prev => ({ ...prev, [key]: value }));
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={16} color={colors.success[500]} />;
      case 'syncing':
        return <RefreshCw size={16} color={colors.primary[500]} />;
      case 'error':
        return <AlertCircle size={16} color={colors.error[500]} />;
      default:
        return <Clock size={16} color={colors.neutral[400]} />;
    }
  };

  const renderDashboard = () => (
    <ScrollView 
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => handleManualSync()}
          colors={[colors.primary[500]]}
          tintColor={colors.primary[500]}
        />
      }
    >
      {/* Connection Status Cards */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Platform Connections</Text>
        
        {connections.map((connection, index) => (
          <Animated.View
            key={connection.id}
            entering={FadeInRight.delay(index * 200).duration(500)}
            style={[styles.connectionCard, { backgroundColor: colors.background }]}
          >
            <View style={styles.connectionHeader}>
              <View style={styles.connectionInfo}>
                <View style={[styles.connectionIcon, { backgroundColor: connection.color }]}>
                  {connection.icon}
                </View>
                <View style={styles.connectionDetails}>
                  <Text style={[styles.connectionName, { color: colors.text }]}>
                    {connection.name}
                  </Text>
                  <View style={styles.connectionStatus}>
                    {getStatusIcon(connection.status)}
                    <Text style={[styles.connectionStatusText, { color: colors.textSecondary }]}>
                      {connection.connected ? 'Connected' : 'Not connected'}
                    </Text>
                  </View>
                  {connection.lastSync && (
                    <Text style={[styles.lastSyncText, { color: colors.neutral[500] }]}>
                      Last sync: {formatTimestamp(connection.lastSync)}
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.connectionActions}>
                {connection.connected ? (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.primary[50] }]}
                      onPress={() => handleManualSync(connection.id)}
                      disabled={connection.status === 'syncing'}
                    >
                      <RefreshCw 
                        size={16} 
                        color={colors.primary[500]} 
                        style={connection.status === 'syncing' ? { transform: [{ rotate: '180deg' }] } : {}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.error[50] }]}
                      onPress={() => handleDisconnect(connection.id)}
                    >
                      <X size={16} color={colors.error[500]} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <Button
                    title="Connect"
                    variant="primary"
                    size="small"
                    onPress={() => handleConnect(connection.id)}
                    loading={connection.status === 'syncing'}
                  />
                )}
              </View>
            </View>

            {/* Connection Data Preview */}
            {connection.connected && connection.data && (
              <View style={styles.dataPreview}>
                <Text style={[styles.dataPreviewTitle, { color: colors.text }]}>
                  Recent Data
                </Text>
                {connection.id === 'github' && (
                  <View style={styles.dataStats}>
                    <View style={styles.dataStat}>
                      <Star size={14} color={colors.warning[500]} />
                      <Text style={[styles.dataStatText, { color: colors.textSecondary }]}>
                        {connection.data.repositories?.reduce((sum: number, repo: any) => sum + repo.stars, 0)} stars
                      </Text>
                    </View>
                    <View style={styles.dataStat}>
                      <GitBranch size={14} color={colors.primary[500]} />
                      <Text style={[styles.dataStatText, { color: colors.textSecondary }]}>
                        {connection.data.repositories?.length} repos
                      </Text>
                    </View>
                    <View style={styles.dataStat}>
                      <Code size={14} color={colors.accent[500]} />
                      <Text style={[styles.dataStatText, { color: colors.textSecondary }]}>
                        {connection.data.languages?.length} languages
                      </Text>
                    </View>
                  </View>
                )}
                {connection.id === 'linkedin' && (
                  <View style={styles.dataStats}>
                    <View style={styles.dataStat}>
                      <Briefcase size={14} color={colors.primary[500]} />
                      <Text style={[styles.dataStatText, { color: colors.textSecondary }]}>
                        {connection.data.experience?.length} positions
                      </Text>
                    </View>
                    <View style={styles.dataStat}>
                      <GraduationCap size={14} color={colors.secondary[500]} />
                      <Text style={[styles.dataStatText, { color: colors.textSecondary }]}>
                        {connection.data.education?.length} degrees
                      </Text>
                    </View>
                    <View style={styles.dataStat}>
                      <Award size={14} color={colors.success[500]} />
                      <Text style={[styles.dataStatText, { color: colors.textSecondary }]}>
                        {connection.data.skills?.length} skills
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </Animated.View>
        ))}
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: colors.primary[50] }]}
            onPress={() => handleManualSync()}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary[500] }]}>
              <Sync size={24} color="white" />
            </View>
            <Text style={[styles.quickActionTitle, { color: colors.primary[700] }]}>
              Sync All
            </Text>
            <Text style={[styles.quickActionDescription, { color: colors.primary[600] }]}>
              Update all connected platforms
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: colors.warning[50] }]}
            onPress={() => setActiveTab('conflicts')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.warning[500] }]}>
              <AlertCircle size={24} color="white" />
            </View>
            <Text style={[styles.quickActionTitle, { color: colors.warning[700] }]}>
              Resolve Conflicts
            </Text>
            <Text style={[styles.quickActionDescription, { color: colors.warning[600] }]}>
              Handle data conflicts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: colors.success[50] }]}
            onPress={() => setShowSecurityModal(true)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.success[500] }]}>
              <Shield size={24} color="white" />
            </View>
            <Text style={[styles.quickActionTitle, { color: colors.success[700] }]}>
              Security
            </Text>
            <Text style={[styles.quickActionDescription, { color: colors.success[600] }]}>
              Review security settings
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Sync Statistics */}
      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sync Statistics</Text>
        
        <View style={[styles.statsCard, { backgroundColor: colors.background }]}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Syncs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>2</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Conflicts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>99.2%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>1.2s</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Time</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Sync Settings */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sync Settings</Text>
        
        <View style={[styles.settingsCard, { backgroundColor: colors.background }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Auto Sync</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Automatically sync data at regular intervals
              </Text>
            </View>
            <Switch
              value={syncSettings.autoSync}
              onValueChange={(value) => updateSyncSettings('autoSync', value)}
              trackColor={{ false: colors.neutral[200], true: colors.primary[200] }}
              thumbColor={syncSettings.autoSync ? colors.primary[500] : colors.neutral[400]}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Sync Frequency</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                How often to sync data automatically
              </Text>
            </View>
            <TouchableOpacity style={[styles.settingValue, { backgroundColor: colors.neutral[100] }]}>
              <Text style={[styles.settingValueText, { color: colors.text }]}>
                {syncSettings.syncFrequency.charAt(0).toUpperCase() + syncSettings.syncFrequency.slice(1)}
              </Text>
              <ChevronRight size={16} color={colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Conflict Resolution</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                How to handle data conflicts
              </Text>
            </View>
            <TouchableOpacity style={[styles.settingValue, { backgroundColor: colors.neutral[100] }]}>
              <Text style={[styles.settingValueText, { color: colors.text }]}>
                Manual Review
              </Text>
              <ChevronRight size={16} color={colors.neutral[500]} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Data Field Selection */}
      <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Fields</Text>
        
        <View style={[styles.fieldsCard, { backgroundColor: colors.background }]}>
          {dataFields.map((field, index) => (
            <Animated.View
              key={field.id}
              entering={FadeInUp.delay(300 + index * 50).duration(400)}
              style={styles.fieldItem}
            >
              <View style={styles.fieldInfo}>
                <View style={styles.fieldHeader}>
                  <Text style={[styles.fieldName, { color: colors.text }]}>
                    {field.name}
                  </Text>
                  <Badge
                    label={field.platform}
                    variant={field.platform === 'github' ? 'neutral' : 'primary'}
                    size="small"
                  />
                </View>
                <Text style={[styles.fieldDescription, { color: colors.textSecondary }]}>
                  {field.description}
                </Text>
                {field.lastUpdated && (
                  <Text style={[styles.fieldLastUpdated, { color: colors.neutral[500] }]}>
                    Last updated: {formatTimestamp(field.lastUpdated)}
                  </Text>
                )}
              </View>
              <Switch
                value={field.enabled}
                onValueChange={() => toggleFieldEnabled(field.id)}
                trackColor={{ false: colors.neutral[200], true: colors.primary[200] }}
                thumbColor={field.enabled ? colors.primary[500] : colors.neutral[400]}
              />
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Security Settings */}
      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Security & Privacy</Text>
        
        <View style={[styles.securityCard, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.securityItem}>
            <View style={[styles.securityIcon, { backgroundColor: colors.primary[50] }]}>
              <Key size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.securityInfo}>
              <Text style={[styles.securityTitle, { color: colors.text }]}>
                API Keys & Tokens
              </Text>
              <Text style={[styles.securityDescription, { color: colors.textSecondary }]}>
                Manage authentication tokens
              </Text>
            </View>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.securityItem}>
            <View style={[styles.securityIcon, { backgroundColor: colors.warning[50] }]}>
              <Shield size={20} color={colors.warning[500]} />
            </View>
            <View style={styles.securityInfo}>
              <Text style={[styles.securityTitle, { color: colors.text }]}>
                Data Encryption
              </Text>
              <Text style={[styles.securityDescription, { color: colors.textSecondary }]}>
                End-to-end encryption enabled
              </Text>
            </View>
            <CheckCircle size={20} color={colors.success[500]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.securityItem}>
            <View style={[styles.securityIcon, { backgroundColor: colors.error[50] }]}>
              <Database size={20} color={colors.error[500]} />
            </View>
            <View style={styles.securityInfo}>
              <Text style={[styles.securityTitle, { color: colors.text }]}>
                Data Retention
              </Text>
              <Text style={[styles.securityDescription, { color: colors.textSecondary }]}>
                Configure data storage policies
              </Text>
            </View>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );

  const renderActivity = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sync Activity</Text>
        
        <View style={styles.activityList}>
          {syncActivities.map((activity, index) => (
            <Animated.View
              key={activity.id}
              entering={FadeInUp.delay(index * 100).duration(400)}
              style={[styles.activityItem, { backgroundColor: colors.background }]}
            >
              <View style={styles.activityHeader}>
                <View style={[
                  styles.activityIcon,
                  {
                    backgroundColor: activity.status === 'success' 
                      ? colors.success[50] 
                      : activity.status === 'error'
                        ? colors.error[50]
                        : colors.warning[50]
                  }
                ]}>
                  {activity.type === 'sync' && <Sync size={16} color={
                    activity.status === 'success' ? colors.success[500] : colors.error[500]
                  } />}
                  {activity.type === 'auth' && <Key size={16} color={colors.primary[500]} />}
                  {activity.type === 'conflict_resolution' && <AlertCircle size={16} color={colors.warning[500]} />}
                  {activity.type === 'error' && <X size={16} color={colors.error[500]} />}
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityMessage, { color: colors.text }]}>
                    {activity.message}
                  </Text>
                  <View style={styles.activityMeta}>
                    <Badge
                      label={activity.platform === 'both' ? 'Both' : activity.platform}
                      variant="neutral"
                      size="small"
                    />
                    <Text style={[styles.activityTime, { color: colors.neutral[500] }]}>
                      {formatTimestamp(activity.timestamp)}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityStatus}>
                  {activity.status === 'success' && <CheckCircle size={16} color={colors.success[500]} />}
                  {activity.status === 'error' && <AlertCircle size={16} color={colors.error[500]} />}
                  {activity.status === 'warning' && <AlertCircle size={16} color={colors.warning[500]} />}
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );

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
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Profile Integration
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Connect and sync your professional profiles
            </Text>
          </View>
          
          <TouchableOpacity style={styles.headerAction}>
            <Settings size={24} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>

        {/* Tab Navigation */}
        <Animated.View 
          entering={SlideInRight.delay(200).duration(400)}
          style={[styles.tabNavigation, { backgroundColor: colors.neutral[50] }]}
        >
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
            { id: 'activity', label: 'Activity', icon: <Activity size={18} /> },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                activeTab === tab.id && { backgroundColor: colors.primary[500] }
              ]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              {React.cloneElement(tab.icon, {
                color: activeTab === tab.id ? 'white' : colors.neutral[600]
              })}
              <Text style={[
                styles.tabLabel,
                {
                  color: activeTab === tab.id ? 'white' : colors.neutral[600]
                }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'activity' && renderActivity()}
        </View>

        {/* Security Modal */}
        <Modal
          visible={showSecurityModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowSecurityModal(false)}
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowSecurityModal(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Security & Compliance
              </Text>
              <View style={styles.modalHeaderSpacer} />
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.securityOverview}>
                <View style={[styles.securityBadge, { backgroundColor: colors.success[50] }]}>
                  <Shield size={32} color={colors.success[500]} />
                  <Text style={[styles.securityBadgeTitle, { color: colors.success[700] }]}>
                    Secure Connection
                  </Text>
                  <Text style={[styles.securityBadgeDescription, { color: colors.success[600] }]}>
                    All data is encrypted and securely transmitted
                  </Text>
                </View>

                <View style={styles.complianceList}>
                  <Text style={[styles.complianceTitle, { color: colors.text }]}>
                    Compliance & Standards
                  </Text>
                  
                  <View style={styles.complianceItem}>
                    <CheckCircle size={20} color={colors.success[500]} />
                    <Text style={[styles.complianceText, { color: colors.text }]}>
                      GDPR Compliant
                    </Text>
                  </View>
                  
                  <View style={styles.complianceItem}>
                    <CheckCircle size={20} color={colors.success[500]} />
                    <Text style={[styles.complianceText, { color: colors.text }]}>
                      OAuth 2.0 Authentication
                    </Text>
                  </View>
                  
                  <View style={styles.complianceItem}>
                    <CheckCircle size={20} color={colors.success[500]} />
                    <Text style={[styles.complianceText, { color: colors.text }]}>
                      End-to-End Encryption
                    </Text>
                  </View>
                  
                  <View style={styles.complianceItem}>
                    <CheckCircle size={20} color={colors.success[500]} />
                    <Text style={[styles.complianceText, { color: colors.text }]}>
                      Regular Security Audits
                    </Text>
                  </View>
                </View>

                <View style={styles.dataRetention}>
                  <Text style={[styles.dataRetentionTitle, { color: colors.text }]}>
                    Data Retention Policy
                  </Text>
                  <Text style={[styles.dataRetentionText, { color: colors.textSecondary }]}>
                    Your data is stored securely and can be deleted at any time. 
                    We automatically purge inactive data after 12 months of inactivity.
                  </Text>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
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
    fontSize: 16,
  },
  headerAction: {
    padding: 8,
    marginLeft: 12,
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  connectionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  connectionInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  connectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  connectionDetails: {
    flex: 1,
  },
  connectionName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  connectionStatusText: {
    fontSize: 14,
    marginLeft: 6,
  },
  lastSyncText: {
    fontSize: 12,
  },
  connectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataPreview: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dataPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dataStats: {
    flexDirection: 'row',
    gap: 16,
  },
  dataStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dataStatText: {
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  statsCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  settingsCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  settingValueText: {
    fontSize: 14,
    marginRight: 6,
  },
  fieldsCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  fieldInfo: {
    flex: 1,
    marginRight: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  fieldDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  fieldLastUpdated: {
    fontSize: 12,
  },
  securityCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  securityDescription: {
    fontSize: 14,
  },
  activityList: {
    paddingHorizontal: 20,
  },
  activityItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
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
  activityMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityTime: {
    fontSize: 12,
  },
  activityStatus: {
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalCloseButton: {
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
    padding: 20,
  },
  securityOverview: {
    alignItems: 'center',
  },
  securityBadge: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    width: '100%',
  },
  securityBadgeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  securityBadgeDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  complianceList: {
    width: '100%',
    marginBottom: 32,
  },
  complianceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  complianceText: {
    fontSize: 16,
    marginLeft: 12,
  },
  dataRetention: {
    width: '100%',
  },
  dataRetentionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  dataRetentionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});