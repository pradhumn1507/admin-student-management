import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../utils/axiosInstance";

export const changePassword = createAsyncThunk(
    "admin/changePassword",
    async ({ values, token }: { values: { oldPassword: string; newPassword: string }; token: string }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("/api/admin/change-password", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to change password");
      }
    }
  );

export const logoutAdmin = createAsyncThunk(
  'admin/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/api/admin/logout', {}, { withCredentials: true });
      return null;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: { admin: null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(changePassword.pending, (state) => {
          state.loading = true;
        })
        .addCase(changePassword.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(changePassword.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });

export default adminSlice.reducer;
