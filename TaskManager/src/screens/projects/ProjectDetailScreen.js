import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasks,
  createTask,
  deleteTask,
  toggleTaskStatus,
} from '../../store/slices/taskSlice';
import {
  updateProject,
  deleteProject,
} from '../../store/slices/projectSlice';
import {
  lightTheme,
  darkTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from '../../theme';
import TaskItem from '../../components/TaskItem';
import FloatingButton from '../../components/FloatingButton';
import ModalForm from '../../components/ModalForm';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

const ProjectDetailScreen = ({ route, navigation }) => {
  const { project } = route.params;
  const dispatch = useDispatch();
  const tasks = useSelector(
    (state) => state.tasks.byProjectId[project.id] || [],
  );
  const { isLoading } = useSelector((state) => state.tasks);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const [filter, setFilter] = useState('all');
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [editTitle, setEditTitle] = useState(project.title);
  const [editDescription, setEditDescription] = useState(
    project.description || '',
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks(project.id));
  }, [dispatch, project.id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setEditModalVisible(true)}
            style={styles.headerButton}>
            <Icon name="pencil-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteProject}
            style={styles.headerButton}>
            <Icon name="trash-can-outline" size={22} color={theme.danger} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, theme]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchTasks(project.id)).then(() => setRefreshing(false));
  }, [dispatch, project.id]);

  const handleDeleteProject = () => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteProject(project.id)).then((result) => {
              if (deleteProject.fulfilled.match(result)) {
                navigation.goBack();
              }
            });
          },
        },
      ],
    );
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }
    const data = { title: taskTitle.trim() };
    if (taskDueDate.trim()) {
      // Expect YYYY-MM-DD format
      data.due_date = taskDueDate.trim();
    }
    dispatch(createTask({ projectId: project.id, data })).then((result) => {
      if (createTask.fulfilled.match(result)) {
        setTaskTitle('');
        setTaskDueDate('');
        setTaskModalVisible(false);
      }
    });
  };

  const handleEditProject = () => {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'Project title is required');
      return;
    }
    dispatch(
      updateProject({
        id: project.id,
        data: {
          title: editTitle.trim(),
          description: editDescription.trim(),
        },
      }),
    ).then((result) => {
      if (updateProject.fulfilled.match(result)) {
        setEditModalVisible(false);
        navigation.setOptions({ title: editTitle.trim() });
      }
    });
  };

  const handleToggleTask = (task) => {
    dispatch(
      toggleTaskStatus({
        id: task.id,
        projectId: project.id,
        currentStatus: task.status,
      }),
    );
  };

  const handleDeleteTask = (task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            dispatch(deleteTask({ id: task.id, projectId: project.id })),
        },
      ],
    );
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return tasks.filter((t) => t.status !== 'completed');
      case 'completed':
        return tasks.filter((t) => t.status === 'completed');
      default:
        return tasks;
    }
  };

  const getFilterCount = (key) => {
    switch (key) {
      case 'pending':
        return tasks.filter((t) => t.status !== 'completed').length;
      case 'completed':
        return tasks.filter((t) => t.status === 'completed').length;
      default:
        return tasks.length;
    }
  };

  const filteredTasks = getFilteredTasks();

  const renderTask = ({ item }) => (
    <TaskItem
      task={item}
      onToggle={() => handleToggleTask(item)}
      onDelete={() => handleDeleteTask(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Description */}
      {project.description ? (
        <View style={[styles.descriptionSection, { borderBottomColor: theme.border }]}>
          <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
            {project.description}
          </Text>
        </View>
      ) : null}

      {/* Filter Row */}
      <View style={[styles.filterRow, { borderBottomColor: theme.border }]}>
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.filterTab,
                isActive && {
                  borderBottomColor: theme.primary,
                  borderBottomWidth: 2,
                },
              ]}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.filterLabel,
                  {
                    color: isActive ? theme.primary : theme.textSecondary,
                    fontWeight: isActive ? fontWeight.semibold : fontWeight.normal,
                  },
                ]}>
                {f.label}
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  {
                    backgroundColor: isActive
                      ? theme.primaryLight
                      : theme.card,
                  },
                ]}>
                <Text
                  style={[
                    styles.filterBadgeText,
                    {
                      color: isActive ? theme.primary : theme.textSecondary,
                    },
                  ]}>
                  {getFilterCount(f.key)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={
            filter === 'completed'
              ? 'check-circle-outline'
              : filter === 'pending'
              ? 'clock-outline'
              : 'clipboard-text-outline'
          }
          title={
            filter === 'completed'
              ? 'No completed tasks'
              : filter === 'pending'
              ? 'No pending tasks'
              : 'No tasks yet'
          }
          subtitle={
            filter === 'all'
              ? 'Add your first task to this project'
              : `No ${filter} tasks in this project`
          }
          actionLabel={filter === 'all' ? 'Add Task' : ''}
          onAction={filter === 'all' ? () => setTaskModalVisible(true) : undefined}
        />
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        />
      )}

      {/* FAB */}
      <FloatingButton onPress={() => setTaskModalVisible(true)} />

      {/* Create Task Modal */}
      <ModalForm
        visible={taskModalVisible}
        title="New Task"
        onCancel={() => {
          setTaskModalVisible(false);
          setTaskTitle('');
          setTaskDueDate('');
        }}
        onSubmit={handleCreateTask}
        submitLabel="Add Task"
        isLoading={isLoading}>
        <View style={styles.formField}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>Title</Text>
          <TextInput
            style={[
              styles.fieldInput,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Enter task title"
            placeholderTextColor={theme.textSecondary}
            value={taskTitle}
            onChangeText={setTaskTitle}
            autoFocus
          />
        </View>
        <View style={styles.formField}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>
            Due Date (optional)
          </Text>
          <TextInput
            style={[
              styles.fieldInput,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textSecondary}
            value={taskDueDate}
            onChangeText={setTaskDueDate}
          />
        </View>
      </ModalForm>

      {/* Edit Project Modal */}
      <ModalForm
        visible={editModalVisible}
        title="Edit Project"
        onCancel={() => {
          setEditModalVisible(false);
          setEditTitle(project.title);
          setEditDescription(project.description || '');
        }}
        onSubmit={handleEditProject}
        submitLabel="Save Changes"
        isLoading={isLoading}>
        <View style={styles.formField}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>Title</Text>
          <TextInput
            style={[
              styles.fieldInput,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Project title"
            placeholderTextColor={theme.textSecondary}
            value={editTitle}
            onChangeText={setEditTitle}
            autoFocus
          />
        </View>
        <View style={styles.formField}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.fieldInput,
              styles.textArea,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Project description"
            placeholderTextColor={theme.textSecondary}
            value={editDescription}
            onChangeText={setEditDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ModalForm>

      <LoadingSpinner visible={isLoading && !refreshing} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    padding: spacing.xs,
  },
  descriptionSection: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  descriptionText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
    lineHeight: 20,
  },
  filterRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  filterLabel: {
    fontSize: fontSize.body,
  },
  filterBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
  listContent: {
    paddingBottom: 100,
  },
  formField: {
    marginBottom: spacing.base,
  },
  fieldLabel: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  fieldInput: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
  },
  textArea: {
    minHeight: 80,
  },
});

export default ProjectDetailScreen;
