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
            <Stack.Screen name="profile-integration" options={{ headerShown: false }} />
            <Stack.Screen name="goals" options={{ headerShown: false }} />
            <Stack.Screen name="fitness" options={{ headerShown: false }} />
            <Stack.Screen name="passion-projects" options={{ headerShown: false }} />
            <Stack.Screen name="daily-plan" options={{ headerShown: false }} />
            <Stack.Screen name="premium" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </AIProvider>
    </ThemeProvider>
  );
}