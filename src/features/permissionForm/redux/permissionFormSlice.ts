import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils/function";

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

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

export const updateChapterPermission = createAsyncThunk(
  "groupExerciese/updateChapterPermission",
  async (chapterPermission: ChapterPermissionRequest, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.post(
        `${VITE_IPCA_API}/supervisor/set_chapter_permission`,
        chapterPermission,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);
