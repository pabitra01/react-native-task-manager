import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await client.get(`/projects/${projectId}/tasks`);
      return { projectId, tasks: response.data.data?.tasks || response.data.tasks || [] };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks.',
      );
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await client.post(`/projects/${projectId}/tasks`, data);
      return { projectId, task: response.data.data?.task || response.data.task || response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task.',
      );
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data, projectId }, { rejectWithValue }) => {
    try {
      const response = await client.put(`/tasks/${id}`, data);
      return { projectId, task: response.data.data?.task || response.data.task || response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task.',
      );
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ id, projectId }, { rejectWithValue }) => {
    try {
      await client.delete(`/tasks/${id}`);
      return { id, projectId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete task.',
      );
    }
  },
);

export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async ({ id, projectId, currentStatus }, { rejectWithValue }) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const response = await client.put(`/tasks/${id}`, { status: newStatus });
      return { projectId, task: response.data.data?.task || response.data.task || response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task status.',
      );
    }
  },
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    byProjectId: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.byProjectId[action.payload.projectId] = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const { projectId, task } = action.payload;
        if (!state.byProjectId[projectId]) {
          state.byProjectId[projectId] = [];
        }
        state.byProjectId[projectId].unshift(task);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const { projectId, task } = action.payload;
        const tasks = state.byProjectId[projectId];
        if (tasks) {
          const index = tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            tasks[index] = task;
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, projectId } = action.payload;
        if (state.byProjectId[projectId]) {
          state.byProjectId[projectId] = state.byProjectId[projectId].filter(
            (t) => t.id !== id,
          );
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Toggle task status
    builder
      .addCase(toggleTaskStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const { projectId, task } = action.payload;
        const tasks = state.byProjectId[projectId];
        if (tasks) {
          const index = tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            tasks[index] = task;
          }
        }
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
