import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import axiosInstance from "../../../utils/axios";
import { resolveApiError } from "../../../utils";
import { RootState } from "../../../store/store";

export interface StudentScore {
  score: number;
  student: {
    id: string;
    nickname: string;
    profile: string;
    firstname: string;
    lastname: string;
    kmitl_id: string;
  };
}

interface GroupDashboardState {
  studentRanking: StudentScore[];
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: GroupDashboardState = {
  studentRanking: [],
  isFetching: false,
  error: null,
};

export const fetchStudentRanking = createAsyncThunk(
  "groupDashboard/fetchStudentRanking",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/supervisor/score_ranking/${groupId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

const groupDashboardSlice = createSlice({
  name: "groupDashboardSlice",
  initialState,
  reducers: {
    clearGroupDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchStudentRanking.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchStudentRanking.fulfilled, (state, action) => {
        state.isFetching = false;
        state.studentRanking = action.payload;
      })
      .addCase(fetchStudentRanking.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearGroupDashboardError } = groupDashboardSlice.actions;
export const getGroupDashboard = (state: RootState) => state.groupDashboard;
export const getGroupDashboardStatus = (state: RootState) =>
  state.groupDashboard.isFetching;
export const getGroupDashboardError = (state: RootState) =>
  state.groupDashboard.error;

export default groupDashboardSlice.reducer;
