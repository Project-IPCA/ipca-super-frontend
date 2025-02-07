import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import axiosInstance from "../../../utils/axios";
import { processData, resolveApiError } from "../../../utils";
import { RootState } from "../../../store/store";
import { StatusType } from "../constants";
export interface ActivityLog {
  log_id: string;
  timestamp: Date;
  group_id: string | null;
  username: string;
  remote_ip: string;
  remote_port: number | null;
  agent: string | null;
  page_name: string;
  action: string | ActionData;
  ci: number | null;
}

export interface ActionData {
  stu_id: string;
  job_id: string;
  status: StatusType;
  submission_id: string;
  attempt: string;
  sourcecode_filename: string;
  marking: number | null;
}

interface GroupActivityLogState {
  logs: ActivityLog[];
  total: number;
  lastTime: Date | null;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: GroupActivityLogState = {
  logs: [],
  total: 0,
  lastTime: null,
  isFetching: false,
  error: null,
};

export interface FetchLastTimeLogReq {
  groupId: string;
  limit: number;
  lastTime: Date | null;
}

export const fetchLastTimeLog = createAsyncThunk(
  "groupActivityLog/fetchLastTimeLog",
  async (
    { groupId, limit, lastTime }: FetchLastTimeLogReq,
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/supervisor/last_log?${
          lastTime ? `last_time=${lastTime}` : ""
        }&group_id=${groupId}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

const groupActivityLogSlice = createSlice({
  name: "groupActivityLogSlice",
  initialState,
  reducers: {
    clearGroupActivityLogError: (state) => {
      state.error = null;
    },
    pushLogs: (state, action: PayloadAction<ActivityLog>) => {
      state.logs.push(action.payload);
    },
    setLasttime: (state, action: PayloadAction<Date>) => {
      state.lastTime = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchLastTimeLog.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchLastTimeLog.fulfilled, (state, action) => {
        state.isFetching = false;
        state.logs = [...action.payload.logs.map(processData), ...state.logs];
        state.total = action.payload.total;
        state.lastTime = state.logs[0].timestamp;
      })
      .addCase(fetchLastTimeLog.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearGroupActivityLogError, pushLogs, setLasttime } =
  groupActivityLogSlice.actions;
export const getActivityLog = (state: RootState) => state.groupActivityLog;
export const getGroupActivityLogStatus = (state: RootState) =>
  state.groupActivityLog.isFetching;
export const getGroupActivityLogError = (state: RootState) =>
  state.groupActivityLog.error;
export default groupActivityLogSlice.reducer;
