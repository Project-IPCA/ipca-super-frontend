import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE, Permission } from "../../../constants/constants";
import axiosInstance from "../../../utils/axios";
import { resolveApiError } from "../../../utils";
import { RootState } from "../../../store/store";
import axios from "axios";
import { Staffs } from "../../groupForm/redux/groupFormSlice";

export interface RolePermission {
  role: string;
  permission: string[];
}

interface DeletedAdmin {
  admin: Staffs | null;
  isAdmin: boolean;
}

interface AdminListState {
  rolePermission: RolePermission[];
  myPermissions: {
    permission: Permission[] | null;
    role: string | null;
  };
  isFetching: boolean;
  isUpdatePerm: boolean;
  error: API_ERROR_RESPONSE | null;
  selectAdmin: DeletedAdmin;
}

const initialState: AdminListState = {
  rolePermission: [],
  myPermissions: {
    permission: null,
    role: null,
  },
  isFetching: false,
  isUpdatePerm: false,
  error: null,
  selectAdmin: {
    admin: null,
    isAdmin: false,
  },
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
        `/supervisor/all_role_permission`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

export const fetchMyPermissions = createAsyncThunk(
  "adminList/fetchMyPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/supervisor/role_permission`);
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

export const updateRolePermission = createAsyncThunk(
  "adminList/createRolePermission",
  async (request: RolePermissionRequest[], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/supervisor/set_role_permission`,
        {
          data: request,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(resolveApiError(error));
      }
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "adminList/deleteAdmin",
  async (admin_id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/supervisor/admin/${admin_id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(resolveApiError(error));
      }
    }
  }
);

export const restoreAdmin = createAsyncThunk(
  "adminList/restoreAdmin",
  async (admin_id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/supervisor/admin/${admin_id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(resolveApiError(error));
      }
    }
  }
);

const adminListSlice = createSlice({
  name: "adminList",
  initialState,
  reducers: {
    clearAdminListError: (state) => {
      state.error = null;
    },
    setSelectAdmin: (state, action: PayloadAction<Staffs>) => {
      state.selectAdmin.admin = action.payload;
    },
    clearSelectAdmin: (state) => {
      state.selectAdmin.admin = null;
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
      .addCase(fetchMyPermissions.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchMyPermissions.fulfilled, (state, action) => {
        state.isFetching = false;
        state.myPermissions = action.payload;
      })
      .addCase(fetchMyPermissions.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(updateRolePermission.pending, (state, _) => {
        state.isUpdatePerm = true;
      })
      .addCase(updateRolePermission.fulfilled, (state, _) => {
        state.isUpdatePerm = false;
      })
      .addCase(updateRolePermission.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.selectAdmin.isAdmin = true;
      })
      .addCase(deleteAdmin.fulfilled, (state) => {
        state.selectAdmin.admin = null;
        state.selectAdmin.isAdmin = false;
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(restoreAdmin.pending, (state) => {
        state.selectAdmin.isAdmin = true;
      })
      .addCase(restoreAdmin.fulfilled, (state) => {
        state.selectAdmin.admin = null;
        state.selectAdmin.isAdmin = false;
      })
      .addCase(restoreAdmin.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearAdminListError, setSelectAdmin, clearSelectAdmin } =
  adminListSlice.actions;
export const getRolePermission = (state: RootState) =>
  state.adminList.rolePermission;
export const getRolePermissionError = (state: RootState) =>
  state.adminList.error;
export const getUpdatePermStatus = (state: RootState) =>
  state.adminList.isUpdatePerm;
export const getRoleStatus = (state: RootState) => state.adminList.isFetching;
export const getSelectAdmin = (state: RootState) => state.adminList.selectAdmin;
export const getMyPerm = (state: RootState) =>
  state.adminList.myPermissions.permission;
export const getMyRole = (state: RootState) =>
  state.adminList.myPermissions.role;

export default adminListSlice.reducer;
