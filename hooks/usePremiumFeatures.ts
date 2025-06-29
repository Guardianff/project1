import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRevenueCat } from '@/context/RevenueCatContext';

// Define premium features
export type PremiumFeature = 
  | 'unlimited_courses'
  | 'coaching_sessions'
  | 'downloadable_content'
  | 'ad_free'
  | 'certificates'
  | 'priority_support'
  | 'exclusive_content'
  | 'early_access';

// Define feature access levels
export type FeatureAccess = 'full' | 'limited' | 'none';

export function usePremiumFeatures() {
  const { isPremium } = useRevenueCat();
  const [featureAccess, setFeatureAccess] = useState<Record<PremiumFeature, FeatureAccess>>({
    unlimited_courses: 'limited',
    coaching_sessions: 'none',
    downloadable_content: 'none',
    ad_free: 'none',
    certificates: 'none',
    priority_support: 'none',
    exclusive_content: 'none',
    early_access: 'none',
  });

  // Update feature access based on premium status
  useEffect(() => {
    if (isPremium) {
      setFeatureAccess({
        unlimited_courses: 'full',
        coaching_sessions: 'full',
        downloadable_content: 'full',
        ad_free: 'full',
        certificates: 'full',
        priority_support: 'full',
        exclusive_content: 'full',
        early_access: 'full',
      });
    } else {
      setFeatureAccess({
        unlimited_courses: 'limited',
        coaching_sessions: 'none',
        downloadable_content: 'none',
        ad_free: 'none',
        certificates: 'none',
        priority_support: 'none',
        exclusive_content: 'none',
        early_access: 'none',
      });
    }
  }, [isPremium]);

  // Check if a specific feature is available
  const hasAccess = (feature: PremiumFeature, level: FeatureAccess = 'full'): boolean => {
    const accessLevel = featureAccess[feature];
    
    if (level === 'full') {
      return accessLevel === 'full';
    } else if (level === 'limited') {
      return accessLevel === 'full' || accessLevel === 'limited';
    }
    
    return true; // 'none' level means everyone has access
  };

  // Get the number of available courses for the user
  const getAvailableCourseCount = (): number => {
    return isPremium ? Infinity : 5; // Free users get 5 courses
  };

  // Get the number of available coaching sessions
  const getAvailableCoachingCount = (): number => {
    return isPremium ? 2 : 0; // Premium users get 2 coaching sessions
  };

  // Check if a specific course is available to the user
  const isCourseAvailable = (courseId: string, enrolledCourseIds: string[]): boolean => {
    if (isPremium) return true;
    if (enrolledCourseIds.includes(courseId)) return true;
    return enrolledCourseIds.length < getAvailableCourseCount();
  };

  return {
    isPremium,
    hasAccess,
    getAvailableCourseCount,
    getAvailableCoachingCount,
    isCourseAvailable,
    featureAccess,
  };
}