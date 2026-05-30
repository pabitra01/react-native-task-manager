import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../../store/slices/authSlice';
import {
  lightTheme,
  darkTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from '../../theme';
import LoadingSpinner from '../../components/LoadingSpinner';

const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSignup = () => {
    dispatch(clearError());
    setNameError('');
    setEmailError('');

    let hasError = false;

    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    dispatch(signup({ name: name.trim(), email: email.trim() })).then(
      (result) => {
        if (signup.fulfilled.match(result)) {
          navigation.navigate('OTP', { email: email.trim() });
        }
      },
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: theme.primaryLight }]}>
              <Icon name="account-plus-outline" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.appTitle, { color: theme.text }]}>
              Create Account
            </Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary }]}>
              Join us to manage your tasks
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Name Input */}
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.card,
                  borderColor: nameError ? theme.danger : theme.border,
                },
              ]}>
              <Icon
                name="account-outline"
                size={20}
                color={nameError ? theme.danger : theme.textSecondary}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Full name"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setNameError('');
                  dispatch(clearError());
                }}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            {nameError ? (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {nameError}
              </Text>
            ) : null}

            {/* Email Input */}
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.card,
                  borderColor: emailError ? theme.danger : theme.border,
                  marginTop: spacing.base,
                },
              ]}>
              <Icon
                name="email-outline"
                size={20}
                color={emailError ? theme.danger : theme.textSecondary}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email address"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                  dispatch(clearError());
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {emailError ? (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {emailError}
              </Text>
            ) : null}

            {error ? (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.signupButton, { backgroundColor: theme.primary }]}
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}>
              <Icon name="account-check" size={20} color="#FFFFFF" />
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(clearError());
                  navigation.navigate('Login');
                }}>
                <Text style={[styles.linkAction, { color: theme.primary }]}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <LoadingSpinner visible={isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl * 1.5,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  appTitle: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
  },
  appSubtitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
    marginTop: spacing.xs,
  },
  formSection: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: Platform.OS === 'ios' ? spacing.base : spacing.xs,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.normal,
  },
  errorText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  linkText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
  },
  linkAction: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
});

export default SignupScreen;
