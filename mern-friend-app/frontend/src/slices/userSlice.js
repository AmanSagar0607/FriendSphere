import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const loadUser = createAsyncThunk('user/loadUser', async (_, { rejectWithValue }) => {
  try {
    console.log('Attempting to load user...');
    const res = await api.get('/auth/user');
    console.log('User loaded successfully:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error loading user:', err.response || err);
    return rejectWithValue(err.response?.data?.msg || 'Failed to load user');
  }
});

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
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
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        console.log('loadUser.pending');
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        console.log('loadUser.fulfilled', action.payload);
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state, action) => {
        console.log('loadUser.rejected', action.payload);
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser, setError } = userSlice.actions;

export default userSlice.reducer;