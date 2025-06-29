import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useAIAgent } from '@/context/AIAgentContext';
import { Button } from '@/components/ui/Button';
import { Brain, Eye, Headphones, Dumbbell, Target, Clock, Calendar } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface AIPreferencesFormProps {
  onSave?: () => void;
}

export function AIPreferencesForm({ onSave }: AIPreferencesFormProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const { userPreferences, updatePreferences } = useAIAgent();
  
  const [learningGoals, setLearningGoals] = useState<string[]>(userPreferences.learningGoals || []);
  const [preferredTopics, setPreferredTopics] = useState<string[]>(userPreferences.preferredTopics || []);
  const [learningStyle, setLearningStyle] = useState<string | null>(userPreferences.learningStyle || null);
  const [preferredDifficulty, setPreferredDifficulty] = useState<string | null>(userPreferences.preferredDifficulty || null);
  const [studyReminders, setStudyReminders] = useState<boolean>(userPreferences.studyReminders);
  const [dailyLearningTarget, setDailyLearningTarget] = useState<number>(userPreferences.dailyLearningTarget);
  const [preferredStudyTime, setPreferredStudyTime] = useState<string | null>(userPreferences.preferredStudyTime || null);
  
  const [newGoal, setNewGoal] = useState('');
  const [newTopic, setNewTopic] = useState('');
  
  const learningStyles = [
    { id: 'visual', label: 'Visual', icon: <Eye size={20} color={colors.primary[500]} /> },
    { id: 'auditory', label: 'Auditory', icon: <Headphones size={20} color={colors.primary[500]} /> },
    { id: 'reading', label: 'Reading', icon: <Brain size={20} color={colors.primary[500]} /> },
    { id: 'kinesthetic', label: 'Hands-on', icon: <Dumbbell size={20} color={colors.primary[500]} /> },
  ];
  
  const difficultyLevels = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];
  
  const studyTimes = [
    { id: 'morning', label: 'Morning (6AM-12PM)' },
    { id: 'afternoon', label: 'Afternoon (12PM-5PM)' },
    { id: 'evening', label: 'Evening (5PM-9PM)' },
    { id: 'night', label: 'Night (9PM-12AM)' },
  ];
  
  const handleAddGoal = () => {
    if (newGoal.trim() && !learningGoals.includes(newGoal.trim())) {
      setLearningGoals([...learningGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };
  
  const handleRemoveGoal = (goal: string) => {
    setLearningGoals(learningGoals.filter(g => g !== goal));
  };
  
  const handleAddTopic = () => {
    if (newTopic.trim() && !preferredTopics.includes(newTopic.trim())) {
      setPreferredTopics([...preferredTopics, newTopic.trim()]);
      setNewTopic('');
    }
  };
  
  const handleRemoveTopic = (topic: string) => {
    setPreferredTopics(preferredTopics.filter(t => t !== topic));
  };
  
  const handleSave = () => {
    updatePreferences({
      learningGoals,
      preferredTopics,
      learningStyle: learningStyle as any,
      preferredDifficulty: preferredDifficulty as any,
      studyReminders,
      dailyLearningTarget,
      preferredStudyTime,
    });
    
    if (onSave) {
      onSave();
    }
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Learning Goals
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          What do you want to achieve with your learning?
        </Text>
        
        <View style={styles.goalsContainer}>
          {learningGoals.map((goal, index) => (
            <View 
              key={index} 
              style={[styles.goalChip, { backgroundColor: colors.primary[50] }]}
            >
              <Text style={[styles.goalText, { color: colors.primary[700] }]}>
                {goal}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveGoal(goal)}
              >
                <Text style={[styles.removeButtonText, { color: colors.primary[700] }]}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <View style={styles.addContainer}>
          <TextInput
            style={[
              styles.input, 
              { 
                color: colors.text,
                backgroundColor: colors.neutral[50],
                borderColor: colors.neutral[200],
              }
            ]}
            placeholder="Add a learning goal..."
            placeholderTextColor={colors.neutral[400]}
            value={newGoal}
            onChangeText={setNewGoal}
            onSubmitEditing={handleAddGoal}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary[500] }]}
            onPress={handleAddGoal}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Preferred Topics
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          What subjects are you most interested in?
        </Text>
        
        <View style={styles.goalsContainer}>
          {preferredTopics.map((topic, index) => (
            <View 
              key={index} 
              style={[styles.goalChip, { backgroundColor: colors.secondary[50] }]}
            >
              <Text style={[styles.goalText, { color: colors.secondary[700] }]}>
                {topic}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveTopic(topic)}
              >
                <Text style={[styles.removeButtonText, { color: colors.secondary[700] }]}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <View style={styles.addContainer}>
          <TextInput
            style={[
              styles.input, 
              { 
                color: colors.text,
                backgroundColor: colors.neutral[50],
                borderColor: colors.neutral[200],
              }
            ]}
            placeholder="Add a topic..."
            placeholderTextColor={colors.neutral[400]}
            value={newTopic}
            onChangeText={setNewTopic}
            onSubmitEditing={handleAddTopic}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.secondary[500] }]}
            onPress={handleAddTopic}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Learning Style
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          How do you prefer to learn new information?
        </Text>
        
        <View style={styles.optionsContainer}>
          {learningStyles.map((style) => (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.optionButton,
                { 
                  backgroundColor: learningStyle === style.id 
                    ? colors.primary[50] 
                    : colors.neutral[50],
                  borderColor: learningStyle === style.id 
                    ? colors.primary[500] 
                    : colors.neutral[200],
                }
              ]}
              onPress={() => setLearningStyle(style.id)}
            >
              <View style={styles.optionIcon}>
                {style.icon}
              </View>
              <Text 
                style={[
                  styles.optionText, 
                  { 
                    color: learningStyle === style.id 
                      ? colors.primary[700] 
                      : colors.text 
                  }
                ]}
              >
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
      
      <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Preferred Difficulty
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          What difficulty level do you prefer for your courses?
        </Text>
        
        <View style={styles.difficultyContainer}>
          {difficultyLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.difficultyButton,
                { 
                  backgroundColor: preferredDifficulty === level.id 
                    ? colors.primary[500] 
                    : colors.neutral[50],
                }
              ]}
              onPress={() => setPreferredDifficulty(level.id)}
            >
              <Text 
                style={[
                  styles.difficultyText, 
                  { 
                    color: preferredDifficulty === level.id 
                      ? 'white' 
                      : colors.text 
                  }
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
      
      <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Study Preferences
        </Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <View style={styles.preferenceIconContainer}>
              <Target size={20} color={colors.primary[500]} />
            </View>
            <View>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>
                Daily Learning Target
              </Text>
              <Text style={[styles.preferenceDescription, { color: colors.textSecondary }]}>
                Minutes per day
              </Text>
            </View>
          </View>
          
          <View style={styles.timeSelector}>
            {[15, 30, 45, 60].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  { 
                    backgroundColor: dailyLearningTarget === time 
                      ? colors.primary[500] 
                      : colors.neutral[50],
                  }
                ]}
                onPress={() => setDailyLearningTarget(time)}
              >
                <Text 
                  style={[
                    styles.timeText, 
                    { 
                      color: dailyLearningTarget === time 
                        ? 'white' 
                        : colors.text 
                    }
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <View style={styles.preferenceIconContainer}>
              <Clock size={20} color={colors.primary[500]} />
            </View>
            <View>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>
                Preferred Study Time
              </Text>
              <Text style={[styles.preferenceDescription, { color: colors.textSecondary }]}>
                When do you prefer to study?
              </Text>
            </View>
          </View>
          
          <View style={styles.studyTimeContainer}>
            {studyTimes.map((time) => (
              <TouchableOpacity
                key={time.id}
                style={[
                  styles.studyTimeOption,
                  { 
                    backgroundColor: preferredStudyTime === time.id 
                      ? colors.primary[50] 
                      : colors.neutral[50],
                    borderColor: preferredStudyTime === time.id 
                      ? colors.primary[500] 
                      : colors.neutral[200],
                  }
                ]}
                onPress={() => setPreferredStudyTime(time.id)}
              >
                <Text 
                  style={[
                    styles.studyTimeText, 
                    { 
                      color: preferredStudyTime === time.id 
                        ? colors.primary[700] 
                        : colors.text 
                    }
                  ]}
                >
                  {time.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <View style={styles.preferenceIconContainer}>
              <Calendar size={20} color={colors.primary[500]} />
            </View>
            <View>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>
                Study Reminders
              </Text>
              <Text style={[styles.preferenceDescription, { color: colors.textSecondary }]}>
                Receive reminders to study
              </Text>
            </View>
          </View>
          
          <Switch
            value={studyReminders}
            onValueChange={setStudyReminders}
            trackColor={{ false: colors.neutral[200], true: colors.primary[200] }}
            thumbColor={studyReminders ? colors.primary[500] : colors.neutral[400]}
          />
        </View>
      </Animated.View>
      
      <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.saveButtonContainer}>
        <Button
          title="Save Preferences"
          variant="primary"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  goalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    marginRight: 4,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '700',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  optionIcon: {
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 12,
  },
  timeSelector: {
    flexDirection: 'row',
  },
  timeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  studyTimeContainer: {
    width: '60%',
  },
  studyTimeOption: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  studyTimeText: {
    fontSize: 14,
    textAlign: 'center',
  },
  saveButtonContainer: {
    marginBottom: 40,
  },
  saveButton: {
    width: '100%',
  },
});