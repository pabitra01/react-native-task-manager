import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';
import { getToken, setToken, removeToken } from '../../utils/storage';

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const response = await client.post('/auth/signup', { name, email });
      return { ...response.data.data, email };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Signup failed. Please try again.',
      );
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await client.post('/auth/login', { email });
      return { ...response.data.data, email };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.',
      );
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await client.post('/auth/verify-otp', { email, otp });
      const { token, user } = response.data.data;
      await setToken(token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification failed.',
      );
    }
  },
);

export const loadToken = createAsyncThunk(
  'auth/loadToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken();
      if (token) {
        // Verify token with backend
        const response = await client.get('/auth/me');
        const user = response.data.data?.user || response.data.user;
        return { token, user };
      }
      return { token: null, user: null };
    } catch (error) {
      await removeToken();
      return { token: null, user: null };
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await removeToken();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    otpSent: false,
    isAuthenticated: false,
    otpEmail: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOtpSent: (state) => {
      state.otpSent = false;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.otpEmail = action.payload.email;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.otpEmail = action.payload.email;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpSent = false;
        state.otpEmail = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Load Token
    builder
      .addCase(loadToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.token;
      })
      .addCase(loadToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.otpSent = false;
        state.otpEmail = null;
        state.error = null;
      });
  },
});

export const { clearError, clearOtpSent } = authSlice.actions;
export default authSlice.reducer;
