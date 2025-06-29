import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Settings, MessageCircle, Sparkles, Lightbulb, Compass, FileSliders as Sliders, Trash2, Brain, Target, TrendingUp, Award, Clock } from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useAIAgent } from '@/context/AIAgentContext';
import { useAI } from '@/context/AIContext';
import { useRevenueCat } from '@/context/RevenueCatContext';
import { AIConversationView } from '@/components/ai/AIConversationView';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { AIRecommendationCard } from '@/components/ai/AIRecommendationCard';
import { AIPreferencesForm } from '@/components/ai/AIPreferencesForm';
import { PremiumFeature } from '@/components/ui/PremiumFeature';
import { Button } from '@/components/ui/Button';
import Animated, { FadeInUp, SlideInRight, FadeIn } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

export default function AIAssistantScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { isPremium } = useRevenueCat();
  const { 
    isActive, 
    toggleAgent, 
    learningInsights, 
    recommendations, 
    clearConversation, 
    getRecommendation, 
    dismissInsight,
    analyzeProgress
  } = useAIAgent();
  
  const {
    conversationHistory,
    clearConversationHistory,
    isAIGenerating
  } = useAI();
  
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'recommendations' | 'preferences'>('chat');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  
  // Get a new recommendation when viewing the recommendations tab
  useEffect(() => {
    if (activeTab === 'recommendations' && recommendations.length === 0 && !loadingRecommendation) {
      handleGetRecommendation();
    }
  }, [activeTab, recommendations.length]);
  
  // Get a new recommendation
  const handleGetRecommendation = async () => {
    setLoadingRecommendation(true);
    await getRecommendation('course');
    setLoadingRecommendation(false);
  };
  
  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <AIConversationView />
        );
      case 'insights':
        return renderInsightsTab();
      case 'recommendations':
        return renderRecommendationsTab();
      case 'preferences':
        return (
          <AIPreferencesForm />
        );
      default:
        return null;
    }
  };
  
  // Render the insights tab
  const renderInsightsTab = () => {
    if (learningInsights.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Lightbulb size={48} color={colors.neutral[300]} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
            No Insights Yet
          </Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            As you continue learning, I'll provide personalized insights to help you improve.
          </Text>
          <Button
            title="Analyze My Progress"
            variant="primary"
            onPress={async () => {
              const insights = await analyzeProgress();
              if (insights.length > 0) {
                insights.forEach(insight => {
                  // Add insight to the list
                });
              }
            }}
            style={styles.emptyStateButton}
          />
        </View>
      );
    }
    
    return (
      <ScrollView style={styles.insightsContainer} showsVerticalScrollIndicator={false}>
        {learningInsights.map((insight) => (
          <AIInsightCard
            key={insight.id}
            insight={insight}
            onDismiss={() => dismissInsight(insight.id)}
          />
        ))}
      </ScrollView>
    );
  };
  
  // Render the recommendations tab
  const renderRecommendationsTab = () => {
    return (
      <PremiumFeature
        title="AI-Powered Recommendations"
        description="Upgrade to premium to get personalized course recommendations based on your learning style and goals."
        showUpgradeButton={true}
      >
        <ScrollView style={styles.recommendationsContainer} showsVerticalScrollIndicator={false}>
          {recommendations.length === 0 ? (
            <View style={styles.emptyState}>
              <Compass size={48} color={colors.neutral[300]} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No Recommendations Yet
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                I'll analyze your learning patterns and preferences to suggest courses that match your goals.
              </Text>
              <Button
                title="Get Recommendations"
                variant="primary"
                onPress={handleGetRecommendation}
                loading={loadingRecommendation}
                style={styles.emptyStateButton}
              />
            </View>
          ) : (
            <>
              {recommendations.map((recommendation) => (
                <AIRecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))}
              <Button
                title="Get More Recommendations"
                variant="outline"
                onPress={handleGetRecommendation}
                loading={loadingRecommendation}
                style={styles.moreButton}
              />
            </>
          )}
        </ScrollView>
      </PremiumFeature>
    );
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
            <View style={[styles.headerIcon, { backgroundColor: colors.primary[50] }]}>
              <Sparkles size={24} color={colors.primary[500]} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>AI Learning Assistant</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Powered by advanced AI
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.toggleButton, 
              { backgroundColor: isActive ? colors.success[500] : colors.neutral[300] }
            ]}
            onPress={toggleAgent}
          >
            <View 
              style={[
                styles.toggleIndicator, 
                { 
                  backgroundColor: 'white',
                  transform: [{ translateX: isActive ? 12 : 0 }]
                }
              ]} 
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Tab Navigation */}
        <Animated.View 
          entering={SlideInRight.delay(200).duration(400)}
          style={[styles.tabNavigation, { backgroundColor: colors.neutral[50] }]}
        >
          {[
            { id: 'chat', label: 'Chat', icon: <MessageCircle size={18} /> },
            { id: 'insights', label: 'Insights', icon: <Lightbulb size={18} /> },
            { id: 'recommendations', label: 'Recommendations', icon: <Compass size={18} /> },
            { id: 'preferences', label: 'Preferences', icon: <Sliders size={18} /> },
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
          {renderTabContent()}
        </View>

        {/* Action Buttons */}
        {activeTab === 'chat' && (
          <Animated.View 
            entering={FadeIn.delay(400).duration(400)}
            style={[styles.actionButtons, { backgroundColor: colors.background }]}
          >
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error[50] }]}
              onPress={() => setShowClearConfirm(true)}
            >
              <Trash2 size={20} color={colors.error[500]} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Clear Confirmation */}
        {showClearConfirm && (
          <View style={styles.confirmOverlay}>
            <Animated.View 
              entering={FadeInUp.duration(300)}
              style={[styles.confirmDialog, { backgroundColor: colors.background }]}
            >
              <Text style={[styles.confirmTitle, { color: colors.text }]}>
                Clear Conversation
              </Text>
              <Text style={[styles.confirmText, { color: colors.textSecondary }]}>
                Are you sure you want to clear the entire conversation history? This action cannot be undone.
              </Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: colors.neutral[100] }]}
                  onPress={() => setShowClearConfirm(false)}
                >
                  <Text style={[styles.confirmButtonText, { color: colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: colors.error[500] }]}
                  onPress={() => {
                    clearConversation();
                    clearConversationHistory();
                    setShowClearConfirm(false);
                  }}
                >
                  <Text style={[styles.confirmButtonText, { color: 'white' }]}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
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
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  toggleButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    width: 36,
    height: 20,
    borderRadius: 10,
    padding: 2,
  },
  toggleIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
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
    padding: 16,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  insightsContainer: {
    flex: 1,
  },
  recommendationsContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  moreButton: {
    marginVertical: 20,
  },
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmDialog: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});