import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for premium features
export const PREMIUM_FEATURES = {
  UNLIMITED_COURSES: 'unlimited_courses',
  COACHING_SESSIONS: 'coaching_sessions',
  DOWNLOADABLE_CONTENT: 'downloadable_content',
  AD_FREE: 'ad_free',
  CERTIFICATES: 'certificates',
  PRIORITY_SUPPORT: 'priority_support',
  EXCLUSIVE_CONTENT: 'exclusive_content',
  EARLY_ACCESS: 'early_access',
};

// Constants for subscription types
export const SUBSCRIPTION_TYPES = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
  LIFETIME: 'lifetime',
};

// Product IDs for each platform
export const PRODUCT_IDS = {
  ios: {
    monthly: 'com.yourapp.monthly',
    annual: 'com.yourapp.annual',
    lifetime: 'com.yourapp.lifetime',
  },
  android: {
    monthly: 'com.yourapp.monthly',
    annual: 'com.yourapp.annual',
    lifetime: 'com.yourapp.lifetime',
  },
};

// RevenueCat entitlement ID
export const ENTITLEMENT_ID = 'premium';

// For web platform, simulate premium status with AsyncStorage
export const simulatePremiumPurchase = async (subscriptionType: string): Promise<boolean> => {
  if (Platform.OS !== 'web') return false;
  
  try {
    await AsyncStorage.setItem('webPremiumStatus', 'true');
    await AsyncStorage.setItem('webSubscriptionType', subscriptionType);
    await AsyncStorage.setItem('webPurchaseDate', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Error simulating premium purchase:', error);
    return false;
  }
};

// For web platform, simulate restoring purchases
export const simulateRestorePurchases = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') return false;
  
  try {
    const webPremiumStatus = await AsyncStorage.getItem('webPremiumStatus');
    return webPremiumStatus === 'true';
  } catch (error) {
    console.error('Error simulating restore purchases:', error);
    return false;
  }
};

// For web platform, simulate canceling subscription
export const simulateCancelSubscription = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') return false;
  
  try {
    await AsyncStorage.removeItem('webPremiumStatus');
    await AsyncStorage.removeItem('webSubscriptionType');
    await AsyncStorage.removeItem('webPurchaseDate');
    return true;
  } catch (error) {
    console.error('Error simulating cancel subscription:', error);
    return false;
  }
};

// Get subscription details for web platform
export const getWebSubscriptionDetails = async (): Promise<{
  isActive: boolean;
  type: string | null;
  purchaseDate: string | null;
}> => {
  if (Platform.OS !== 'web') {
    return { isActive: false, type: null, purchaseDate: null };
  }
  
  try {
    const isActive = await AsyncStorage.getItem('webPremiumStatus') === 'true';
    const type = await AsyncStorage.getItem('webSubscriptionType');
    const purchaseDate = await AsyncStorage.getItem('webPurchaseDate');
    
    return { isActive, type, purchaseDate };
  } catch (error) {
    console.error('Error getting web subscription details:', error);
    return { isActive: false, type: null, purchaseDate: null };
  }
};

// Format subscription type for display
export const formatSubscriptionType = (type: string | null): string => {
  if (!type) return 'None';
  
  switch (type) {
    case SUBSCRIPTION_TYPES.MONTHLY:
      return 'Monthly';
    case SUBSCRIPTION_TYPES.ANNUAL:
      return 'Annual';
    case SUBSCRIPTION_TYPES.LIFETIME:
      return 'Lifetime';
    default:
      return type;
  }
};

// Calculate expiration date based on purchase date and subscription type
export const calculateExpirationDate = (purchaseDate: string | null, type: string | null): string | null => {
  if (!purchaseDate || !type) return null;
  
  const date = new Date(purchaseDate);
  
  switch (type) {
    case SUBSCRIPTION_TYPES.MONTHLY:
      date.setMonth(date.getMonth() + 1);
      break;
    case SUBSCRIPTION_TYPES.ANNUAL:
      date.setFullYear(date.getFullYear() + 1);
      break;
    case SUBSCRIPTION_TYPES.LIFETIME:
      return 'Never';
    default:
      return null;
  }
  
  return date.toLocaleDateString();
};