import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, SquareCheck as CheckSquare, BookOpen, Dumbbell, Briefcase, Coffee, Plus, ChevronRight, CreditCard as Edit3, Trash2, Bell, CircleCheck, Circle, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  category: 'learning' | 'fitness' | 'work' | 'personal';
  priority: 'high' | 'medium' | 'low';
}

interface ScheduledEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'learning' | 'fitness' | 'work' | 'personal' | 'meeting';
  location?: string;
}

export default function DailyPlanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete React Native lesson',
      completed: false,
      time: '10:00 AM',
      category: 'learning',
      priority: 'high',
    },
    {
      id: '2',
      title: '30-minute HIIT workout',
      completed: true,
      time: '7:00 AM',
      category: 'fitness',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Team meeting',
      completed: false,
      time: '2:00 PM',
      category: 'work',
      priority: 'high',
    },
    {
      id: '4',
      title: 'Read book chapter',
      completed: false,
      category: 'personal',
      priority: 'low',
    },
  ]);

  const [events, setEvents] = useState<ScheduledEvent[]>([
    {
      id: '1',
      title: 'Career Coaching Session',
      startTime: '3:00 PM',
      endTime: '4:00 PM',
      category: 'meeting',
      location: 'Virtual',
    },
    {
      id: '2',
      title: 'UI/UX Design Course',
      startTime: '10:30 AM',
      endTime: '12:00 PM',
      category: 'learning',
    },
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

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

  const getCompletedTasksCount = () => {
    return tasks.filter(task => task.completed).length;
  };

  const getTaskProgress = () => {
    return tasks.length > 0 ? (getCompletedTasksCount() / tasks.length) * 100 : 0;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <BookOpen size={16} color={colors.primary[500]} />;
      case 'fitness': return <Dumbbell size={16} color={colors.success[500]} />;
      case 'work': return <Briefcase size={16} color={colors.warning[500]} />;
      case 'meeting': return <Calendar size={16} color={colors.accent[500]} />;
      case 'personal': return <Coffee size={16} color={colors.error[500]} />;
      default: return <CheckSquare size={16} color={colors.neutral[500]} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return colors.primary[500];
      case 'fitness': return colors.success[500];
      case 'work': return colors.warning[500];
      case 'meeting': return colors.accent[500];
      case 'personal': return colors.error[500];
      default: return colors.neutral[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error[500];
      case 'medium': return colors.warning[500];
      case 'low': return colors.success[500];
      default: return colors.neutral[500];
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    Alert.alert(
      'Add New Task',
      'What would you like to add to your day?',
      [
        { text: 'Learning Task', onPress: () => addNewTask('learning') },
        { text: 'Fitness Task', onPress: () => addNewTask('fitness') },
        { text: 'Work Task', onPress: () => addNewTask('work') },
        { text: 'Personal Task', onPress: () => addNewTask('personal') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addNewTask = (category: string) => {
    // In a real app, this would open a task creation form
    Alert.alert('Task Creation', `Creating a new ${category} task...`);
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const getCurrentTimeString = () => {
    return currentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.duration(500)}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Daily Plan</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary[500] }]}
            onPress={handleAddTask}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Current Time */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.timeSection}>
            <GlassCard style={styles.timeCard}>
              <View style={styles.timeContent}>
                <View style={[styles.timeIcon, { backgroundColor: colors.primary[50] }]}>
                  <Clock size={24} color={colors.primary[500]} />
                </View>
                <View style={styles.timeInfo}>
                  <Text style={[styles.currentTime, { color: colors.text }]}>
                    {getCurrentTimeString()}
                  </Text>
                  <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
                    Current Time
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Calendar Strip */}
          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <View style={styles.calendarTitle}>
                <Calendar size={20} color={colors.text} />
                <Text style={[styles.calendarMonth, { color: colors.text }]}>
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={[styles.viewCalendarText, { color: colors.primary[500] }]}>
                  View Calendar
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysContainer}
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
          </Animated.View>

          {/* Tasks Progress */}
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.progressSection}>
            <EnhancedCard variant="glass" style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressTitle, { color: colors.text }]}>
                  Today's Progress
                </Text>
                <Badge
                  label={`${getCompletedTasksCount()}/${tasks.length} Tasks`}
                  variant="primary"
                  size="small"
                />
              </View>
              
              <ProgressIndicator
                progress={getTaskProgress()}
                size="md"
                showLabel
                label={`${Math.round(getTaskProgress())}% completed`}
                style={styles.progressBar}
              />
            </EnhancedCard>
          </Animated.View>

          {/* Tasks List */}
          <View style={styles.tasksSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tasks</Text>
              <TouchableOpacity onPress={handleAddTask}>
                <Text style={[styles.addTaskText, { color: colors.primary[500] }]}>
                  Add Task
                </Text>
              </TouchableOpacity>
            </View>
            
            {tasks.map((task, index) => (
              <Animated.View
                key={task.id}
                entering={FadeInRight.delay(500 + index * 100).duration(500)}
              >
                <EnhancedCard
                  variant="elevated"
                  interactive
                  onPress={() => toggleTaskCompletion(task.id)}
                  style={[
                    styles.taskCard,
                    task.completed && { opacity: 0.7 }
                  ]}
                >
                  <View style={styles.taskContent}>
                    <TouchableOpacity
                      style={styles.taskCheckbox}
                      onPress={() => toggleTaskCompletion(task.id)}
                    >
                      {task.completed ? (
                        <CircleCheck size={24} color={colors.success[500]} />
                      ) : (
                        <Circle size={24} color={colors.neutral[400]} />
                      )}
                    </TouchableOpacity>
                    
                    <View style={styles.taskInfo}>
                      <Text style={[
                        styles.taskTitle, 
                        { color: colors.text },
                        task.completed && { 
                          textDecorationLine: 'line-through',
                          color: colors.textSecondary
                        }
                      ]}>
                        {task.title}
                      </Text>
                      
                      <View style={styles.taskMeta}>
                        {task.time && (
                          <View style={styles.taskMetaItem}>
                            <Clock size={14} color={colors.neutral[500]} />
                            <Text style={[styles.taskMetaText, { color: colors.textSecondary }]}>
                              {formatTime(task.time)}
                            </Text>
                          </View>
                        )}
                        <View style={styles.taskMetaItem}>
                          {getCategoryIcon(task.category)}
                          <Text style={[styles.taskMetaText, { color: colors.textSecondary }]}>
                            {task.category}
                          </Text>
                        </View>
                        <View style={[
                          styles.priorityBadge, 
                          { backgroundColor: `${getPriorityColor(task.priority)}15` }
                        ]}>
                          <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                            {task.priority}
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity style={styles.taskActions}>
                      <MoreHorizontal size={20} color={colors.neutral[500]} />
                    </TouchableOpacity>
                  </View>
                </EnhancedCard>
              </Animated.View>
            ))}
          </View>

          {/* Schedule */}
          <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.scheduleSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Schedule</Text>
            
            <EnhancedCard variant="glass" style={styles.scheduleCard}>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <View 
                    key={event.id} 
                    style={[
                      styles.eventItem,
                      index < events.length - 1 && { 
                        borderBottomWidth: 1, 
                        borderBottomColor: colors.divider 
                      }
                    ]}
                  >
                    <View style={[styles.eventTimeBlock, { backgroundColor: `${getCategoryColor(event.category)}15` }]}>
                      <Text style={[styles.eventTime, { color: getCategoryColor(event.category) }]}>
                        {event.startTime}
                      </Text>
                      <View style={styles.eventDuration}>
                        <View style={[styles.eventDurationLine, { backgroundColor: getCategoryColor(event.category) }]} />
                      </View>
                      <Text style={[styles.eventTime, { color: getCategoryColor(event.category) }]}>
                        {event.endTime}
                      </Text>
                    </View>
                    
                    <View style={styles.eventContent}>
                      <View style={styles.eventHeader}>
                        <Text style={[styles.eventTitle, { color: colors.text }]}>
                          {event.title}
                        </Text>
                        <View style={[styles.eventCategoryIcon, { backgroundColor: getCategoryColor(event.category) }]}>
                          {getCategoryIcon(event.category)}
                        </View>
                      </View>
                      
                      {event.location && (
                        <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>
                          {event.location}
                        </Text>
                      )}
                    </View>
                    
                    <View style={styles.eventActions}>
                      <TouchableOpacity style={styles.eventAction}>
                        <Bell size={16} color={colors.neutral[500]} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.eventAction}>
                        <Edit3 size={16} color={colors.neutral[500]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptySchedule}>
                  <Text style={[styles.emptyScheduleText, { color: colors.textSecondary }]}>
                    No events scheduled for today
                  </Text>
                  <Button
                    title="Add Event"
                    variant="outline"
                    size="small"
                    onPress={() => {}}
                    style={styles.addEventButton}
                  />
                </View>
              )}
            </EnhancedCard>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  timeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeCard: {
    padding: 16,
  },
  timeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  timeInfo: {
    flex: 1,
  },
  currentTime: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 14,
  },
  calendarSection: {
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  calendarTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewCalendarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  daysContainer: {
    paddingHorizontal: 20,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  dayName: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressCard: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    marginBottom: 8,
  },
  tasksSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  addTaskText: {
    fontSize: 14,
    fontWeight: '600',
  },
  taskCard: {
    marginBottom: 12,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCheckbox: {
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  taskMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskActions: {
    padding: 8,
  },
  scheduleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  scheduleCard: {
    padding: 16,
  },
  eventItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  eventTimeBlock: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 16,
  },
  eventTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventDuration: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  eventDurationLine: {
    width: 2,
    height: '100%',
    borderRadius: 1,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventCategoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 12,
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  emptySchedule: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyScheduleText: {
    fontSize: 14,
    marginBottom: 16,
  },
  addEventButton: {
    minWidth: 120,
  },
  bottomSpacing: {
    height: 80,
  },
});