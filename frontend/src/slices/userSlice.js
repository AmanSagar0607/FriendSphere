import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const loadUser = createAsyncThunk('user/loadUser', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/user');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to load user');
  }
});

export const initializeAuth = createAsyncThunk('user/initializeAuth', async (_, { dispatch }) => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
    await dispatch(loadUser());
  }
});

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  isProfileModalOpen: false, // Add this line
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['x-auth-token'];
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setProfileModalOpen: (state, action) => {
      state.isProfileModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUser, clearUser, setError, setProfileModalOpen } = userSlice.actions;

export default userSlice.reducer;