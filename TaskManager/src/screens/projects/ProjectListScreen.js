import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjects,
  createProject,
  deleteProject,
} from '../../store/slices/projectSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import {
  lightTheme,
  darkTheme,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from '../../theme';
import ProjectCard from '../../components/ProjectCard';
import FloatingButton from '../../components/FloatingButton';
import ModalForm from '../../components/ModalForm';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProjectListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: projects, isLoading } = useSelector((state) => state.projects);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    dispatch(fetchProjects()).then(() => setInitialLoad(false));
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchProjects()).then(() => setRefreshing(false));
  }, [dispatch]);

  const handleCreateProject = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Project title is required');
      return;
    }
    dispatch(
      createProject({
        title: title.trim(),
        description: description.trim(),
      }),
    ).then((result) => {
      if (createProject.fulfilled.match(result)) {
        setTitle('');
        setDescription('');
        setModalVisible(false);
      }
    });
  };

  const handleDeleteProject = (project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.title}"? This will also delete all its tasks.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteProject(project.id)),
        },
      ],
    );
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderProject = ({ item }) => (
    <ProjectCard
      project={item}
      onPress={() => navigation.navigate('ProjectDetail', { project: item })}
      onDelete={() => handleDeleteProject(item)}
    />
  );

  if (initialLoad && isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <LoadingSpinner visible />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Projects
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => dispatch(toggleTheme())}
          style={[styles.themeToggle, { backgroundColor: theme.card }]}
          activeOpacity={0.7}>
          <Icon
            name={themeMode === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'}
            size={22}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {projects.length > 0 && (
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            <Icon name="magnify" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search projects..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}

      {/* Project List */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={searchQuery ? 'magnify-close' : 'folder-plus-outline'}
          title={searchQuery ? 'No results found' : 'No projects yet'}
          subtitle={
            searchQuery
              ? 'Try a different search term'
              : 'Create your first project to get started'
          }
          actionLabel={searchQuery ? '' : 'Create Project'}
          onAction={searchQuery ? undefined : () => setModalVisible(true)}
        />
      ) : (
        <FlatList
          data={filteredProjects}
          renderItem={renderProject}
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
      <FloatingButton onPress={() => setModalVisible(true)} />

      {/* Create Project Modal */}
      <ModalForm
        visible={modalVisible}
        title="New Project"
        onCancel={() => {
          setModalVisible(false);
          setTitle('');
          setDescription('');
        }}
        onSubmit={handleCreateProject}
        submitLabel="Create"
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
            placeholder="Enter project title"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
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
            placeholder="Enter project description (optional)"
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ModalForm>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.normal,
    marginTop: spacing.xs,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
    fontWeight: fontWeight.normal,
    padding: 0,
  },
  listContent: {
    paddingVertical: spacing.sm,
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

export default ProjectListScreen;
