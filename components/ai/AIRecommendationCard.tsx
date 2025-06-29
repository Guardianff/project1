import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  BookOpen, 
  FileText, 
  Users, 
  Compass, 
  Dumbbell, 
  ChevronRight, 
  Star, 
  Clock 
} from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { Badge } from '@/components/ui/Badge';

interface AIRecommendationCardProps {
  recommendation: {
    id: string;
    type: 'course' | 'resource' | 'coach' | 'learning_path' | 'exercise';
    title: string;
    description: string;
    reason: string;
    itemId: string;
    confidence: number;
    timestamp: Date;
    metadata?: {
      imageUrl?: string;
      duration?: number;
      level?: string;
      instructor?: string;
      rating?: number;
      tags?: string[];
    };
  };
  onPress?: () => void;
}

export function AIRecommendationCard({ recommendation, onPress }: AIRecommendationCardProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const getRecommendationIcon = () => {
    switch (recommendation.type) {
      case 'course':
        return <BookOpen size={24} color={colors.primary[500]} />;
      case 'resource':
        return <FileText size={24} color={colors.success[500]} />;
      case 'coach':
        return <Users size={24} color={colors.accent[500]} />;
      case 'learning_path':
        return <Compass size={24} color={colors.secondary[500]} />;
      case 'exercise':
        return <Dumbbell size={24} color={colors.warning[500]} />;
      default:
        return <BookOpen size={24} color={colors.primary[500]} />;
    }
  };
  
  const getRecommendationColor = () => {
    switch (recommendation.type) {
      case 'course':
        return colors.primary;
      case 'resource':
        return colors.success;
      case 'coach':
        return colors.accent;
      case 'learning_path':
        return colors.secondary;
      case 'exercise':
        return colors.warning;
      default:
        return colors.primary;
    }
  };
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate based on recommendation type
      switch (recommendation.type) {
        case 'course':
          router.push(`/course/${recommendation.itemId}`);
          break;
        case 'resource':
          router.push(`/resources/${recommendation.itemId}`);
          break;
        case 'coach':
          router.push(`/coaching/${recommendation.itemId}`);
          break;
        case 'learning_path':
          router.push(`/learning-path/${recommendation.itemId}`);
          break;
        case 'exercise':
          router.push(`/exercise/${recommendation.itemId}`);
          break;
        default:
          break;
      }
    }
  };
  
  const recommendationColor = getRecommendationColor();
  const metadata = recommendation.metadata || {};
  
  return (
    <EnhancedCard
      variant="elevated"
      interactive
      glowEffect
      onPress={handlePress}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: recommendationColor[50] }]}>
            {getRecommendationIcon()}
          </View>
          
          <View style={styles.headerContent}>
            <Badge
              label={recommendation.type.replace('_', ' ')}
              variant="neutral"
              size="small"
              style={{ backgroundColor: `${recommendationColor[100]}` }}
              textStyle={{ color: recommendationColor[700] }}
            />
            
            <View style={styles.confidenceContainer}>
              <View 
                style={[
                  styles.confidenceMeter, 
                  { backgroundColor: colors.neutral[200] }
                ]}
              >
                <View 
                  style={[
                    styles.confidenceFill, 
                    { 
                      backgroundColor: recommendationColor[500],
                      width: `${recommendation.confidence * 100}%` 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>
                {Math.round(recommendation.confidence * 100)}% match
              </Text>
            </View>
          </View>
        </View>
        
        {metadata.imageUrl && (
          <Image 
            source={{ uri: metadata.imageUrl }} 
            style={styles.image}
          />
        )}
        
        <Text style={[styles.title, { color: colors.text }]}>
          {recommendation.title}
        </Text>
        
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {recommendation.description}
        </Text>
        
        <View style={styles.reasonContainer}>
          <Text style={[styles.reasonLabel, { color: recommendationColor[700] }]}>
            Why we recommend this:
          </Text>
          <Text style={[styles.reasonText, { color: colors.text }]}>
            {recommendation.reason}
          </Text>
        </View>
        
        {metadata && (
          <View style={styles.metadataContainer}>
            {metadata.rating && (
              <View style={styles.metadataItem}>
                <Star size={14} color={colors.warning[500]} fill={colors.warning[500]} />
                <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                  {metadata.rating}
                </Text>
              </View>
            )}
            
            {metadata.duration && (
              <View style={styles.metadataItem}>
                <Clock size={14} color={colors.neutral[500]} />
                <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                  {metadata.duration} min
                </Text>
              </View>
            )}
            
            {metadata.level && (
              <View style={styles.metadataItem}>
                <Badge
                  label={metadata.level}
                  variant="neutral"
                  size="small"
                />
              </View>
            )}
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.exploreText, { color: recommendationColor[600] }]}>
            Explore {recommendation.type.replace('_', ' ')}
          </Text>
          <ChevronRight size={16} color={recommendationColor[600]} />
        </View>
      </View>
    </EnhancedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  confidenceContainer: {
    marginTop: 8,
  },
  confidenceMeter: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  reasonContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 20,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 12,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  exploreText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});