import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chrome as Home, BookOpen, Calendar, FolderOpen, User } from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { AIFloatingButton } from '@/components/ai/AIFloatingButton';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

// Import your Bolt Logo
const boltLogo = require('@/assets/images/Bolt Logo.jpg');

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
  icon: React.ReactNode;
  label: string;
}

function AnimatedTabIcon({ focused, color, size, icon, label }: TabIconProps) {
  const scale = useSharedValue(focused ? 1.1 : 1);
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, {
      damping: 15,
      stiffness: 200,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.tabIconContainer, animatedStyle]}>
      <View style={[
        styles.tabIconWrapper,
        focused && {
          backgroundColor: colors.primary[50],
          shadowColor: colors.primary[500],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }
      ]}>
        {React.cloneElement(icon as React.ReactElement, {
          color: focused ? colors.primary[600] : color,
          size: size,
          strokeWidth: focused ? 2.5 : 2,
        })}
      </View>
      {focused && (
        <Text style={[styles.tabLabel, { color: colors.primary[600] }]}>
          {label}
        </Text>
      )}
    </Animated.View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary[600],
          tabBarInactiveTintColor: colors.neutral[400],
          tabBarStyle: {
            ...styles.tabBar,
            backgroundColor: colors.background,
            borderTopColor: colors.divider,
            height: Platform.OS === 'ios' ? 90 + insets.bottom : 75,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom + 5 : 15,
            paddingTop: 15,
            paddingHorizontal: 10,
            shadowColor: colors.neutral[900],
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDarkMode ? 0.3 : 0.1,
            shadowRadius: 16,
            elevation: 16,
          },
          tabBarLabelStyle: {
            display: 'none', // Hide default labels since we're using custom ones
          },
          tabBarIconStyle: styles.tabBarIcon,
          tabBarItemStyle: styles.tabBarItem,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, color, size }) => (
              <AnimatedTabIcon
                focused={focused}
                color={color}
                size={size}
                icon={<Home />}
                label="Home"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            title: 'Courses',
            tabBarIcon: ({ focused, color, size }) => (
              <AnimatedTabIcon
                focused={focused}
                color={color}
                size={size}
                icon={<BookOpen />}
                label="Courses"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="coaching"
          options={{
            title: 'Coaching',
            tabBarIcon: ({ focused, color, size }) => (
              <AnimatedTabIcon
                focused={focused}
                color={color}
                size={size}
                icon={<Calendar />}
                label="Coaching"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="resources"
          options={{
            title: 'Resources',
            tabBarIcon: ({ focused, color, size }) => (
              <AnimatedTabIcon
                focused={focused}
                color={color}
                size={size}
                icon={<FolderOpen />}
                label="Resources"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, color, size }) => (
              <AnimatedTabIcon
                focused={focused}
                color={color}
                size={size}
                icon={<User />}
                label="Profile"
              />
            ),
          }}
        />
      </Tabs>
      
      {/* AI Floating Button */}
      <AIFloatingButton />

      {/* Bolt Badge at the bottom of all tabs */}
      <View style={styles.boltBadgeContainer}>
        <Image
          source={boltLogo}
          style={styles.boltBadge}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    borderTopWidth: 0.5,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarIcon: {
    marginBottom: 0,
  },
  tabBarItem: {
    paddingVertical: 5,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  tabIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  boltBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
    marginTop: 4,
  },
  boltBadge: {
    width: 60,      // Adjust size as needed
    height: 32,
  },
});