import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  lightTheme,
  darkTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from '../theme';

const ModalForm = ({
  visible,
  title,
  children,
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  isLoading = false,
}) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.card,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.border }]}
              onPress={onCancel}
              activeOpacity={0.7}>
              <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.primary },
                isLoading && styles.disabledButton,
              ]}
              onPress={onSubmit}
              disabled={isLoading}
              activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Saving...' : submitLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: borderRadius.md * 2,
    borderTopRightRadius: borderRadius.md * 2,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.base,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
  },
  submitButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ModalForm;
