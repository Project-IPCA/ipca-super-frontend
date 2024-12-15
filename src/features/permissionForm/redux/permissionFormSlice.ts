import { createAsyncThunk } from "@reduxjs/toolkit";
import { resolveApiError } from "../../../utils/function";
import axiosInstance from "../../../utils/axios";

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

export const updateChapterPermission = createAsyncThunk(
  "groupExerciese/updateChapterPermission",
  async (chapterPermission: ChapterPermissionRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/supervisor/set_chapter_permission`,
        chapterPermission
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);
