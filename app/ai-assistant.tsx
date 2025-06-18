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
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  X, 
  Target, 
  Briefcase, 
  Dumbbell, 
  Heart, 
  BookOpen, 
  Calendar,
  Settings,
  MessageCircle,
  Mic,
  Send,
  Sparkles,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useAI } from '@/context/AIContext';
import { Button } from '@/components/ui/Button';
import Animated, { FadeInUp, FadeInRight, SlideInUp } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

export default function AIAssistantScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { aiSuggestion, userPreferences } = useAI();
  const [chatMessage, setChatMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  const quickActions = [
    {
      id: 'goal',
      title: 'Set a Goal',
      subtitle: 'Create your next milestone',
      icon: <Target size={32} color="white" />,
      gradient: ['#8B5CF6', '#EC4899'],
      action: () => console.log('Set Goal'),
    },
    {
      id: 'career',
      title: 'Career Growth',
      subtitle: 'Advance your professional skills',
      icon: <Briefcase size={32} color="white" />,
      gradient: ['#3B82F6', '#06B6D4'],
      action: () => console.log('Career'),
    },
    {
      id: 'fitness',
      title: 'Fitness Plan',
      subtitle: 'Stay healthy and strong',
      icon: <Dumbbell size={32} color="white" />,
      gradient: ['#10B981', '#22C55E'],
      action: () => console.log('Fitness'),
    },
    {
      id: 'passion',
      title: 'Passion Project',
      subtitle: 'Explore your creative side',
      icon: <Heart size={32} color="white" />,
      gradient: ['#F59E0B', '#EF4444'],
      action: () => console.log('Passion'),
    },
    {
      id: 'skills',
      title: 'Learn Skills',
      subtitle: 'Master new abilities',
      icon: <BookOpen size={32} color="white" />,
      gradient: ['#6366F1', '#8B5CF6'],
      action: () => console.log('Skills'),
    },
    {
      id: 'plan',
      title: 'Daily Plan',
      subtitle: 'Review today\'s schedule',
      icon: <Calendar size={32} color="white" />,
      gradient: ['#14B8A6', '#06B6D4'],
      action: () => console.log('Daily Plan'),
    },
  ];

  const insights = [
    {
      id: 1,
      title: 'Streak Alert!',
      message: 'You\'re on a 7-day learning streak. Keep it going!',
      icon: <TrendingUp size={20} color={colors.success[500]} />,
      color: colors.success[500],
    },
    {
      id: 2,
      title: 'Perfect Timing',
      message: `It's ${userPreferences.preferredWorkoutTime} - your ideal workout time!`,
      icon: <Clock size={20} color={colors.primary[500]} />,
      color: colors.primary[500],
    },
    {
      id: 3,
      title: 'Quick Win',
      message: 'Complete one more lesson to reach your weekly goal.',
      icon: <Zap size={20} color={colors.warning[500]} />,
      color: colors.warning[500],
    },
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage);
      setChatMessage('');
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
            style={styles.closeButton} 
            onPress={() => router.back()}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Sparkles size={24} color={colors.primary[500]} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>AI Assistant</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              What would you like to work on today?
            </Text>
          </View>
          
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* AI Suggestion Banner */}
          {aiSuggestion && (
            <Animated.View 
              entering={SlideInUp.delay(200).duration(500)}
              style={[styles.suggestionBanner, { backgroundColor: colors.primary[50] }]}
            >
              <View style={styles.suggestionContent}>
                <View style={[styles.suggestionIcon, { backgroundColor: colors.primary[500] }]}>
                  <Sparkles size={20} color="white" />
                </View>
                <View style={styles.suggestionText}>
                  <Text style={[styles.suggestionTitle, { color: colors.primary[700] }]}>
                    AI Suggestion
                  </Text>
                  <Text style={[styles.suggestionMessage, { color: colors.primary[600] }]}>
                    {aiSuggestion}
                  </Text>
                </View>
              </View>
              <Button
                title="Let's Go"
                variant="primary"
                size="small"
                onPress={() => console.log('AI Suggestion Action')}
                style={styles.suggestionButton}
              />
            </Animated.View>
          )}

          {/* Quick Actions Grid */}
          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <Animated.View
                  key={action.id}
                  entering={FadeInRight.delay(400 + index * 100).duration(500)}
                  style={[styles.actionCard, { width: (screenWidth - 60) / 2 }]}
                >
                  <TouchableOpacity
                    style={styles.actionCardContent}
                    onPress={action.action}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.actionCardBackground, { 
                      background: `linear-gradient(135deg, ${action.gradient[0]}, ${action.gradient[1]})`,
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
              ))}
            </View>
          </Animated.View>

          {/* AI Insights */}
          <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Insights</Text>
            {insights.map((insight, index) => (
              <Animated.View
                key={insight.id}
                entering={FadeInUp.delay(700 + index * 100).duration(500)}
                style={[styles.insightCard, { backgroundColor: colors.background }]}
              >
                <View style={styles.insightContent}>
                  <View style={[styles.insightIcon, { backgroundColor: `${insight.color}15` }]}>
                    {insight.icon}
                  </View>
                  <View style={styles.insightText}>
                    <Text style={[styles.insightTitle, { color: colors.text }]}>
                      {insight.title}
                    </Text>
                    <Text style={[styles.insightMessage, { color: colors.textSecondary }]}>
                      {insight.message}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </Animated.View>

          {/* User Preferences */}
          <Animated.View entering={FadeInUp.delay(800).duration(500)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Preferences</Text>
            <View style={[styles.preferencesCard, { backgroundColor: colors.neutral[50] }]}>
              <View style={styles.preferenceItem}>
                <Text style={[styles.preferenceLabel, { color: colors.textSecondary }]}>
                  Current Focus
                </Text>
                <Text style={[styles.preferenceValue, { color: colors.text }]}>
                  {userPreferences.currentFocus.charAt(0).toUpperCase() + userPreferences.currentFocus.slice(1)}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={[styles.preferenceLabel, { color: colors.textSecondary }]}>
                  Workout Time
                </Text>
                <Text style={[styles.preferenceValue, { color: colors.text }]}>
                  {userPreferences.preferredWorkoutTime}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={[styles.preferenceLabel, { color: colors.textSecondary }]}>
                  Learning Goals
                </Text>
                <Text style={[styles.preferenceValue, { color: colors.text }]}>
                  {userPreferences.learningGoals.join(', ')}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Chat Interface */}
          <Animated.View entering={FadeInUp.delay(900).duration(500)} style={styles.section}>
            <TouchableOpacity
              style={[styles.chatToggle, { backgroundColor: colors.primary[500] }]}
              onPress={() => setShowChat(!showChat)}
            >
              <MessageCircle size={24} color="white" />
              <Text style={styles.chatToggleText}>Ask Me Anything</Text>
            </TouchableOpacity>

            {showChat && (
              <Animated.View 
                entering={SlideInUp.duration(300)}
                style={[styles.chatContainer, { backgroundColor: colors.background }]}
              >
                <View style={[styles.chatInput, { backgroundColor: colors.neutral[50] }]}>
                  <TextInput
                    style={[styles.chatTextInput, { color: colors.text }]}
                    placeholder="Type your question..."
                    placeholderTextColor={colors.neutral[400]}
                    value={chatMessage}
                    onChangeText={setChatMessage}
                    multiline
                  />
                  <View style={styles.chatActions}>
                    <TouchableOpacity style={styles.chatActionButton}>
                      <Mic size={20} color={colors.neutral[500]} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.chatActionButton, { backgroundColor: colors.primary[500] }]}
                      onPress={handleSendMessage}
                    >
                      <Send size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* Bottom Spacing */}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  settingsButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  suggestionBanner: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  suggestionMessage: {
    fontSize: 14,
  },
  suggestionButton: {
    marginLeft: 12,
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  insightCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightMessage: {
    fontSize: 14,
  },
  preferencesCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  preferenceLabel: {
    fontSize: 14,
  },
  preferenceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  chatToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  chatToggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  chatContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chatInput: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  chatTextInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  chatActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  bottomSpacing: {
    height: 100,
  },
});