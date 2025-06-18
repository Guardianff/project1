import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useAI } from '@/context/AIContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withRepeat,
  withSequence
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function AIFloatingButton() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { showAI } = useAI();
  
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Breathing animation
  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 10 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  const handlePress = () => {
    rotation.value = withSpring(rotation.value + 360);
    router.push('/ai-assistant');
  };

  return (
    <AnimatedTouchable
      style={[
        styles.floatingButton,
        {
          backgroundColor: colors.primary[500],
          bottom: Platform.OS === 'ios' ? 100 + insets.bottom : 90,
          shadowColor: colors.primary[500],
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Sparkles size={28} color="white" />
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
});