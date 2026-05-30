import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getThemeMode, setThemeMode } from '../../utils/storage';

export const loadTheme = createAsyncThunk('theme/loadTheme', async () => {
  const mode = await getThemeMode();
  return mode;
});

export const toggleTheme = createAsyncThunk(
  'theme/toggleTheme',
  async (_, { getState }) => {
    const currentMode = getState().theme.mode;
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    await setThemeMode(newMode);
    return newMode;
  },
);

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'light',
  },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
      })
      .addCase(toggleTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
      });
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
