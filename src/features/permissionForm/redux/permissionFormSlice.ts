import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resolveApiError } from "../../../utils/function";
import axiosInstance from "../../../utils/axios";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";

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

interface PermissionFormState {
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: PermissionFormState = {
  isFetching: false,
  error: null,
};

export const updateChapterPermission = createAsyncThunk(
  "groupExerciese/updateChapterPermission",
  async (chapterPermission: ChapterPermissionRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/supervisor/set_chapter_permission`,
        chapterPermission,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

const permissionFormSlice = createSlice({
  name: "permissionForm",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(updateChapterPermission.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(updateChapterPermission.fulfilled, (state, _) => {
        state.isFetching = false;
      })
      .addCase(updateChapterPermission.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const getPermissionFormStatus = (state: RootState) =>
  state.permissionForm.isFetching;

export default permissionFormSlice.reducer;
