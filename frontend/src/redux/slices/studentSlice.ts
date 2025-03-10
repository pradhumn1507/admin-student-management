import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (studentData, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token || localStorage.getItem("token");

      const response = await axiosInstance.post("/api/students", studentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add student");
    }
  }
);

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token || localStorage.getItem("token");

      const response = await axiosInstance.get("/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch students");
    }
  }
);

export const editStudent = createAsyncThunk(
  "students/editStudent",
  async ({ id, updatedData }: { id: string; updatedData: any }, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token || localStorage.getItem("token");

      const response = await axiosInstance.put(`/api/students/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update student");
    }
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: { students: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.map((student) =>
          student._id === action.payload._id ? action.payload : student
        );
      })
      .addCase(editStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentSlice.reducer;
