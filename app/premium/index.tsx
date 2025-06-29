import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, X, Shield, CreditCard, Calendar, Infinity, Sparkles, Zap, Star, Award, Lock, Clock as Unlock, Download, MessageCircle, Video, FileText, Clock, Users } from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

const { width: screenWidth } = Dimensions.get('window');

interface PricingTier {
  id: string;
  name: string;
  price: string;
  billingPeriod: string;
  originalPrice?: string;
  discount?: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
}

interface FeatureComparison {
  feature: string;
  description?: string;
  free: boolean | string;
  premium: boolean | string;
  icon: React.ReactNode;
}

export default function PremiumSubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [selectedTier, setSelectedTier] = useState<string>('annual');
  const [isLoading, setIsLoading] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$9.99',
      billingPeriod: 'per month',
      icon: <Calendar size={24} color="white" />,
      color: colors.primary[500],
      features: [
        'Unlimited access to all courses',
        'Priority support',
        'Certificate of completion',
        'Download course materials',
        'Cancel anytime'
      ]
    },
    {
      id: 'annual',
      name: 'Annual',
      price: '$99.99',
      billingPeriod: 'per year',
      originalPrice: '$119.88',
      discount: 'Save 17%',
      icon: <Star size={24} color="white" />,
      color: colors.accent[500],
      features: [
        'All Monthly plan features',
        'Two free coaching sessions',
        'Exclusive webinars',
        'Early access to new courses',
        'Annual learning assessment'
      ],
      popular: true,
      recommended: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$299.99',
      billingPeriod: 'one-time payment',
      icon: <Infinity size={24} color="white" />,
      color: colors.secondary[500],
      features: [
        'All Annual plan features',
        'Lifetime access to all content',
        'Unlimited coaching sessions',
        'Exclusive community access',
        'Personal learning roadmap'
      ]
    }
  ];

  const featureComparison: FeatureComparison[] = [
    {
      feature: 'Course Access',
      description: 'Number of courses you can access',
      free: 'Limited (5)',
      premium: 'Unlimited',
      icon: <BookOpen size={20} color={colors.primary[500]} />
    },
    {
      feature: 'HD Video Quality',
      description: 'High-definition video streaming',
      free: false,
      premium: true,
      icon: <Video size={20} color={colors.primary[500]} />
    },
    {
      feature: 'Downloadable Resources',
      description: 'Download course materials for offline use',
      free: false,
      premium: true,
      icon: <Download size={20} color={colors.primary[500]} />
    },
    {
      feature: 'Completion Certificates',
      description: 'Receive certificates upon course completion',
      free: false,
      premium: true,
      icon: <Award size={20} color={colors.primary[500]} />
    },
    {
      feature: 'Priority Support',
      description: '24/7 priority customer support',
      free: false,
      premium: true,
      icon: <MessageCircle size={20} color={colors.primary[500]} />
    },
    {
      feature: 'Coaching Sessions',
      description: 'One-on-one sessions with experts',
      free: false,
      premium: '2-Unlimited',
      icon: <Users size={20} color={colors.primary[500]} />
    },
    {
      feature: 'Ad-Free Experience',
      description: 'No advertisements while learning',
      free: false,
      premium: true,
      icon: <Unlock size={20} color={colors.primary[500]} />
    },
    {
      feature: 'Course Updates',
      description: 'Access to course updates and new content',
      free: 'Limited',
      premium: 'Unlimited',
      icon: <Zap size={20} color={colors.primary[500]} />
    }
  ];

  const handleSubscribe = async (tierId: string) => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        Alert.alert(
          'Authentication Required',
          'Please sign in to subscribe to a premium plan.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => router.push('/login') }
          ]
        );
        return;
      }
      
      // In a real implementation, this would redirect to a payment processor
      // or initiate the RevenueCat purchase flow
      Alert.alert(
        'Subscription Information',
        'To complete your subscription, you would be redirected to a secure payment page. This is a demo implementation.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Learn More', 
            onPress: () => {
              // In a real app, this would open a web page with more information
              console.log('User wants to learn more about subscriptions');
            } 
          }
        ]
      );
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Error', 'There was an error processing your subscription. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.duration(500)}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Upgrade to Premium</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Unlock your full learning potential
            </Text>
          </View>
        </Animated.View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Banner */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.heroBanner}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
              style={styles.heroImage}
            />
            <View style={[styles.heroOverlay, { backgroundColor: `${colors.primary[900]}CC` }]}>
              <View style={styles.heroContent}>
                <View style={[styles.heroIcon, { backgroundColor: colors.primary[500] }]}>
                  <Sparkles size={32} color="white" />
                </View>
                <Text style={styles.heroTitle}>Elevate Your Learning Journey</Text>
                <Text style={styles.heroDescription}>
                  Join thousands of learners who have accelerated their careers with our premium content
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Pricing Tiers */}
          <View style={styles.pricingSection}>
            <Animated.Text 
              entering={FadeInUp.delay(300).duration(500)}
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              Choose Your Plan
            </Animated.Text>
            
            {pricingTiers.map((tier, index) => (
              <Animated.View
                key={tier.id}
                entering={FadeInRight.delay(400 + index * 100).duration(500)}
              >
                <EnhancedCard
                  variant={selectedTier === tier.id ? 'glass' : 'elevated'}
                  interactive
                  glowEffect={selectedTier === tier.id}
                  onPress={() => setSelectedTier(tier.id)}
                  style={[
                    styles.pricingCard,
                    selectedTier === tier.id && { borderColor: tier.color, borderWidth: 2 }
                  ]}
                >
                  {tier.popular && (
                    <View style={[styles.popularBadge, { backgroundColor: colors.warning[500] }]}>
                      <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                  )}
                  
                  <View style={styles.pricingHeader}>
                    <View style={[styles.pricingIconContainer, { backgroundColor: tier.color }]}>
                      {tier.icon}
                    </View>
                    <View style={styles.pricingInfo}>
                      <Text style={[styles.pricingName, { color: colors.text }]}>{tier.name}</Text>
                      <View style={styles.priceContainer}>
                        <Text style={[styles.price, { color: colors.text }]}>{tier.price}</Text>
                        <Text style={[styles.billingPeriod, { color: colors.textSecondary }]}>
                          {tier.billingPeriod}
                        </Text>
                      </View>
                      {tier.originalPrice && (
                        <View style={styles.discountContainer}>
                          <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                            {tier.originalPrice}
                          </Text>
                          <Badge
                            label={tier.discount || ''}
                            variant="success"
                            size="small"
                            style={styles.discountBadge}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.featuresContainer}>
                    {tier.features.map((feature, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Check size={16} color={tier.color} />
                        <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <Button
                    title={tier.id === 'monthly' ? 'Subscribe Monthly' : tier.id === 'annual' ? 'Subscribe Yearly' : 'Get Lifetime Access'}
                    variant="primary"
                    onPress={() => handleSubscribe(tier.id)}
                    loading={isLoading && selectedTier === tier.id}
                    style={[styles.subscribeButton, { backgroundColor: tier.color }]}
                  />
                  
                  {tier.recommended && (
                    <Text style={[styles.recommendedText, { color: tier.color }]}>
                      Recommended for most users
                    </Text>
                  )}
                </EnhancedCard>
              </Animated.View>
            ))}
          </View>

          {/* Feature Comparison */}
          <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.comparisonSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Free vs. Premium
            </Text>
            
            <GlassCard style={styles.comparisonCard}>
              <View style={styles.comparisonHeader}>
                <View style={styles.comparisonHeaderCell}>
                  <Text style={[styles.comparisonHeaderText, { color: colors.text }]}>Feature</Text>
                </View>
                <View style={styles.comparisonHeaderCell}>
                  <Text style={[styles.comparisonHeaderText, { color: colors.text }]}>Free</Text>
                </View>
                <View style={[styles.comparisonHeaderCell, { backgroundColor: colors.primary[50] }]}>
                  <Text style={[styles.comparisonHeaderText, { color: colors.primary[700] }]}>Premium</Text>
                </View>
              </View>
              
              {featureComparison.map((item, index) => (
                <View 
                  key={item.feature} 
                  style={[
                    styles.comparisonRow,
                    index % 2 === 0 && { backgroundColor: colors.neutral[50] }
                  ]}
                >
                  <View style={styles.featureCell}>
                    <View style={styles.featureCellContent}>
                      {item.icon}
                      <View style={styles.featureCellText}>
                        <Text style={[styles.featureName, { color: colors.text }]}>{item.feature}</Text>
                        {item.description && (
                          <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={styles.valueCell}>
                    {typeof item.free === 'boolean' ? (
                      item.free ? (
                        <Check size={20} color={colors.success[500]} />
                      ) : (
                        <X size={20} color={colors.neutral[400]} />
                      )
                    ) : (
                      <Text style={[styles.valueCellText, { color: colors.textSecondary }]}>{item.free}</Text>
                    )}
                  </View>
                  <View style={[styles.valueCell, { backgroundColor: colors.primary[25] }]}>
                    {typeof item.premium === 'boolean' ? (
                      item.premium ? (
                        <Check size={20} color={colors.success[500]} />
                      ) : (
                        <X size={20} color={colors.neutral[400]} />
                      )
                    ) : (
                      <Text style={[styles.valueCellText, { color: colors.primary[700] }]}>{item.premium}</Text>
                    )}
                  </View>
                </View>
              ))}
            </GlassCard>
          </Animated.View>

          {/* Trust Indicators */}
          <Animated.View entering={FadeInUp.delay(800).duration(500)} style={styles.trustSection}>
            <GlassCard style={styles.trustCard}>
              <View style={styles.trustHeader}>
                <View style={[styles.trustIcon, { backgroundColor: colors.success[50] }]}>
                  <Shield size={24} color={colors.success[500]} />
                </View>
                <Text style={[styles.trustTitle, { color: colors.text }]}>
                  Secure & Trusted
                </Text>
              </View>
              
              <View style={styles.trustContent}>
                <View style={styles.trustItem}>
                  <View style={[styles.trustBadge, { backgroundColor: colors.neutral[100] }]}>
                    <CreditCard size={20} color={colors.neutral[700]} />
                  </View>
                  <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                    Secure Payment Processing
                  </Text>
                </View>
                
                <View style={styles.trustItem}>
                  <View style={[styles.trustBadge, { backgroundColor: colors.neutral[100] }]}>
                    <Clock size={20} color={colors.neutral[700]} />
                  </View>
                  <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                    30-Day Money-Back Guarantee
                  </Text>
                </View>
                
                <View style={styles.trustItem}>
                  <View style={[styles.trustBadge, { backgroundColor: colors.neutral[100] }]}>
                    <Lock size={20} color={colors.neutral[700]} />
                  </View>
                  <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                    Privacy Protected
                  </Text>
                </View>
              </View>
              
              <View style={styles.paymentMethods}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/6863250/pexels-photo-6863250.jpeg?auto=compress&cs=tinysrgb&w=800' }}
                  style={styles.paymentMethodsImage}
                />
              </View>
            </GlassCard>
          </Animated.View>

          {/* Testimonials */}
          <Animated.View entering={FadeInUp.delay(900).duration(500)} style={styles.testimonialsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              What Our Members Say
            </Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.testimonialsList}
            >
              <EnhancedCard variant="elevated" style={styles.testimonialCard}>
                <View style={styles.testimonialContent}>
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                    style={styles.testimonialAvatar}
                  />
                  <Text style={[styles.testimonialText, { color: colors.text }]}>
                    "The premium subscription was worth every penny. I've completed 12 courses in 6 months and landed my dream job!"
                  </Text>
                  <View style={styles.testimonialRating}>
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                  </View>
                  <Text style={[styles.testimonialName, { color: colors.text }]}>
                    Jennifer K.
                  </Text>
                  <Text style={[styles.testimonialRole, { color: colors.textSecondary }]}>
                    Software Developer
                  </Text>
                </View>
              </EnhancedCard>
              
              <EnhancedCard variant="elevated" style={styles.testimonialCard}>
                <View style={styles.testimonialContent}>
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                    style={styles.testimonialAvatar}
                  />
                  <Text style={[styles.testimonialText, { color: colors.text }]}>
                    "The coaching sessions alone are worth the subscription. I've gained insights that transformed my business approach."
                  </Text>
                  <View style={styles.testimonialRating}>
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                  </View>
                  <Text style={[styles.testimonialName, { color: colors.text }]}>
                    Michael T.
                  </Text>
                  <Text style={[styles.testimonialRole, { color: colors.textSecondary }]}>
                    Entrepreneur
                  </Text>
                </View>
              </EnhancedCard>
              
              <EnhancedCard variant="elevated" style={styles.testimonialCard}>
                <View style={styles.testimonialContent}>
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                    style={styles.testimonialAvatar}
                  />
                  <Text style={[styles.testimonialText, { color: colors.text }]}>
                    "I switched from another platform and the quality of content here is exceptional. The lifetime plan was a no-brainer for me."
                  </Text>
                  <View style={styles.testimonialRating}>
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                    <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
                  </View>
                  <Text style={[styles.testimonialName, { color: colors.text }]}>
                    Sarah L.
                  </Text>
                  <Text style={[styles.testimonialRole, { color: colors.textSecondary }]}>
                    UX Designer
                  </Text>
                </View>
              </EnhancedCard>
            </ScrollView>
          </Animated.View>

          {/* FAQ Section */}
          <Animated.View entering={FadeInUp.delay(1000).duration(500)} style={styles.faqSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Frequently Asked Questions
            </Text>
            
            <EnhancedCard variant="elevated" style={styles.faqCard}>
              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>
                  Can I cancel my subscription anytime?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                  Yes, you can cancel your monthly or annual subscription at any time. Your premium access will continue until the end of your current billing period.
                </Text>
              </View>
              
              <View style={[styles.faqDivider, { backgroundColor: colors.divider }]} />
              
              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>
                  How does the 30-day guarantee work?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                  If you're not satisfied with your premium experience within the first 30 days, contact our support team for a full refund, no questions asked.
                </Text>
              </View>
              
              <View style={[styles.faqDivider, { backgroundColor: colors.divider }]} />
              
              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>
                  Will I get access to new courses?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                  Absolutely! Your premium subscription includes access to all new courses as they're released. Annual and lifetime members get early access.
                </Text>
              </View>
              
              <View style={[styles.faqDivider, { backgroundColor: colors.divider }]} />
              
              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>
                  How do I schedule coaching sessions?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                  After subscribing, you'll gain access to our coaching calendar where you can book sessions with our experts based on your subscription allowance.
                </Text>
              </View>
            </EnhancedCard>
          </Animated.View>

          {/* CTA Section */}
          <Animated.View entering={FadeInUp.delay(1100).duration(500)} style={styles.ctaSection}>
            <GlassCard style={styles.ctaCard}>
              <View style={styles.ctaContent}>
                <View style={[styles.ctaIcon, { backgroundColor: colors.primary[500] }]}>
                  <Sparkles size={32} color="white" />
                </View>
                <Text style={[styles.ctaTitle, { color: colors.text }]}>
                  Ready to Accelerate Your Learning?
                </Text>
                <Text style={[styles.ctaDescription, { color: colors.textSecondary }]}>
                  Join thousands of professionals who have transformed their careers with our premium content.
                </Text>
                <Button
                  title="Upgrade to Premium"
                  variant="primary"
                  onPress={() => handleSubscribe(selectedTier)}
                  style={styles.ctaButton}
                />
                <Text style={[styles.ctaFooter, { color: colors.textSecondary }]}>
                  No risk with our 30-day money-back guarantee
                </Text>
              </View>
            </GlassCard>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
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
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroBanner: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  pricingSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  pricingCard: {
    marginBottom: 16,
    padding: 20,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  pricingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pricingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pricingInfo: {
    flex: 1,
  },
  pricingName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    marginRight: 4,
  },
  billingPeriod: {
    fontSize: 14,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    marginLeft: 0,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 12,
  },
  subscribeButton: {
    width: '100%',
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  comparisonSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  comparisonCard: {
    padding: 0,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  comparisonHeaderCell: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  comparisonRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  featureCell: {
    flex: 2,
    padding: 12,
  },
  featureCellContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCellText: {
    marginLeft: 12,
    flex: 1,
  },
  featureName: {
    fontSize: 14,
    fontWeight: '500',
  },
  featureDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  valueCell: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueCellText: {
    fontSize: 12,
    fontWeight: '500',
  },
  trustSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  trustCard: {
    padding: 20,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trustIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  trustContent: {
    marginBottom: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trustBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trustText: {
    fontSize: 14,
  },
  paymentMethods: {
    alignItems: 'center',
  },
  paymentMethodsImage: {
    width: '100%',
    height: 40,
    resizeMode: 'contain',
  },
  testimonialsSection: {
    marginBottom: 32,
  },
  testimonialsList: {
    paddingHorizontal: 20,
  },
  testimonialCard: {
    width: 280,
    marginRight: 16,
    padding: 20,
  },
  testimonialContent: {
    alignItems: 'center',
  },
  testimonialAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  testimonialText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  testimonialRating: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  testimonialRole: {
    fontSize: 14,
  },
  faqSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  faqCard: {
    padding: 20,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
  },
  faqDivider: {
    height: 1,
    marginVertical: 16,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  ctaCard: {
    padding: 24,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    minWidth: 200,
    marginBottom: 16,
  },
  ctaFooter: {
    fontSize: 12,
  },
  bottomSpacing: {
    height: 80,
  },
});