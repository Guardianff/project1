import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Target, 
  Briefcase, 
  Dumbbell, 
  Heart, 
  BookOpen, 
  Calendar 
} from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string[];
  action: () => void;
}

export function QuickActionsGrid() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const quickActions: QuickAction[] = [
    {
      id: 'goal',
      title: 'Set a Goal',
      subtitle: 'Create your next milestone',
      icon: <Target size={32} color="white" />,
      gradient: ['#8B5CF6', '#EC4899'],
      action: () => console.log('Set goal action'),
    },
    {
      id: 'career',
      title: 'Career Growth',
      subtitle: 'Advance your professional skills',
      icon: <Briefcase size={32} color="white" />,
      gradient: ['#3B82F6', '#06B6D4'],
      action: () => console.log('Career growth action'),
    },
    {
      id: 'fitness',
      title: 'Fitness Plan',
      subtitle: 'Stay healthy and strong',
      icon: <Dumbbell size={32} color="white" />,
      gradient: ['#10B981', '#22C55E'],
      action: () => console.log('Fitness plan action'),
    },
    {
      id: 'passion',
      title: 'Passion Project',
      subtitle: 'Explore your creative side',
      icon: <Heart size={32} color="white" />,
      gradient: ['#F59E0B', '#EF4444'],
      action: () => console.log('Passion project action'),
    },
    {
      id: 'skills',
      title: 'Learn Skills',
      subtitle: 'Master new abilities',
      icon: <BookOpen size={32} color="white" />,
      gradient: ['#6366F1', '#8B5CF6'],
      action: () => console.log('Learn skills action'),
    },
    {
      id: 'plan',
      title: 'Daily Plan',
      subtitle: 'Review today\'s schedule',
      icon: <Calendar size={32} color="white" />,
      gradient: ['#14B8A6', '#06B6D4'],
      action: () => console.log('Daily plan action'),
    },
  ];

  const renderQuickAction = (action: QuickAction, index: number) => (
    <Animated.View
      key={action.id}
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={[styles.actionCard, { width: (screenWidth - 60) / 2 }]}
    >
      <TouchableOpacity
        style={styles.actionCardContent}
        onPress={action.action}
        activeOpacity={0.8}
      >
        <View style={[styles.actionCardBackground, { 
          backgroundColor: action.gradient[0] 
        }]}>
          <View style={styles.actionCardIcon}>
            {action.icon}
          </View>
          <Text style={styles.actionCardTitle}>{action.title}</Text>
          <Text style={styles.actionCardSubtitle}>{action.subtitle}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action, index) => renderQuickAction(action, index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    marginBottom: 16,
  },
  actionCardContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionCardBackground: {
    padding: 20,
    height: 140,
    justifyContent: 'space-between',
  },
  actionCardIcon: {
    alignSelf: 'flex-start',
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});