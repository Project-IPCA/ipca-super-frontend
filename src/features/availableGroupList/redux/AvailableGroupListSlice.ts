import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE, Pagination } from "../../../constants/constants";
import { RootState } from "../../../store/store";
import axiosInstance from "../../../utils/axios";
import { Staffs } from "../../myGroupsList/redux/myGroupListSlice";

interface Instructor {
  f_name: string;
  l_name: string;
  supervisor_id: string;
}

interface Department {
  dept_id: string;
  name_th: string;
  name_en: string;
}

interface Group {
  day: string;
  name: string;
  department: Department;
  group_id: string;
  group_no: number;
  semester: number;
  time_end: string;
  time_start: string;
  year: number;
  student_amount: number;
  instructor: Instructor;
  staffs: Staffs[];
}

export interface Filters {
  instructors: Staffs[];
  staffs: Staffs[];
  years: number[];
}

interface AvailableGroup {
  available_groups: Group[];
  filters: Filters;
  pagination: Pagination;
}

interface AvailableGroupState {
  availableGroups: AvailableGroup;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: AvailableGroupState = {
  availableGroups: {
    available_groups: [],
    filters: {
      instructors: [],
      staffs: [],
      years: [],
    },
    pagination: {
      page: 1,
      pageSize: 10,
      pages: 0,
    },
  },
  isFetching: false,
  error: null,
};

interface AvailableGroupRequest {
  instructorId: string | null;
  staffIds: string | null;
  year: string | null;
  semester: string | null;
  day: string | null;
  page: number;
}

export const fetchAvailableGroups = createAsyncThunk(
  "myGroups/fetchAvailableGroups",
  async (request: AvailableGroupRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/supervisor/available_groups`, {
        params: {
          ...request,
          pageSize: 10,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

const availableGroupsSlice = createSlice({
  name: "availableGroups",
  initialState,
  reducers: {
    clearAvailableGroupsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAvailableGroups.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchAvailableGroups.fulfilled, (state, action) => {
        state.isFetching = false;
        state.availableGroups = action.payload;
      })
      .addCase(fetchAvailableGroups.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearAvailableGroupsError } = availableGroupsSlice.actions;
export const getAvailableGroups = (state: RootState) =>
  state.availableGroups.availableGroups;
export const getAvailableGroupsStatus = (state: RootState) =>
  state.availableGroups.isFetching;
export const getAvailableGroupsError = (state: RootState) =>
  state.availableGroups.error;

export default availableGroupsSlice.reducer;
