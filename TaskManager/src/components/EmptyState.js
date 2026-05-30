import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme, spacing, fontSize, fontWeight, borderRadius } from '../theme';

const EmptyState = ({
  icon = 'inbox-outline',
  title = 'Nothing here yet',
  subtitle = '',
  actionLabel = '',
  onAction,
}) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={styles.container}>
      <Icon name={icon} size={64} color={theme.textSecondary} />
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={onAction}
          activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl * 2,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.base,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
  },
});

export default EmptyState;
