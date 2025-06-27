import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { X, Github, Linkedin, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, CreditCard as Edit3 } from 'lucide-react-native';
import { getThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Animated, { FadeInUp, SlideInUp } from 'react-native-reanimated';

interface ConflictData {
  id: string;
  field: string;
  githubValue: any;
  linkedinValue: any;
  lastGitHubUpdate: string;
  lastLinkedInUpdate: string;
  resolved: boolean;
}

interface ConflictResolutionModalProps {
  visible: boolean;
  conflict: ConflictData | null;
  onClose: () => void;
  onResolve: (conflictId: string, resolution: 'github' | 'linkedin' | 'manual', manualValue?: any) => void;
}

export function ConflictResolutionModal({
  visible,
  conflict,
  onClose,
  onResolve,
}: ConflictResolutionModalProps) {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [selectedResolution, setSelectedResolution] = useState<'github' | 'linkedin' | 'manual' | null>(null);
  const [manualValue, setManualValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (!conflict) return null;

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleResolve = () => {
    if (!selectedResolution) return;

    if (selectedResolution === 'manual') {
      onResolve(conflict.id, selectedResolution, manualValue);
    } else {
      onResolve(conflict.id, selectedResolution);
    }

    // Reset state
    setSelectedResolution(null);
    setManualValue('');
    setIsEditing(false);
    onClose();
  };

  const renderValueCard = (
    platform: 'github' | 'linkedin',
    value: any,
    lastUpdate: string,
    icon: React.ReactNode,
    color: string
  ) => (
    <Animated.View
      entering={FadeInUp.delay(200).duration(500)}
      style={[
        styles.valueCard,
        { backgroundColor: colors.background },
        selectedResolution === platform && {
          borderColor: color,
          borderWidth: 2,
          backgroundColor: `${color}10`,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.valueCardContent}
        onPress={() => setSelectedResolution(platform)}
        activeOpacity={0.8}
      >
        <View style={styles.valueHeader}>
          <View style={[styles.platformIcon, { backgroundColor: color }]}>
            {icon}
          </View>
          <View style={styles.platformInfo}>
            <Text style={[styles.platformName, { color: colors.text }]}>
              {platform === 'github' ? 'GitHub' : 'LinkedIn'}
            </Text>
            <Text style={[styles.lastUpdate, { color: colors.textSecondary }]}>
              Updated {formatTimestamp(lastUpdate)}
            </Text>
          </View>
          {selectedResolution === platform && (
            <CheckCircle size={20} color={color} />
          )}
        </View>

        <View style={styles.valueContent}>
          <Text style={[styles.valueText, { color: colors.text }]}>
            {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        {/* Header */}
        <Animated.View 
          entering={SlideInUp.duration(400)}
          style={[styles.modalHeader, { borderBottomColor: colors.divider }]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={[styles.conflictIcon, { backgroundColor: colors.warning[50] }]}>
              <AlertTriangle size={24} color={colors.warning[500]} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Resolve Data Conflict
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Choose which value to keep for "{conflict.field}"
            </Text>
          </View>
        </Animated.View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Conflict Description */}
          <Animated.View 
            entering={FadeInUp.delay(100).duration(500)}
            style={[styles.conflictDescription, { backgroundColor: colors.warning[50] }]}
          >
            <Text style={[styles.conflictTitle, { color: colors.warning[700] }]}>
              Data Mismatch Detected
            </Text>
            <Text style={[styles.conflictText, { color: colors.warning[600] }]}>
              We found different values for "{conflict.field}" in your GitHub and LinkedIn profiles. 
              Please choose which value you'd like to keep, or enter a custom value.
            </Text>
          </Animated.View>

          {/* Value Options */}
          <View style={styles.valuesContainer}>
            {renderValueCard(
              'github',
              conflict.githubValue,
              conflict.lastGitHubUpdate,
              <Github size={20} color="white" />,
              '#24292e'
            )}

            {renderValueCard(
              'linkedin',
              conflict.linkedinValue,
              conflict.lastLinkedInUpdate,
              <Linkedin size={20} color="white" />,
              '#0077b5'
            )}

            {/* Manual Entry Option */}
            <Animated.View
              entering={FadeInUp.delay(400).duration(500)}
              style={[
                styles.valueCard,
                { backgroundColor: colors.background },
                selectedResolution === 'manual' && {
                  borderColor: colors.primary[500],
                  borderWidth: 2,
                  backgroundColor: colors.primary[25],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.valueCardContent}
                onPress={() => {
                  setSelectedResolution('manual');
                  setIsEditing(true);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.valueHeader}>
                  <View style={[styles.platformIcon, { backgroundColor: colors.primary[500] }]}>
                    <Edit3 size={20} color="white" />
                  </View>
                  <View style={styles.platformInfo}>
                    <Text style={[styles.platformName, { color: colors.text }]}>
                      Custom Value
                    </Text>
                    <Text style={[styles.lastUpdate, { color: colors.textSecondary }]}>
                      Enter your preferred value
                    </Text>
                  </View>
                  {selectedResolution === 'manual' && (
                    <CheckCircle size={20} color={colors.primary[500]} />
                  )}
                </View>

                {(selectedResolution === 'manual' || isEditing) && (
                  <View style={styles.manualInputContainer}>
                    <TextInput
                      style={[
                        styles.manualInput,
                        {
                          backgroundColor: colors.neutral[50],
                          color: colors.text,
                          borderColor: colors.neutral[200],
                        },
                      ]}
                      placeholder="Enter custom value..."
                      placeholderTextColor={colors.neutral[400]}
                      value={manualValue}
                      onChangeText={setManualValue}
                      multiline
                      autoFocus={isEditing}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Resolution Actions */}
          <Animated.View 
            entering={FadeInUp.delay(600).duration(500)}
            style={styles.actionsContainer}
          >
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={styles.cancelButton}
            />
            <Button
              title="Resolve Conflict"
              variant="primary"
              onPress={handleResolve}
              disabled={
                !selectedResolution ||
                (selectedResolution === 'manual' && !manualValue.trim())
              }
              style={styles.resolveButton}
            />
          </Animated.View>

          {/* Additional Info */}
          <Animated.View 
            entering={FadeInUp.delay(700).duration(500)}
            style={[styles.infoCard, { backgroundColor: colors.neutral[50] }]}
          >
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              About Conflict Resolution
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              • Your choice will be applied to your unified profile{'\n'}
              • You can change this later in settings{'\n'}
              • Original platform data remains unchanged{'\n'}
              • This helps maintain data consistency across platforms
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  conflictIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  conflictDescription: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  conflictTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  conflictText: {
    fontSize: 14,
    lineHeight: 20,
  },
  valuesContainer: {
    marginBottom: 24,
  },
  valueCard: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  valueCardContent: {
    padding: 16,
  },
  valueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  lastUpdate: {
    fontSize: 12,
  },
  valueContent: {
    paddingLeft: 52,
  },
  valueText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  manualInputContainer: {
    paddingLeft: 52,
    marginTop: 8,
  },
  manualInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
  },
  resolveButton: {
    flex: 2,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
