import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// URL and key should come from environment variables in a real app
const supabaseUrl = 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

// Custom storage implementation for Supabase
const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    return Platform.OS !== 'web'
      ? SecureStore.getItemAsync(key)
      : AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    return Platform.OS !== 'web'
      ? SecureStore.setItemAsync(key, value)
      : AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    return Platform.OS !== 'web'
      ? SecureStore.deleteItemAsync(key)
      : AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});