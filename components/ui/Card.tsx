import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

interface CardProps {
  title: string;
  description?: string;
  image?: string;
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function Card({ title, description, image, onPress, style, children }: CardProps) {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <Animated.View entering={FadeInUp.duration(400).springify()}>
      <CardContainer 
        style={[styles.container, style]} 
        onPress={onPress}
        activeOpacity={onPress ? 0.9 : 1}
      >
        {image && (
          <Image source={{ uri: image }} style={styles.image} />
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {description && (
            <Text style={styles.description} numberOfLines={3}>{description}</Text>
          )}
          {children}
        </View>
      </CardContainer>
    </Animated.View>
  );
}

interface ProgressCardProps extends CardProps {
  progress: number;
  progressLabel?: string;
}

export function ProgressCard({ 
  progress, 
  progressLabel,
  ...props 
}: ProgressCardProps) {
  return (
    <Card {...props}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progressLabel || `${progress}% complete`}</Text>
      </View>
      {props.children}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    margin: 8,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
