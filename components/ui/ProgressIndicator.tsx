import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withSpring,
  interpolate,
  Easing
} from 'react-native-reanimated';

interface ProgressIndicatorProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular' | 'ring';
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  style?: ViewStyle;
  thickness?: number;
}

export function ProgressIndicator({
  progress,
  size = 'md',
  variant = 'linear',
  color,
  backgroundColor,
  showLabel = true,
  label,
  animated = true,
  style,
  thickness,
}: ProgressIndicatorProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const animatedProgress = useSharedValue(0);
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(progress, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      });
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    } else {
      animatedProgress.value = progress;
      scale.value = 1;
    }
  }, [progress, animated]);

  const progressColor = color || colors.primary[500];
  const bgColor = backgroundColor || colors.neutral[200];

  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'sm':
        return { height: 4, circularSize: 40, fontSize: 10 };
      case 'lg':
        return { height: 12, circularSize: 120, fontSize: 18 };
      case 'md':
      default:
        return { height: 8, circularSize: 80, fontSize: 14 };
    }
  };

  const dimensions = getSizeDimensions();
  const strokeWidth = thickness || (dimensions.height / 2);

  // Linear progress bar
  const renderLinearProgress = () => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: `${animatedProgress.value}%`,
        transform: [{ scale: scale.value }],
      };
    });

    const containerStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    return (
      <View style={[styles.container, style]}>
        <Animated.View
          style={[
            styles.linearContainer,
            {
              height: dimensions.height,
              backgroundColor: bgColor,
              borderRadius: dimensions.height / 2,
            },
            containerStyle,
          ]}
        >
          <Animated.View
            style={[
              styles.linearProgress,
              {
                height: dimensions.height,
                backgroundColor: progressColor,
                borderRadius: dimensions.height / 2,
              },
              animatedStyle,
            ]}
          />
        </Animated.View>
        {showLabel && (
          <Text style={[styles.label, { fontSize: dimensions.fontSize, color: colors.text }]}>
            {label || `${Math.round(progress)}%`}
          </Text>
        )}
      </View>
    );
  };

  // Circular progress
  const renderCircularProgress = () => {
    const radius = (dimensions.circularSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const animatedStyle = useAnimatedStyle(() => {
      const strokeDashoffset = circumference - (animatedProgress.value / 100) * circumference;
      return {
        strokeDashoffset,
        transform: [{ scale: scale.value }],
      };
    });

    const containerStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    return (
      <View style={[styles.container, style]}>
        <Animated.View
          style={[
            styles.circularContainer,
            {
              width: dimensions.circularSize,
              height: dimensions.circularSize,
            },
            containerStyle,
          ]}
        >
          <svg
            width={dimensions.circularSize}
            height={dimensions.circularSize}
            style={styles.svg}
          >
            {/* Background circle */}
            <circle
              cx={dimensions.circularSize / 2}
              cy={dimensions.circularSize / 2}
              r={radius}
              stroke={bgColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <Animated.View style={animatedStyle}>
              <circle
                cx={dimensions.circularSize / 2}
                cy={dimensions.circularSize / 2}
                r={radius}
                stroke={progressColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeLinecap="round"
                transform={`rotate(-90 ${dimensions.circularSize / 2} ${dimensions.circularSize / 2})`}
              />
            </Animated.View>
          </svg>
          {showLabel && (
            <View style={styles.circularLabel}>
              <Text style={[styles.label, { fontSize: dimensions.fontSize, color: colors.text }]}>
                {label || `${Math.round(progress)}%`}
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  // Ring progress (simplified circular)
  const renderRingProgress = () => {
    const animatedStyle = useAnimatedStyle(() => {
      const rotation = interpolate(animatedProgress.value, [0, 100], [0, 360]);
      return {
        transform: [
          { scale: scale.value },
          { rotate: `${rotation}deg` },
        ],
      };
    });

    return (
      <View style={[styles.container, style]}>
        <Animated.View
          style={[
            styles.ringContainer,
            {
              width: dimensions.circularSize,
              height: dimensions.circularSize,
              borderRadius: dimensions.circularSize / 2,
              borderWidth: strokeWidth,
              borderColor: bgColor,
            },
            animatedStyle,
          ]}
        >
          <View
            style={[
              styles.ringProgress,
              {
                width: dimensions.circularSize - strokeWidth * 2,
                height: dimensions.circularSize - strokeWidth * 2,
                borderRadius: (dimensions.circularSize - strokeWidth * 2) / 2,
                borderTopWidth: strokeWidth,
                borderTopColor: progressColor,
              },
            ]}
          />
        </Animated.View>
        {showLabel && (
          <View style={styles.ringLabel}>
            <Text style={[styles.label, { fontSize: dimensions.fontSize, color: colors.text }]}>
              {label || `${Math.round(progress)}%`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  switch (variant) {
    case 'circular':
      return renderCircularProgress();
    case 'ring':
      return renderRingProgress();
    case 'linear':
    default:
      return renderLinearProgress();
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  linearContainer: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 8,
  },
  linearProgress: {
    height: '100%',
  },
  circularContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  circularLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ringProgress: {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  ringLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
});