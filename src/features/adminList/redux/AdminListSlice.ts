import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import axiosInstance from "../../../utils/axios";
import { resolveApiError } from "../../../utils";
import { RootState } from "../../../store/store";
import axios from "axios";

export interface RolePermission {
  role: string;
  permission: string[];
}

interface AdminListState {
  rolePermission: RolePermission[];
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: AdminListState = {
  rolePermission: [],
  isFetching: false,
  error: null,
};

interface RolePermissionRequest {
  role: string;
  permission: string[];
}

export const fetchRolePermission = createAsyncThunk(
  "adminList/fetchRolePermission",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/supervisor/all_role_permission`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const updateRolePermission = createAsyncThunk(
  "adminList/createRolePermission",
  async (request: RolePermissionRequest[], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/supervisor/set_role_permission`,
        {
          data: request,
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

const adminListSlice = createSlice({
  name: "adminList",
  initialState,
  reducers: {
    clearAdminListError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchRolePermission.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchRolePermission.fulfilled, (state, action) => {
        state.isFetching = false;
        state.rolePermission = action.payload;
      })
      .addCase(fetchRolePermission.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(updateRolePermission.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearAdminListError } = adminListSlice.actions;
export const getRolePermission = (state: RootState) =>
  state.adminList.rolePermission;
export const getRolePermissionError = (state: RootState) =>
  state.adminList.error;
export const getRoleStatus = (state: RootState) => state.adminList.isFetching;

export default adminListSlice.reducer;
