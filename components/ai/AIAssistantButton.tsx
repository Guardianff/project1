import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated as RNAnimated,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bot, Sparkles, MessageCircle, X } from 'lucide-react-native';
import { useAIAgent } from '@/context/AIAgentContext';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface AIAssistantButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  showBubble?: boolean;
}

export function AIAssistantButton({
  position = 'bottom-right',
  size = 'medium',
  showBubble = true,
}: AIAssistantButtonProps) {
  const router = useRouter();
  const { 
    isActive, 
    learningInsights, 
    getPersonalizedGreeting,
    dismissInsight
  } = useAIAgent();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentInsight, setCurrentInsight] = useState<any>(null);
  
  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.7);
  const messageOpacity = useSharedValue(0);
  
  // Get button size based on prop
  const getButtonSize = () => {
    switch (size) {
      case 'small': return 48;
      case 'large': return 64;
      case 'medium':
      default: return 56;
    }
  };
  
  // Get position styles
  const getPositionStyle = () => {
    const buttonSize = getButtonSize();
    const positions = {
      'bottom-right': { bottom: 100, right: 20 },
      'bottom-left': { bottom: 100, left: 20 },
      'top-right': { top: 100, right: 20 },
      'top-left': { top: 100, left: 20 },
    };
    
    return positions[position];
  };

  // Handle button press
  const handlePress = () => {
    // Add haptic feedback for web
    if (Platform.OS === 'web' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    if (showMessage) {
      setShowMessage(false);
      messageOpacity.value = withTiming(0, { duration: 300 });
    } else {
      router.push('/ai-assistant');
    }
  };
  
  // Handle message bubble press
  const handleMessagePress = () => {
    if (currentInsight) {
      dismissInsight(currentInsight.id);
      setCurrentInsight(null);
    }
    setShowMessage(false);
    messageOpacity.value = withTiming(0, { duration: 300 });
    router.push('/ai-assistant');
  };
  
  // Handle close button press
  const handleClosePress = () => {
    if (currentInsight) {
      dismissInsight(currentInsight.id);
      setCurrentInsight(null);
    }
    setShowMessage(false);
    messageOpacity.value = withTiming(0, { duration: 300 });
  };

  // Set up animations
  useEffect(() => {
    if (isActive) {
      // Subtle pulse animation
      pulseOpacity.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      // Occasional wiggle animation
      const wiggleInterval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance to wiggle
          rotate.value = withTiming(10, { duration: 200 }, () => {
            rotate.value = withTiming(-10, { duration: 400 }, () => {
              rotate.value = withTiming(0, { duration: 200 });
            });
          });
        }
      }, 10000);
      
      return () => clearInterval(wiggleInterval);
    }
  }, [isActive]);
  
  // Show insights periodically
  useEffect(() => {
    if (!isActive || !showBubble) return;
    
    // Show greeting on first load
    setTimeout(() => {
      setCurrentMessage(getPersonalizedGreeting());
      setShowMessage(true);
      messageOpacity.value = withTiming(1, { duration: 500 });
      
      // Hide after 5 seconds
      setTimeout(() => {
        setShowMessage(false);
        messageOpacity.value = withTiming(0, { duration: 300 });
      }, 5000);
    }, 2000);
    
    // Show insights periodically
    const insightInterval = setInterval(() => {
      if (learningInsights.length > 0 && Math.random() > 0.5) { // 50% chance to show an insight
        const highPriorityInsights = learningInsights.filter(i => i.priority === 'high');
        const mediumPriorityInsights = learningInsights.filter(i => i.priority === 'medium');
        
        let insightToShow;
        if (highPriorityInsights.length > 0) {
          insightToShow = highPriorityInsights[Math.floor(Math.random() * highPriorityInsights.length)];
        } else if (mediumPriorityInsights.length > 0) {
          insightToShow = mediumPriorityInsights[Math.floor(Math.random() * mediumPriorityInsights.length)];
        } else if (learningInsights.length > 0) {
          insightToShow = learningInsights[Math.floor(Math.random() * learningInsights.length)];
        }
        
        if (insightToShow) {
          setCurrentInsight(insightToShow);
          setCurrentMessage(insightToShow.title);
          setShowMessage(true);
          messageOpacity.value = withTiming(1, { duration: 500 });
          
          // Hide after 8 seconds
          setTimeout(() => {
            setShowMessage(false);
            messageOpacity.value = withTiming(0, { duration: 300 });
            setCurrentInsight(null);
          }, 8000);
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(insightInterval);
  }, [isActive, showBubble, learningInsights, getPersonalizedGreeting]);

  // Animated styles
  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value * 0.3,
      transform: [
        { scale: interpolate(pulseOpacity.value, [0.7, 1], [1, 1.5]) },
      ],
    };
  });
  
  const messageStyle = useAnimatedStyle(() => {
    return {
      opacity: messageOpacity.value,
      transform: [
        { 
          translateY: interpolate(
            messageOpacity.value, 
            [0, 1], 
            [10, 0]
          ) 
        },
      ],
    };
  });

  const buttonSize = getButtonSize();
  const positionStyle = getPositionStyle();

  return (
    <>
      {/* Message Bubble */}
      {showBubble && (
        <Animated.View 
          style={[
            styles.messageBubble,
            {
              ...getMessagePosition(position, buttonSize),
              backgroundColor: colors.primary[50],
              borderColor: colors.primary[200],
            },
            messageStyle,
          ]}
        >
          <Text style={[styles.messageText, { color: colors.primary[700] }]}>
            {currentMessage}
          </Text>
          <View style={styles.messageActions}>
            <TouchableOpacity 
              style={[styles.messageAction, { backgroundColor: colors.primary[500] }]}
              onPress={handleMessagePress}
            >
              <MessageCircle size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.messageAction, { backgroundColor: colors.neutral[300] }]}
              onPress={handleClosePress}
            >
              <X size={16} color="white" />
            </TouchableOpacity>
          </View>
          <View 
            style={[
              styles.messageTip,
              getMessageTipStyle(position),
              { backgroundColor: colors.primary[50] },
              position.includes('right') ? { borderRightColor: colors.primary[50] } : { borderLeftColor: colors.primary[50] }
            ]} 
          />
        </Animated.View>
      )}
      
      {/* Button */}
      <View style={[styles.container, positionStyle]}>
        {/* Pulse Effect */}
        {isActive && (
          <Animated.View
            style={[
              styles.pulse,
              { 
                width: buttonSize, 
                height: buttonSize,
                borderRadius: buttonSize / 2,
                backgroundColor: colors.primary[500],
              },
              pulseStyle,
            ]}
          />
        )}
        
        {/* Main Button */}
        <Animated.View style={[buttonStyle]}>
          <TouchableOpacity
            style={[
              styles.button,
              { 
                width: buttonSize, 
                height: buttonSize,
                borderRadius: buttonSize / 2,
                backgroundColor: colors.primary[500],
              },
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Sparkles size={buttonSize * 0.5} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}

// Helper function to get message bubble position
function getMessagePosition(position: string, buttonSize: number) {
  const bubbleWidth = 220;
  
  switch (position) {
    case 'bottom-right':
      return { bottom: 100 + buttonSize + 10, right: 20 };
    case 'bottom-left':
      return { bottom: 100 + buttonSize + 10, left: 20 };
    case 'top-right':
      return { top: 100 + buttonSize + 10, right: 20 };
    case 'top-left':
      return { top: 100 + buttonSize + 10, left: 20 };
    default:
      return { bottom: 100 + buttonSize + 10, right: 20 };
  }
}

// Helper function to get message tip style
function getMessageTipStyle(position: string) {
  switch (position) {
    case 'bottom-right':
      return { 
        bottom: -10, 
        right: 20, 
        borderTopWidth: 10, 
        borderRightWidth: 10, 
        borderBottomWidth: 0, 
        borderLeftWidth: 10, 
        borderTopColor: 'transparent', 
        borderBottomColor: 'transparent', 
        borderLeftColor: 'transparent',
      };
    case 'bottom-left':
      return { 
        bottom: -10, 
        left: 20, 
        borderTopWidth: 10, 
        borderRightWidth: 10, 
        borderBottomWidth: 0, 
        borderLeftWidth: 10, 
        borderTopColor: 'transparent', 
        borderBottomColor: 'transparent', 
        borderRightColor: 'transparent',
      };
    case 'top-right':
      return { 
        top: -10, 
        right: 20, 
        borderTopWidth: 0, 
        borderRightWidth: 10, 
        borderBottomWidth: 10, 
        borderLeftWidth: 10, 
        borderRightColor: 'transparent', 
        borderBottomColor: 'transparent', 
        borderLeftColor: 'transparent',
      };
    case 'top-left':
      return { 
        top: -10, 
        left: 20, 
        borderTopWidth: 0, 
        borderRightWidth: 10, 
        borderBottomWidth: 10, 
        borderLeftWidth: 10, 
        borderRightColor: 'transparent', 
        borderBottomColor: 'transparent', 
        borderLeftColor: 'transparent',
      };
    default:
      return { 
        bottom: -10, 
        right: 20, 
        borderTopWidth: 10, 
        borderRightWidth: 10, 
        borderBottomWidth: 0, 
        borderLeftWidth: 10, 
        borderTopColor: 'transparent', 
        borderBottomColor: 'transparent', 
        borderLeftColor: 'transparent',
      };
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  pulse: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  messageBubble: {
    position: 'absolute',
    width: 220,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    zIndex: 999,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  messageAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageTip: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
});