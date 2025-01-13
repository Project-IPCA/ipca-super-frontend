import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { resolveApiError } from "../../../utils/function";
import { RootState } from "../../../store/store";
import axiosInstance from "../../../utils/axios";

interface Permission {
  type: string;
  time_start: string;
  time_end: string;
}

export interface GroupChapterPermission {
  allow_access: Permission;
  allow_submit: Permission;
  chapter_id: string;
  chapter_index: number;
  full_mark: number;
  name: string;
}

interface Instructor {
  f_name: string;
  l_name: string;
  supervisor_id: string;
}

interface Staff {
  f_name: string;
  l_name: string;
  supervisor_id: string;
}

export interface GroupData {
  name: string;
  allow_login: boolean;
  allow_upload_profile: boolean;
  day: string;
  department: string;
  group_chapter_permissions: GroupChapterPermission[];
  group_id: string;
  group_no: number;
  instructor: Instructor;
  semester: number;
  staffs: Staff[];
  student_amount: number;
  time_end: string;
  time_start: string;
  year: number;
}

interface GroupDetailState {
  groupDetail: GroupData | null;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: GroupDetailState = {
  groupDetail: null,
  isFetching: false,
  error: null,
};

interface GroupAllowRequest {
  groupId: string;
  allow: boolean;
}

export interface ChapterPermissionRequest {
  chapter_id: string;
  group_id: string;
  permission: {
    prefix: string;
    time_start: string | null;
    time_end: string | null;
    type: string;
  };
  sync: boolean;
}

export const logoutAllStudents = createAsyncThunk(
  "groupExercises/logoutAllStudents",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/supervisor/logout_all_student/${groupId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

export const fetchGroupExercises = createAsyncThunk(
  "groupExercises/fetchGroupExercises",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/supervisor/group/${groupId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

export const updateAllowGroupLogin = createAsyncThunk(
  "groupExerciese/updateAllowGroupLogin",
  async ({ groupId, allow }: GroupAllowRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/supervisor/set_allow_group_login`,
        {
          group_id: groupId,
          allow_login: allow,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

export const updateAllowGroupUploadProfile = createAsyncThunk(
  "groupExerciese/updateAllowGroupUploadProfile",
  async ({ groupId, allow }: GroupAllowRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/supervisor/set_allow_group_upload_picture`,
        {
          group_id: groupId,
          allow_upload_picture: allow,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "groupForm/deleteGroup",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `supervisor/group/${groupId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

const groupDetailSlice = createSlice({
  name: "groupDetail",
  initialState,
  reducers: {
    clearGroupExercisesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchGroupExercises.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchGroupExercises.fulfilled, (state, action) => {
        state.groupDetail = action.payload;
        state.isFetching = false;
      })
      .addCase(fetchGroupExercises.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
        state.isFetching = false;
      })
      .addCase(logoutAllStudents.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
        state.isFetching = false;
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearGroupExercisesError } = groupDetailSlice.actions;

export const getGroupExercise = (state: RootState) =>
  state.groupExercise.groupDetail;

export const getGroupExerciseError = (state: RootState) =>
  state.groupExercise.error;

export default groupDetailSlice.reducer;
