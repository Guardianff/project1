import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';

interface FloatingActionButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  offset?: { bottom?: number; right?: number; left?: number };
  pulse?: boolean;
  glow?: boolean;
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function FloatingActionButton({
  children,
  onPress,
  size = 'md',
  variant = 'primary',
  position = 'bottom-right',
  offset = {},
  pulse = false,
  glow = false,
  disabled = false,
}: FloatingActionButtonProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  // Animation values
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Start pulse animation
  React.useEffect(() => {
    if (pulse) {
      pulseScale.value = withRepeat(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [pulse]);

  // Start glow animation
  React.useEffect(() => {
    if (glow) {
      glowOpacity.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [glow]);

  // Get size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { width: 48, height: 48, borderRadius: 24 };
      case 'lg':
        return { width: 72, height: 72, borderRadius: 36 };
      case 'md':
      default:
        return { width: 60, height: 60, borderRadius: 30 };
    }
  };

  // Get variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary[500] };
      case 'accent':
        return { backgroundColor: colors.accent[500] };
      case 'primary':
      default:
        return { backgroundColor: colors.primary[500] };
    }
  };

  // Get position styles
  const getPositionStyle = () => {
    const defaultOffset = { bottom: 100, right: 20, left: 20 };
    
    switch (position) {
      case 'bottom-left':
        return {
          position: 'absolute' as const,
          bottom: offset.bottom || defaultOffset.bottom,
          left: offset.left || defaultOffset.left,
        };
      case 'bottom-center':
        return {
          position: 'absolute' as const,
          bottom: offset.bottom || defaultOffset.bottom,
          left: '50%',
          marginLeft: -30, // Half of default width
        };
      case 'bottom-right':
      default:
        return {
          position: 'absolute' as const,
          bottom: offset.bottom || defaultOffset.bottom,
          right: offset.right || defaultOffset.right,
        };
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value * pulseScale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value * 0.6,
      shadowOpacity: glowOpacity.value * 0.8,
    };
  });

  // Interaction handlers
  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
    rotation.value = withSpring(15, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    rotation.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled) return;
    
    // Add a little bounce effect on press
    scale.value = withSpring(1.1, { damping: 10, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, 100);
    
    onPress();
  };

  return (
    <>
      {/* Glow effect */}
      {glow && (
        <Animated.View
          style={[
            styles.glow,
            getSizeStyle(),
            getPositionStyle(),
            getVariantStyle(),
            glowStyle,
            {
              shadowColor: getVariantStyle().backgroundColor,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 20,
              elevation: 10,
            },
          ]}
        />
      )}
      
      {/* Main button */}
      <AnimatedTouchable
        style={[
          styles.fab,
          getSizeStyle(),
          getPositionStyle(),
          getVariantStyle(),
          animatedStyle,
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        {children}
      </AnimatedTouchable>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  glow: {
    position: 'absolute',
    zIndex: 999,
  },
  disabled: {
    opacity: 0.6,
  },
});
