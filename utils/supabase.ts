import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // Required for Supabase client in React Native

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
