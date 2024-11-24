import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface IUserProfile {
  _id: string;
  userId: string;
  email: string;
  name: string;
  username: string;
  image: string | null;
  bio?: string;
  location: string;
  website?: string;
  profilePicture?: string;  // Added missing field
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileState {
  profile: IUserProfile | null;
  loading: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: 'idle',  // Updated to match interface
  error: null
};

// Async thunks for API calls
export const fetchUserProfile = createAsyncThunk<
  IUserProfile,
  void,
  { rejectValue: string }
>('userProfile/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/profileApi');
    return response.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      return rejectWithValue('Unauthorized: Please log in again');
    }
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch profile');
  }
});

export const createProfile = createAsyncThunk<
  IUserProfile,
  Partial<IUserProfile>,
  { rejectValue: string }
>('userProfile/createProfile', async (profileData, { rejectWithValue }) => {
  try {
    const response = await api.post('/profileApi', profileData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to create profile');
  }
});

export const updateProfile = createAsyncThunk<
  IUserProfile,
  Partial<IUserProfile>,
  { rejectValue: string }
>('userProfile/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const response = await api.put('/profileApi', profileData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update profile');
  }
});

export const updateProfilePicture = createAsyncThunk<
  { profilePictureUrl: string },
  File,
  { rejectValue: string }
>('userProfile/updateProfilePicture', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.patch('/profileApi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update profile picture');
  }
});

export const deleteUserProfile = createAsyncThunk<
  null,
  void,
  { rejectValue: string }
>('userProfile/deleteUserProfile', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/profileApi');
    return null;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete profile');
  }
});

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.profile = null;
      state.loading = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = 'loading';  // Fixed status value
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.loading = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        if (action.payload === 'Unauthorized: Please log in again') {
          state.profile = null;
        }
      })
      // Create profile
      .addCase(createProfile.pending, (state) => {
        state.loading = 'loading';  // Fixed status value
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.loading = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = 'loading';  // Fixed status value
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.loading = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Delete profile
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = 'loading';  // Fixed status value
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.loading = 'succeeded';
        state.profile = null;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Update profile picture
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = 'loading';  // Fixed status value
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action: PayloadAction<{ profilePictureUrl: string }>) => {
        state.loading = 'succeeded';
        if (state.profile) {
          state.profile.profilePicture = action.payload.profilePictureUrl;
        }
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetProfileState } = userProfileSlice.actions;

export const selectProfile = (state: { profile: ProfileState }) => state.profile.profile;
export const selectProfileStatus = (state: { profile: ProfileState }) => state.profile.loading;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;

export default userProfileSlice.reducer;