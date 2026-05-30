import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.get('/projects');
      return response.data.data?.projects || response.data.projects || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch projects.',
      );
    }
  },
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (data, { rejectWithValue }) => {
    try {
      const response = await client.post('/projects', data);
      return response.data.data?.project || response.data.project || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create project.',
      );
    }
  },
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await client.put(`/projects/${id}`, data);
      return response.data.data?.project || response.data.project || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update project.',
      );
    }
  },
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await client.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete project.',
      );
    }
  },
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
