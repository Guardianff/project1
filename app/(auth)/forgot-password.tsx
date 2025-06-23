import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Mail, ArrowLeft, Send, CircleAlert as AlertCircle, X, CircleCheck as CheckCircle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    const validEmail = validateEmail(email);
    setIsEmailValid(validEmail);
    
    if (!validEmail) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://your-app-url.com/reset-password',
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.neutral[100] }]}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your email and we'll send you a link to reset your password
          </Text>

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error[50] }]}>
              <AlertCircle size={18} color={colors.error[500]} />
              <Text style={[styles.errorText, { color: colors.error[700] }]}>{error}</Text>
              <TouchableOpacity onPress={clearError} style={styles.clearErrorButton}>
                <X size={18} color={colors.error[500]} />
              </TouchableOpacity>
            </View>
          )}

          {success ? (
            <View style={[styles.successContainer, { backgroundColor: colors.success[50] }]}>
              <CheckCircle size={24} color={colors.success[500]} />
              <Text style={[styles.successTitle, { color: colors.success[700] }]}>
                Reset Link Sent
              </Text>
              <Text style={[styles.successText, { color: colors.success[600] }]}>
                We've sent a password reset link to {email}. Please check your email and follow the instructions.
              </Text>
              <TouchableOpacity
                style={[styles.backToLoginButton, { backgroundColor: colors.success[500] }]}
                onPress={() => router.push('/')}
              >
                <Text style={styles.backToLoginText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
                <View
                  style={[
                    styles.inputContainer,
                    { 
                      backgroundColor: colors.neutral[50],
                      borderColor: isEmailValid ? colors.neutral[300] : colors.error[500]
                    }
                  ]}
                >
                  <Mail size={20} color={colors.neutral[400]} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.neutral[400]}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setIsEmailValid(true);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                {!isEmailValid && (
                  <Text style={[styles.validationText, { color: colors.error[500] }]}>
                    Please enter a valid email address
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.resetButton,
                  { backgroundColor: colors.primary[500] },
                  loading && styles.disabledButton
                ]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Text style={styles.resetButtonText}>Send Reset Link</Text>
                    <Send size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/')}
                style={styles.backToLoginContainer}
              >
                <Text style={[styles.backToLoginLink, { color: colors.primary[500] }]}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  clearErrorButton: {
    padding: 4,
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    fontSize: 16,
  },
  validationText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  resetButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  backToLoginContainer: {
    alignItems: 'center',
  },
  backToLoginLink: {
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToLoginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});