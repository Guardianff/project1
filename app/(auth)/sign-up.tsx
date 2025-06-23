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
import { useAuth } from '@/context/AuthContext';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, UserPlus, AlertCircle, X, Check } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, error, clearError, loading } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, []);

  useEffect(() => {
    // Check if passwords match whenever either password field changes
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
    
    // Calculate password strength
    calculatePasswordStrength(password);
  }, [password, confirmPassword]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    if (passwordStrength === 4) return 'Strong';
    return 'Very Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return colors.error[500];
    if (passwordStrength === 1) return colors.error[400];
    if (passwordStrength === 2) return colors.warning[500];
    if (passwordStrength === 3) return colors.warning[400];
    if (passwordStrength === 4) return colors.success[500];
    return colors.success[400];
  };

  const handleSignUp = async () => {
    const validEmail = validateEmail(email);
    const validPassword = validatePassword(password);
    const doPasswordsMatch = password === confirmPassword;
    
    setIsEmailValid(validEmail);
    setIsPasswordValid(validPassword);
    setPasswordsMatch(doPasswordsMatch);
    
    if (validEmail && validPassword && doPasswordsMatch) {
      await signUp(email, password);
    }
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
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join our learning community today
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

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                { 
                  backgroundColor: colors.neutral[50],
                  borderColor: isPasswordValid ? colors.neutral[300] : colors.error[500]
                }
              ]}
            >
              <Lock size={20} color={colors.neutral[400]} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Create a password"
                placeholderTextColor={colors.neutral[400]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setIsPasswordValid(true);
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.neutral[400]} />
                ) : (
                  <Eye size={20} color={colors.neutral[400]} />
                )}
              </TouchableOpacity>
            </View>
            {!isPasswordValid && (
              <Text style={[styles.validationText, { color: colors.error[500] }]}>
                Password must be at least 6 characters
              </Text>
            )}
            
            {password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <View
                      key={level}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor: 
                            passwordStrength >= level 
                              ? getPasswordStrengthColor() 
                              : colors.neutral[200]
                        }
                      ]}
                    />
                  ))}
                </View>
                <Text 
                  style={[
                    styles.strengthText, 
                    { color: getPasswordStrengthColor() }
                  ]}
                >
                  {getPasswordStrengthLabel()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Confirm Password</Text>
            <View
              style={[
                styles.inputContainer,
                { 
                  backgroundColor: colors.neutral[50],
                  borderColor: passwordsMatch ? colors.neutral[300] : colors.error[500]
                }
              ]}
            >
              <Lock size={20} color={colors.neutral[400]} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Confirm your password"
                placeholderTextColor={colors.neutral[400]}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setPasswordsMatch(true);
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.neutral[400]} />
                ) : (
                  <Eye size={20} color={colors.neutral[400]} />
                )}
              </TouchableOpacity>
            </View>
            {!passwordsMatch && confirmPassword && (
              <Text style={[styles.validationText, { color: colors.error[500] }]}>
                Passwords do not match
              </Text>
            )}
          </View>

          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              By signing up, you agree to our{' '}
              <Text style={[styles.termsLink, { color: colors.primary[500] }]}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={[styles.termsLink, { color: colors.primary[500] }]}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.signUpButton,
              { backgroundColor: colors.primary[500] },
              loading && styles.disabledButton
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={styles.signUpButtonText}>Create Account</Text>
                <UserPlus size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: colors.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={[styles.signInLink, { color: colors.primary[500] }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
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
  eyeIcon: {
    padding: 4,
  },
  validationText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordStrengthContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strengthBars: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '500',
  },
  signUpButton: {
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
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});