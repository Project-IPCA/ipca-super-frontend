import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils/function";
import { RootState } from "../../../store/store";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

export interface FormRequest {
  name: string;
  number: number;
  day: string;
  time_start: string;
  time_end: string;
  year: number;
  semester: number;
  dept_id: string;
  staffs: { staff_id: string }[];
}

interface Department {
  dept_id: string;
  dept_name: string;
}

interface Staffs {
  supervisor_id: string;
  f_name: string;
  l_name: string;
}

interface GroupFormState {
  departments: Department[];
  staffs: Staffs[];
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: GroupFormState = {
  departments: [],
  staffs: [],
  isFetching: false,
  error: null,
};

export const fetchDepartments = createAsyncThunk(
  "groupForm/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.get(`${VITE_IPCA_API}/common/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const fetchStaffs = createAsyncThunk(
  "groupForm/fetchStaffs",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.get(`${VITE_IPCA_API}/common/staffs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const createStudentGroup = createAsyncThunk(
  "groupForm/createStudentGroup",
  async (request: FormRequest, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.post(
        `${VITE_IPCA_API}/supervisor/group`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(resolveApiError(error));
      }
    }
  },
);

const groupFormSlice = createSlice({
  name: "groupForm",
  initialState,
  reducers: {
    clearGroupFormError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchDepartments.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.isFetching = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(fetchStaffs.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchStaffs.fulfilled, (state, action) => {
        state.isFetching = false;
        state.staffs = action.payload;
      })
      .addCase(fetchStaffs.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(createStudentGroup.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearGroupFormError } = groupFormSlice.actions;
export const getDepartments = (state: RootState) => state.groupForm.departments;
export const getStaffs = (state: RootState) => state.groupForm.staffs;
export const getGroupFormStatus = (state: RootState) =>
  state.groupForm.isFetching;
export const getGroupFormError = (state: RootState) => state.groupForm.error;
export default groupFormSlice.reducer;
