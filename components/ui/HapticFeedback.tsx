import { Platform } from 'react-native';

export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (Platform.OS === 'web') {
    // Web haptic feedback using Vibration API
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(30);
          break;
      }
    }
  } else {
    // For native platforms, you would use expo-haptics here
    // Since this is web-focused, we'll keep it simple
    console.log(`Haptic feedback: ${type}`);
  }
};

export const triggerSelectionFeedback = () => {
  triggerHapticFeedback('light');
};

export const triggerImpactFeedback = () => {
  triggerHapticFeedback('medium');
};

export const triggerNotificationFeedback = () => {
  triggerHapticFeedback('heavy');
};