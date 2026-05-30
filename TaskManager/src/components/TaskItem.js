import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
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
} from '../theme';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const isCompleted = task.status === 'completed';
  const checkAnim = useRef(new Animated.Value(isCompleted ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: isCompleted ? 1 : 0,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [isCompleted, checkAnim]);

  const getDueDateInfo = () => {
    if (!task.due_date) {
      return { color: theme.textSecondary, label: 'No date' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    const formattedDate = dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    if (diffDays < 0) {
      return { color: theme.danger, label: `${formattedDate} (Overdue)` };
    }
    if (diffDays === 0) {
      return { color: theme.warning, label: 'Today' };
    }
    if (diffDays === 1) {
      return { color: theme.warning, label: 'Tomorrow' };
    }
    return { color: theme.success, label: formattedDate };
  };

  const dueDateInfo = getDueDateInfo();

  const checkboxBackground = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', theme.primary],
  });

  const checkboxBorder = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.border, theme.primary],
  });

  const textOpacity = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.checkboxContainer}
        activeOpacity={0.7}>
        <Animated.View
          style={[
            styles.checkbox,
            {
              backgroundColor: checkboxBackground,
              borderColor: checkboxBorder,
            },
          ]}>
          {isCompleted && (
            <Icon name="check" size={14} color="#FFFFFF" />
          )}
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.content, { opacity: textOpacity }]}>
        <Text
          style={[
            styles.title,
            { color: theme.text },
            isCompleted && styles.completedTitle,
          ]}
          numberOfLines={2}>
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.dueDateContainer}>
            <Icon
              name="calendar-outline"
              size={12}
              color={dueDateInfo.color}
            />
            <Text style={[styles.dueDate, { color: dueDateInfo.color }]}>
              {dueDateInfo.label}
            </Text>
          </View>
        </View>
      </Animated.View>

      <TouchableOpacity
        onPress={onDelete}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Icon name="close-circle-outline" size={20} color={theme.danger} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
  },
  checkboxContainer: {
    marginRight: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.normal,
  },
  deleteButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});

export default TaskItem;
