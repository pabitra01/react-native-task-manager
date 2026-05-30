import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { verifyOtp, login, clearError } from '../../store/slices/authSlice';
import {
  lightTheme,
  darkTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from '../../theme';
import LoadingSpinner from '../../components/LoadingSpinner';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const OtpScreen = ({ route }) => {
  const { email } = route.params;
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-submit when all digits entered
  const handleAutoSubmit = useCallback(
    (otpArray) => {
      const otpString = otpArray.join('');
      if (otpString.length === OTP_LENGTH) {
        dispatch(verifyOtp({ email, otp: otpString }));
      }
    },
    [dispatch, email],
  );

  const handleChange = (text, index) => {
    dispatch(clearError());
    const newOtp = [...otp];

    // Handle paste
    if (text.length > 1) {
      const digits = text.replace(/[^0-9]/g, '').split('').slice(0, OTP_LENGTH);
      digits.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      handleAutoSubmit(newOtp);
      return;
    }

    newOtp[index] = text.replace(/[^0-9]/g, '');
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    handleAutoSubmit(newOtp);
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleResend = () => {
    if (!canResend) {
      return;
    }
    dispatch(clearError());
    setOtp(Array(OTP_LENGTH).fill(''));
    setCountdown(RESEND_COOLDOWN);
    setCanResend(false);
    dispatch(login({ email }));
    inputRefs.current[0]?.focus();
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
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
              <Icon name="shield-check-outline" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              Verify Your Email
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Enter the 6-digit code sent to
            </Text>
            <Text style={[styles.emailText, { color: theme.primary }]}>
              {email}
            </Text>
          </View>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  {
                    backgroundColor: theme.card,
                    borderColor: digit ? theme.primary : theme.border,
                    color: theme.text,
                  },
                ]}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={index === 0 ? OTP_LENGTH : 1}
                textContentType="oneTimeCode"
                autoFocus={index === 0}
                selectTextOnFocus
              />
            ))}
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: theme.danger }]}>
              {error}
            </Text>
          ) : null}

          {/* Resend */}
          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={[styles.resendActive, { color: theme.primary }]}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.resendText, { color: theme.textSecondary }]}>
                Resend OTP in{' '}
                <Text style={{ color: theme.primary, fontWeight: fontWeight.semibold }}>
                  {countdown}s
                </Text>
              </Text>
            )}
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
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
    textAlign: 'center',
  },
  emailText: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.xs,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: borderRadius.sm,
    textAlign: 'center',
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
  },
  errorText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.base,
  },
  resendText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
  },
  resendActive: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
});

export default OtpScreen;
