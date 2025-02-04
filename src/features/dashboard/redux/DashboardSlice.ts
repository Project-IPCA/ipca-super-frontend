import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import axiosInstance from "../../../utils/axios";
import { resolveApiError } from "../../../utils";
import { RootState } from "../../../store/store";

interface TotalStaffs {
  total_staffs: number;
}

interface TotalStudents {
  total_students: number;
}

interface TotalSubmissions {
  total_submissions: number;
}

interface TotalGroups {
  total_groups: number;
}

export interface StatsSubmissionTime {
  submissions_list: number[];
  date_list: string[];
}

interface DashboardState {
  totalStaffs: TotalStaffs;
  totalStudents: TotalStudents;
  totalSubmissions: TotalSubmissions;
  totalGroups: TotalGroups;
  statsScoreChapter: number[];
  statsSubmissionTime: StatsSubmissionTime;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

export interface FetchTotalRequest {
  groupId: string | null;
  year: string | null;
}

const initialState: DashboardState = {
  totalStaffs: {
    total_staffs: 0,
  },
  totalStudents: {
    total_students: 0,
  },
  totalSubmissions: {
    total_submissions: 0,
  },
  totalGroups: {
    total_groups: 0,
  },
  statsScoreChapter: [],
  statsSubmissionTime: {
    submissions_list: [],
    date_list: [],
  },
  isFetching: false,
  error: null,
};

export const fetchTotalStaffs = createAsyncThunk(
  "dashboard/fetchTotalStaffs",
  async (groupId: string | null, { rejectWithValue }) => {
    const params = {
      group_id: groupId,
    };
    try {
      const response = await axiosInstance.get("/supervisor/staffs/total", {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export interface FetchTotalStudentsRequest extends FetchTotalRequest {
  status: string | null;
}

export const fetchTotalStudents = createAsyncThunk(
  "dashboard/fetchTotalStudents",
  async (request: FetchTotalStudentsRequest, { rejectWithValue }) => {
    const params = {
      ...request,
      group_id: request.groupId,
    };
    try {
      const response = await axiosInstance.get("/supervisor/students/total", {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const fetchTotalSubmissions = createAsyncThunk(
  "dashboard/fetchTotalSubmissions",
  async (request: FetchTotalRequest, { rejectWithValue }) => {
    const params = {
      ...request,
      group_id: request.groupId,
    };
    try {
      const response = await axiosInstance.get(
        "/supervisor/submissions/total",
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const fetchTotalGroups = createAsyncThunk(
  "dashboard/fetchTotalGroups",
  async (year: string | null, { rejectWithValue }) => {
    const params = {
      year: year,
    };
    try {
      const response = await axiosInstance.get("/supervisor/groups/total", {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const fetchStatsScoreChapter = createAsyncThunk(
  "dashboard/fetchStatsScoreChapter",
  async (request: FetchTotalRequest, { rejectWithValue }) => {
    const params = {
      ...request,
      group_id: request.groupId,
    };
    try {
      const response = await axiosInstance.get(
        "/supervisor/stats/score/chapter",
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const fetchStatsSubmissionTime = createAsyncThunk(
  "dashboard/fetchStatsSubmissionTime",
  async (request: FetchTotalRequest, { rejectWithValue }) => {
    const params = {
      ...request,
      group_id: request.groupId,
    };
    try {
      const response = await axiosInstance.get(
        "/supervisor/stats/submission/time",
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchTotalStaffs.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchTotalStaffs.fulfilled, (state, action) => {
        state.isFetching = false;
        state.totalStaffs = action.payload;
      })
      .addCase(fetchTotalStaffs.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(fetchTotalStudents.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchTotalStudents.fulfilled, (state, action) => {
        state.isFetching = false;
        state.totalStudents = action.payload;
      })
      .addCase(fetchTotalStudents.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(fetchTotalSubmissions.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchTotalSubmissions.fulfilled, (state, action) => {
        state.isFetching = false;
        state.totalSubmissions = action.payload;
      })
      .addCase(fetchTotalSubmissions.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(fetchTotalGroups.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchTotalGroups.fulfilled, (state, action) => {
        state.isFetching = false;
        state.totalGroups = action.payload;
      })
      .addCase(fetchTotalGroups.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(fetchStatsScoreChapter.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchStatsScoreChapter.fulfilled, (state, action) => {
        state.isFetching = false;
        state.statsScoreChapter = action.payload;
      })
      .addCase(fetchStatsScoreChapter.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(fetchStatsSubmissionTime.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchStatsSubmissionTime.fulfilled, (state, action) => {
        state.isFetching = false;
        state.statsSubmissionTime = action.payload;
      })
      .addCase(fetchStatsSubmissionTime.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearDashboardError } = dashboardSlice.actions;
export const getDashboard = (state: RootState) => state.dashboard;
export const getTotalStaffs = (state: RootState) => state.dashboard.totalStaffs;
export const getTotalStudents = (state: RootState) =>
  state.dashboard.totalStudents;
export const getDashboardStatus = (state: RootState) =>
  state.dashboard.isFetching;
export const getDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;
