import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import {
  lightTheme,
  darkTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadow,
} from '../theme';

const ProjectCard = ({ project, onPress, onDelete }) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const taskCount = project.taskCount || project.tasks?.length || 0;

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onDelete}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            transform: [{ scale: scaleAnim }],
          },
          shadow.medium,
        ]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <Text
              style={[styles.title, { color: theme.text }]}
              numberOfLines={1}>
              {project.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.deleteButton}>
            <Icon name="trash-can-outline" size={20} color={theme.danger} />
          </TouchableOpacity>
        </View>
        {project.description ? (
          <Text
            style={[styles.description, { color: theme.textSecondary }]}
            numberOfLines={2}>
            {project.description}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <View
            style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
            <Icon name="checkbox-marked-outline" size={14} color={theme.primary} />
            <Text style={[styles.badgeText, { color: theme.primary }]}>
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.sm,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  description: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
    marginTop: spacing.sm,
    lineHeight: 20,
    paddingLeft: spacing.base,
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingLeft: spacing.base,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  badgeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
  },
});

export default ProjectCard;
