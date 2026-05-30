import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import {
  lightTheme,
  darkTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from '../../theme';
import LoadingSpinner from '../../components/LoadingSpinner';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading, error, otpSent, otpEmail } = useSelector(
    (state) => state.auth,
  );
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleLogin = () => {
    dispatch(clearError());
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    dispatch(login({ email: email.trim() })).then((result) => {
      if (login.fulfilled.match(result)) {
        const otp = result.payload?.otp;
        if (otp) {
          Alert.alert('Your OTP', `${otp}`, [
            { text: 'OK', onPress: () => navigation.navigate('OTP', { email: email.trim() }) },
          ]);
        } else {
          navigation.navigate('OTP', { email: email.trim() });
        }
      }
    });
  };

  React.useEffect(() => {
    if (otpSent && otpEmail) {
      navigation.navigate('OTP', { email: otpEmail });
    }
  }, [otpSent, otpEmail, navigation]);

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
              <Icon name="clipboard-check-outline" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.appTitle, { color: theme.text }]}>
              Task Manager
            </Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary }]}>
              Organize your projects & tasks
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={[styles.formTitle, { color: theme.text }]}>
              Welcome back
            </Text>
            <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
              Sign in to continue
            </Text>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.card,
                  borderColor: emailError ? theme.danger : theme.border,
                },
              ]}>
              <Icon
                name="email-outline"
                size={20}
                color={emailError ? theme.danger : theme.textSecondary}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your email"
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
              style={[styles.loginButton, { backgroundColor: theme.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}>
              <Icon name="send" size={20} color="#FFFFFF" />
              <Text style={styles.loginButtonText}>Send OTP</Text>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(clearError());
                  navigation.navigate('Signup');
                }}>
                <Text style={[styles.linkAction, { color: theme.primary }]}>
                  Sign Up
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
  formTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
    marginBottom: spacing.xl,
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
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  loginButtonText: {
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

export default LoginScreen;
