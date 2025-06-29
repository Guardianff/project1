import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, Clock, Video, Plus, CalendarCheck, CreditCard as Edit, Book } from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataService } from '@/services/DataService';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function CoachingScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const screenWidth = Dimensions.get('window').width;
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [upcomingCoachingSessions, setUpcomingCoachingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoachingSessions = async () => {
      setLoading(true);
      try {
        // Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          setUpcomingCoachingSessions([]);
          return;
        }

        if (!user) {
          // No authenticated user, set empty sessions
          setUpcomingCoachingSessions([]);
          return;
        }

        // Fetch coaching sessions for the authenticated user
        const sessions = await DataService.getUpcomingCoachingSessions(user.id);
        setUpcomingCoachingSessions(sessions);
      } catch (error) {
        console.error('Error fetching coaching sessions:', error);
        setUpcomingCoachingSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingSessions();
  }, []);

  // Simplified calendar days
  const getDaysInWeek = () => {
    const today = new Date();
    const days = [];
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      days.push({
        date: date,
        day: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: date.getDate() === today.getDate() && 
                date.getMonth() === today.getMonth() && 
                date.getFullYear() === today.getFullYear(),
      });
    }
    
    return days;
  };

  const days = getDaysInWeek();
  
  const formatTime = (timeStr: string) => {
    return timeStr;
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Coaching</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary[500] }]}>
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.background }]}>
              <CalendarCheck size={24} color={colors.success[500]} />
              <View style={styles.statContent}>
                <Text style={[styles.statCount, { color: colors.text }]}>12</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sessions Completed</Text>
              </View>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.background }]}>
              <Clock size={24} color={colors.primary[500]} />
              <View style={styles.statContent}>
                <Text style={[styles.statCount, { color: colors.text }]}>18h</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Coaching Time</Text>
              </View>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.background }]}>
              <Book size={24} color={colors.accent[500]} />
              <View style={styles.statContent}>
                <Text style={[styles.statCount, { color: colors.text }]}>5</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Action Plans Created</Text>
              </View>
            </View>
          </View>

          {/* Calendar Strip */}
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <View style={styles.calendarIconContainer}>
                <CalendarIcon size={20} color={colors.text} />
                <Text style={[styles.currentMonth, { color: colors.text }]}>June 2025</Text>
              </View>
              <TouchableOpacity>
                <Text style={[styles.viewCalendarText, { color: colors.primary[500] }]}>View Full Calendar</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.calendarDaysContainer}
            >
              {days.map((day, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.dayItem,
                    { backgroundColor: colors.neutral[50] },
                    selectedDate.getDate() === day.date.getDate() && { backgroundColor: colors.primary[500] },
                    day.isToday && { 
                      backgroundColor: colors.primary[50], 
                      borderWidth: 1, 
                      borderColor: colors.primary[300] 
                    }
                  ]}
                  onPress={() => setSelectedDate(day.date)}
                >
                  <Text style={[
                    styles.dayName, 
                    { color: colors.textSecondary },
                    selectedDate.getDate() === day.date.getDate() && { color: 'white' },
                    day.isToday && { color: colors.primary[700] }
                  ]}>
                    {day.dayName}
                  </Text>
                  <Text style={[
                    styles.dayNumber, 
                    { color: colors.text },
                    selectedDate.getDate() === day.date.getDate() && { color: 'white' },
                    day.isToday && { color: colors.primary[700] }
                  ]}>
                    {day.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Upcoming Sessions */}
          <View style={styles.sessionsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Sessions</Text>
            
            {loading ? (
              <Animated.View entering={FadeInUp.duration(400)} style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Loading coaching sessions...
                </Text>
              </Animated.View>
            ) : upcomingCoachingSessions.length === 0 ? (
              <Animated.View entering={FadeInUp.duration(400)} style={styles.emptyStateContainer}>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  No upcoming coaching sessions found
                </Text>
                <Button
                  title="Schedule a Session"
                  variant="primary"
                  size="small"
                  onPress={() => {}}
                  style={styles.scheduleButton}
                />
              </Animated.View>
            ) : (
              upcomingCoachingSessions.map((session) => (
                <Animated.View key={session.id} entering={FadeInUp.duration(400)}>
                  <View style={[styles.sessionCard, { backgroundColor: colors.background }]}>
                    <View style={styles.sessionHeader}>
                      <View style={styles.sessionDateTime}>
                        <View style={styles.sessionDateContainer}>
                          <CalendarIcon size={16} color={colors.primary[500]} />
                          <Text style={[styles.sessionDate, { color: colors.text }]}>{formatDate(session.date)}</Text>
                        </View>
                        <View style={styles.sessionTimeContainer}>
                          <Clock size={16} color={colors.primary[500]} />
                          <Text style={[styles.sessionTime, { color: colors.textSecondary }]}>
                            {formatTime(session.time)} • {session.duration} min
                          </Text>
                        </View>
                      </View>
                      <Badge
                        label="Upcoming"
                        variant="success"
                        size="small"
                      />
                    </View>
                    
                    <Text style={[styles.sessionTitle, { color: colors.text }]}>{session.title}</Text>
                    
                    <View style={styles.coachContainer}>
                      <Image 
                        source={{ uri: session.coach.avatar }} 
                        style={styles.coachAvatar} 
                      />
                      <View style={styles.coachInfo}>
                        <Text style={[styles.coachName, { color: colors.text }]}>{session.coach.name}</Text>
                        <Text style={[styles.coachTitle, { color: colors.textSecondary }]}>{session.coach.title}</Text>
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
                      <View style={styles.secondaryActions}>
                        <Button
                          title="Reschedule"
                          variant="outline"
                          size="small"
                          onPress={() => {}}
                          style={styles.actionButton}
                        />
                        <Button
                          title="Notes"
                          variant="ghost"
                          size="small"
                          icon={<Edit size={16} color={colors.primary[500]} />}
                          iconPosition="left"
                          onPress={() => {}}
                          style={styles.actionButton}
                        />
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))
            )}
            
            {/* Find a coach section */}
            <View style={[styles.findCoachSection, { backgroundColor: colors.primary[50] }]}>
              <Text style={[styles.findCoachTitle, { color: colors.text }]}>Ready for more guidance?</Text>
              <Text style={[styles.findCoachDescription, { color: colors.textSecondary }]}>
                Connect with an expert coach to accelerate your learning and career growth.
              </Text>
              <Button
                title="Find a Coach"
                variant="secondary"
                onPress={() => {}}
                style={styles.findCoachButton}
              />
            </View>
          </View>
          
          {/* "Built on Bolt" badge */}
          <View style={styles.boltBadgeContainer}>
            <Text style={[styles.boltBadgeText, { color: colors.textSecondary }]}>Built on Bolt</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statContent: {
    marginLeft: 8,
  },
  statCount: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  calendarIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentMonth: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewCalendarText: {
    fontSize: 14,
  },
  calendarDaysContainer: {
    paddingHorizontal: 16,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 8,
    minWidth: 50,
  },
  dayName: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  sessionsContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  scheduleButton: {
    minWidth: 200,
  },
  sessionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionDateTime: {
    flex: 1,
  },
  sessionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  sessionTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTime: {
    fontSize: 14,
    marginLeft: 6,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  coachContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  coachAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    fontSize: 16,
    fontWeight: '500',
  },
  coachTitle: {
    fontSize: 14,
  },
  sessionActions: {
    flexDirection: 'column',
  },
  joinButton: {
    marginBottom: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  findCoachSection: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
    alignItems: 'center',
  },
  findCoachTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  findCoachDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  findCoachButton: {
    minWidth: 150,
  },
  boltBadgeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  boltBadgeText: {
    fontSize: 12,
  },
});