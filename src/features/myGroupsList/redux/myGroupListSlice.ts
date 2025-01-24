import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE, Pagination } from "../../../constants/constants";
import { resolveApiError } from "../../../utils/function";
import { RootState } from "../../../store/store";
import axiosInstance from "../../../utils/axios";

export interface Instructor {
  f_name: string;
  l_name: string;
  supervisor_id: string;
}

interface Department {
  dept_id: string;
  name_th: string;
  name_en: string;
}

export interface Group {
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
  staffs: Instructor[];
}

interface MyGroups {
  filters: {
    year: number[];
  };
  my_groups: Group[];
  pagination: Pagination;
}

interface MyGroupState {
  myGroups: MyGroups;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: MyGroupState = {
  myGroups: {
    filters: {
      year: [],
    },
    my_groups: [],
    pagination: {
      page: 1,
      pageSize: 10,
      pages: 10,
    },
  },
  isFetching: false,
  error: null,
};

export const fetchMyGroups = createAsyncThunk(
  "myGroups/fetchMyGroups",
  async (
    { year, page }: { year: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(`/supervisor/my_groups`, {
        params: {
          year: year,
          page: page,
          pageSize: 10,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

const myGroupsSlice = createSlice({
  name: "myGroups",
  initialState,
  reducers: {
    clearMyGroupsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchMyGroups.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchMyGroups.fulfilled, (state, action) => {
        state.isFetching = false;
        state.myGroups = action.payload;
      })
      .addCase(fetchMyGroups.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearMyGroupsError } = myGroupsSlice.actions;
export const getMyGroups = (state: RootState) => state.myGroups.myGroups;
export const getMyGroupsStatus = (state: RootState) =>
  state.myGroups.isFetching;
export const getMyGroupsError = (state: RootState) => state.myGroups.error;

export default myGroupsSlice.reducer;
