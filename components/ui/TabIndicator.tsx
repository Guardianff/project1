import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  interpolate
} from 'react-native-reanimated';

interface TabIndicatorProps {
  activeIndex: number;
  tabCount: number;
  containerWidth: number;
}

export function TabIndicator({ activeIndex, tabCount, containerWidth }: TabIndicatorProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    const tabWidth = containerWidth / tabCount;
    translateX.value = withSpring(activeIndex * tabWidth + tabWidth / 2 - 20, {
      damping: 15,
      stiffness: 200,
    });
    
    scale.value = withSpring(1.2, { damping: 10, stiffness: 100 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    }, 150);
  }, [activeIndex, containerWidth, tabCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
  }));

  return (
    <Animated.View 
      style={[
        styles.indicator, 
        { backgroundColor: colors.primary[500] },
        animatedStyle
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: -2,
    width: 40,
    height: 3,
    borderRadius: 2,
  },
});