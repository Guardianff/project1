import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, Video } from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { CoachingSession } from '@/types/course';
import { Button } from '../ui/Button';

interface CoachingSessionsListProps {
  sessions: CoachingSession[];
}

export function CoachingSessionsList({ sessions }: CoachingSessionsListProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderSessionItem = ({ item }: { item: CoachingSession }) => (
    <TouchableOpacity 
      style={[styles.sessionCard, { backgroundColor: colors.background }]}
      onPress={() => router.push(`/coaching/session/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.sessionHeader}>
        <Text style={[styles.sessionTitle, { color: colors.text }]}>{item.title}</Text>
        <View style={styles.coachContainer}>
          <Text style={[styles.withLabel, { color: colors.textSecondary }]}>with </Text>
          <Text style={[styles.coachName, { color: colors.text }]}>{item.coach.name}</Text>
        </View>
      </View>
      
      <View style={styles.sessionMeta}>
        <View style={styles.metaItem}>
          <Calendar size={16} color={colors.neutral[500]} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formatDate(item.date)}</Text>
        </View>
        
        <View style={styles.metaItem}>
          <Clock size={16} color={colors.neutral[500]} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.time} • {item.duration} min</Text>
        </View>
      </View>
      
      <View style={styles.sessionActions}>
        <Button 
          title="Join Meeting" 
          variant="primary" 
          size="small" 
          icon={<Video size={16} color="white" />} 
          iconPosition="left" 
          onPress={() => {}}
          style={[styles.joinButton, { backgroundColor: colors.accent[600] }]}
        />
        
        <Button 
          title="Reschedule" 
          variant="outline" 
          size="small"
          onPress={() => {}}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Upcoming Coaching</Text>
        <TouchableOpacity onPress={() => router.push('/coaching')}>
          <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>View Calendar</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id}
        horizontal={false}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  sessionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sessionHeader: {
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  coachContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  withLabel: {
    fontSize: 14,
  },
  coachName: {
    fontSize: 14,
    fontWeight: '500',
  },
  sessionMeta: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 8,
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  joinButton: {
    // backgroundColor set dynamically
  },
});