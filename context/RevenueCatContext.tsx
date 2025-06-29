import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Purchases from 'react-native-purchases';
import { CustomerInfo, PurchasesPackage, PurchasesError } from 'react-native-purchases';
import { supabase } from '@/lib/supabase';

// RevenueCat API keys
const REVENUECAT_API_KEYS = {
  ios: 'YOUR_IOS_API_KEY',
  android: 'YOUR_ANDROID_API_KEY',
};

// Product IDs for each platform
const PRODUCT_IDS = {
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

// Entitlement IDs
const ENTITLEMENT_ID = 'premium';

interface RevenueCatContextType {
  isInitialized: boolean;
  isPremium: boolean;
  currentOffering: Purchases.Offering | null;
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  purchasePackage: (packageToPurchase: PurchasesPackage) => Promise<void>;
  purchaseMonthly: () => Promise<void>;
  purchaseAnnual: () => Promise<void>;
  purchaseLifetime: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  getOfferings: () => Promise<void>;
  logout: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentOffering, setCurrentOffering] = useState<Purchases.Offering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize RevenueCat
  useEffect(() => {
    const initializeRevenueCat = async () => {
      if (Platform.OS === 'web') {
        console.log('RevenueCat is not supported on web');
        setIsInitialized(true);
        return;
      }

      try {
        // Configure RevenueCat SDK
        const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : REVENUECAT_API_KEYS.android;
        
        Purchases.configure({
          apiKey,
          appUserID: null, // This will use an anonymous ID initially
          observerMode: false, // Set to true if you have your own IAP implementation
          useAmazon: false, // Set to true if you're using Amazon Appstore
        });

        // Get current user from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        // If user is logged in, identify them in RevenueCat
        if (user) {
          await Purchases.logIn(user.id);
        }

        // Set up listener for purchases
        Purchases.addCustomerInfoUpdateListener((info) => {
          setCustomerInfo(info);
          checkPremiumStatus(info);
        });

        // Get initial offerings
        await getOfferings();
        
        // Get initial customer info
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
        checkPremiumStatus(info);

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing RevenueCat:', error);
        // Still mark as initialized to prevent blocking the app
        setIsInitialized(true);
      }
    };

    initializeRevenueCat();

    // Clean up listener on unmount
    return () => {
      if (Platform.OS !== 'web') {
        Purchases.removeCustomerInfoUpdateListener();
      }
    };
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (Platform.OS === 'web') return;

        if (event === 'SIGNED_IN' && session?.user) {
          // User signed in, identify them in RevenueCat
          try {
            await Purchases.logIn(session.user.id);
            const info = await Purchases.getCustomerInfo();
            setCustomerInfo(info);
            checkPremiumStatus(info);
          } catch (error) {
            console.error('Error identifying user in RevenueCat:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          // User signed out, reset to anonymous ID
          try {
            await Purchases.logOut();
            const info = await Purchases.getCustomerInfo();
            setCustomerInfo(info);
            checkPremiumStatus(info);
          } catch (error) {
            console.error('Error logging out from RevenueCat:', error);
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Check if user has premium entitlement
  const checkPremiumStatus = (info: CustomerInfo) => {
    if (info?.entitlements.active[ENTITLEMENT_ID]) {
      setIsPremium(true);
    } else {
      setIsPremium(false);
    }
  };

  // Get available offerings
  const getOfferings = async () => {
    if (Platform.OS === 'web') {
      console.log('RevenueCat is not supported on web');
      return;
    }

    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setCurrentOffering(offerings.current);
      }
    } catch (error) {
      console.error('Error fetching offerings:', error);
    }
  };

  // Purchase a package
  const purchasePackage = async (packageToPurchase: PurchasesPackage) => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Web Not Supported',
        'In-app purchases are not available on web. Please use our mobile app to subscribe.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      setCustomerInfo(customerInfo);
      checkPremiumStatus(customerInfo);
      
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        Alert.alert('Success', 'Thank you for subscribing to Premium!');
      }
    } catch (error) {
      const purchaseError = error as PurchasesError;
      
      if (!purchaseError.userCancelled) {
        let errorMessage = 'An unknown error occurred';
        
        switch (purchaseError.code) {
          case Purchases.ErrorCode.NetworkError:
            errorMessage = 'Please check your internet connection and try again.';
            break;
          case Purchases.ErrorCode.PurchaseNotAllowedError:
            errorMessage = 'You are not allowed to make this purchase.';
            break;
          case Purchases.ErrorCode.PurchaseInvalidError:
            errorMessage = 'The purchase is invalid.';
            break;
          case Purchases.ErrorCode.ProductNotAvailableForPurchaseError:
            errorMessage = 'This product is not available for purchase.';
            break;
          default:
            errorMessage = purchaseError.message || 'An error occurred during purchase.';
        }
        
        Alert.alert('Purchase Failed', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Purchase monthly subscription
  const purchaseMonthly = async () => {
    if (!currentOffering || !currentOffering.monthly) {
      Alert.alert('Error', 'Monthly subscription is not available at this time.');
      return;
    }
    await purchasePackage(currentOffering.monthly);
  };

  // Purchase annual subscription
  const purchaseAnnual = async () => {
    if (!currentOffering || !currentOffering.annual) {
      Alert.alert('Error', 'Annual subscription is not available at this time.');
      return;
    }
    await purchasePackage(currentOffering.annual);
  };

  // Purchase lifetime subscription
  const purchaseLifetime = async () => {
    if (!currentOffering) {
      Alert.alert('Error', 'Lifetime subscription is not available at this time.');
      return;
    }
    
    // Find the lifetime package in the offering
    const lifetimePackage = currentOffering.availablePackages.find(
      pkg => pkg.identifier.includes('lifetime')
    );
    
    if (!lifetimePackage) {
      Alert.alert('Error', 'Lifetime subscription is not available at this time.');
      return;
    }
    
    await purchasePackage(lifetimePackage);
  };

  // Restore purchases
  const restorePurchases = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Web Not Supported',
        'Restoring purchases is not available on web. Please use our mobile app.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      setCustomerInfo(customerInfo);
      checkPremiumStatus(customerInfo);
      
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        Alert.alert('Success', 'Your premium subscription has been restored!');
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous premium purchases to restore.');
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert('Restore Failed', 'There was an error restoring your purchases. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout from RevenueCat
  const logout = async () => {
    if (Platform.OS === 'web') return;
    
    try {
      await Purchases.logOut();
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      checkPremiumStatus(info);
    } catch (error) {
      console.error('Error logging out from RevenueCat:', error);
    }
  };

  // For web platform, simulate premium status with AsyncStorage
  useEffect(() => {
    if (Platform.OS === 'web') {
      const checkWebPremiumStatus = async () => {
        try {
          const webPremiumStatus = await AsyncStorage.getItem('webPremiumStatus');
          setIsPremium(webPremiumStatus === 'true');
        } catch (error) {
          console.error('Error checking web premium status:', error);
        }
      };
      
      checkWebPremiumStatus();
    }
  }, []);

  const value = {
    isInitialized,
    isPremium,
    currentOffering,
    customerInfo,
    isLoading,
    purchasePackage,
    purchaseMonthly,
    purchaseAnnual,
    purchaseLifetime,
    restorePurchases,
    getOfferings,
    logout,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
}