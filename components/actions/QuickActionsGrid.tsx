import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
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
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string[];
  stats?: string;
  priority?: 'high' | 'medium' | 'low';
  action?: () => void;
}

interface QuickActionsGridProps {
  actions?: QuickAction[];
  onActionPress?: (actionId: string) => void;
}

export function QuickActionsGrid({ actions, onActionPress }: QuickActionsGridProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const handleActionPress = (action: QuickAction) => {
    // Call the custom handler if provided
    if (onActionPress) {
      onActionPress(action.id);
      return;
    }
    
    // Execute the action only if it exists
    if (action.action && typeof action.action === 'function') {
      action.action();
    }
  };

  const renderQuickAction = (action: QuickAction, index: number) => (
    <Animated.View
      key={action.id}
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={[styles.actionCard, { width: (screenWidth - 60) / 2 }]}
    >
      <TouchableOpacity
        style={styles.actionCardContent}
        onPress={() => handleActionPress(action)}
        activeOpacity={0.8}
      >
        <View style={[styles.actionCardBackground, { 
          backgroundColor: action.gradient[0] 
        }]}>
          {/* Priority Indicator */}
          {action.priority === 'high' && (
            <View style={styles.priorityIndicator}>
              <View style={styles.priorityDot} />
            </View>
          )}
          
          <View style={styles.actionCardIcon}>
            {action.icon}
          </View>
          
          <View style={styles.actionCardContent}>
            <Text style={styles.actionCardTitle}>{action.title}</Text>
            <Text style={styles.actionCardSubtitle}>{action.subtitle}</Text>
            
            {/* Stats */}
            {action.stats && (
              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>{action.stats}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {actions?.map((action, index) => renderQuickAction(action, index))}
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
    position: 'relative',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    marginBottom: 8,
  },
  statsContainer: {
    alignSelf: 'flex-start',
  },
  statsText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});