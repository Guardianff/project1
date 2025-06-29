import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

// Mock RevenueCat types for web environment
interface CustomerInfo {
  entitlements: {
    active: Record<string, any>;
  };
}

interface PurchasesPackage {
  identifier: string;
}

interface Offering {
  identifier: string;
  monthly?: PurchasesPackage;
  annual?: PurchasesPackage;
  availablePackages: PurchasesPackage[];
}

interface PurchasesError {
  code: number;
  message: string;
  userCancelled: boolean;
}

// RevenueCat context type
interface RevenueCatContextType {
  isInitialized: boolean;
  isPremium: boolean;
  currentOffering: Offering | null;
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

// Create context with undefined default value
const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

// Premium entitlement ID
const ENTITLEMENT_ID = 'premium';

// Error codes for web simulation
const ErrorCode = {
  NetworkError: 1,
  PurchaseNotAllowedError: 2,
  PurchaseInvalidError: 3,
  ProductNotAvailableForPurchaseError: 4,
};

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentOffering, setCurrentOffering] = useState<Offering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize RevenueCat or mock implementation
  useEffect(() => {
    const initialize = async () => {
      try {
        if (Platform.OS === 'web') {
          // Web implementation - use AsyncStorage to simulate premium status
          const premiumStatus = await AsyncStorage.getItem('webPremiumStatus');
          setIsPremium(premiumStatus === 'true');
          
          // Create mock offering for web
          setCurrentOffering({
            identifier: 'default',
            monthly: { identifier: 'monthly' },
            annual: { identifier: 'annual' },
            availablePackages: [
              { identifier: 'monthly' },
              { identifier: 'annual' },
              { identifier: 'lifetime' }
            ]
          });
          
          // Create mock customer info
          setCustomerInfo({
            entitlements: {
              active: premiumStatus === 'true' ? { [ENTITLEMENT_ID]: { identifier: ENTITLEMENT_ID } } : {}
            }
          });
        } else {
          // This would be the actual RevenueCat implementation
          // For now, we'll just simulate it since we can't import the actual SDK
          console.log('RevenueCat would be initialized here in a native app');
          
          // Get current user from Supabase
          const { data: { user } } = await supabase.auth.getUser();
          
          // If user is logged in, we would identify them in RevenueCat
          if (user) {
            console.log(`Would identify user ${user.id} in RevenueCat`);
          }
          
          // Simulate premium status for demo
          setIsPremium(false);
          
          // Create mock offering for native
          setCurrentOffering({
            identifier: 'default',
            monthly: { identifier: 'monthly' },
            annual: { identifier: 'annual' },
            availablePackages: [
              { identifier: 'monthly' },
              { identifier: 'annual' },
              { identifier: 'lifetime' }
            ]
          });
          
          // Create mock customer info
          setCustomerInfo({
            entitlements: {
              active: {}
            }
          });
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing RevenueCat:', error);
        setIsInitialized(true); // Still mark as initialized to prevent blocking the app
      }
    };

    initialize();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (Platform.OS === 'web') return;

        if (event === 'SIGNED_IN' && session?.user) {
          // User signed in, would identify them in RevenueCat
          console.log(`Would identify user ${session.user.id} in RevenueCat`);
        } else if (event === 'SIGNED_OUT') {
          // User signed out, would reset to anonymous ID
          console.log('Would log out from RevenueCat');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Get available offerings
  const getOfferings = async () => {
    if (Platform.OS === 'web') {
      console.log('RevenueCat offerings are simulated on web');
      return;
    }

    try {
      // This would call Purchases.getOfferings() in a native app
      console.log('Would fetch offerings from RevenueCat');
    } catch (error) {
      console.error('Error fetching offerings:', error);
    }
  };

  // Purchase a package
  const purchasePackage = async (packageToPurchase: PurchasesPackage) => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Web Not Supported',
        'In-app purchases are not available on web. Please use our mobile app to subscribe.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    try {
      // This would call Purchases.purchasePackage() in a native app
      console.log(`Would purchase package: ${packageToPurchase.identifier}`);
      
      // Simulate successful purchase
      const mockCustomerInfo = {
        entitlements: {
          active: {
            [ENTITLEMENT_ID]: {
              identifier: ENTITLEMENT_ID,
              isActive: true,
              willRenew: packageToPurchase.identifier !== 'lifetime',
              periodType: packageToPurchase.identifier === 'monthly' ? 'NORMAL' : 
                          packageToPurchase.identifier === 'annual' ? 'ANNUAL' : 'LIFETIME',
              latestPurchaseDate: new Date().toISOString(),
              originalPurchaseDate: new Date().toISOString(),
              expirationDate: packageToPurchase.identifier === 'lifetime' ? null : 
                              new Date(Date.now() + (packageToPurchase.identifier === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
            }
          }
        }
      };
      
      setCustomerInfo(mockCustomerInfo);
      setIsPremium(true);
      
      Alert.alert('Success', 'Thank you for subscribing to Premium!');
    } catch (error) {
      // Handle purchase errors
      const purchaseError = error as PurchasesError;
      
      if (!purchaseError.userCancelled) {
        let errorMessage = 'An unknown error occurred';
        
        switch (purchaseError.code) {
          case ErrorCode.NetworkError:
            errorMessage = 'Please check your internet connection and try again.';
            break;
          case ErrorCode.PurchaseNotAllowedError:
            errorMessage = 'You are not allowed to make this purchase.';
            break;
          case ErrorCode.PurchaseInvalidError:
            errorMessage = 'The purchase is invalid.';
            break;
          case ErrorCode.ProductNotAvailableForPurchaseError:
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
        'Restoring purchases is not available on web. Please use our mobile app.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    try {
      // This would call Purchases.restorePurchases() in a native app
      console.log('Would restore purchases from RevenueCat');
      
      // Simulate restore result
      const hasRestoredPurchase = Math.random() > 0.5; // 50% chance of success for demo
      
      if (hasRestoredPurchase) {
        const mockCustomerInfo = {
          entitlements: {
            active: {
              [ENTITLEMENT_ID]: {
                identifier: ENTITLEMENT_ID,
                isActive: true,
                willRenew: true,
                periodType: 'ANNUAL',
                latestPurchaseDate: new Date().toISOString(),
                originalPurchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                expirationDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
              }
            }
          }
        };
        
        setCustomerInfo(mockCustomerInfo);
        setIsPremium(true);
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
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('webPremiumStatus');
      setIsPremium(false);
      return;
    }
    
    try {
      // This would call Purchases.logOut() in a native app
      console.log('Would log out from RevenueCat');
      
      // Reset premium status
      setIsPremium(false);
      setCustomerInfo({
        entitlements: {
          active: {}
        }
      });
    } catch (error) {
      console.error('Error logging out from RevenueCat:', error);
    }
  };

  // Context value
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