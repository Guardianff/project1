import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/context/ThemeContext';
import { AIProvider } from '@/context/AIContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AIProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="ai-assistant" options={{ presentation: 'modal' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
            <Stack.Screen name="categories" options={{ headerShown: false }} />
            <Stack.Screen name="categories/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </AIProvider>
    </ThemeProvider>
  );
}