import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";
import axiosInstance from "../../../utils/axios";

export interface AssignedExerciseRequest {
  chapter_id: string;
  group_id: string;
  item_id: number;
  select_items: string[];
  chapter_idx: number;
}

interface GroupSelectedLabs {
  [key: string]: string[];
}

export interface LabItem {
  chapter_id: string;
  exercise_id: string;
  item_id: string;
  name: string;
}

interface LabList {
  [key: string]: LabItem[];
}

interface Chapter {
  chapter_id: string;
  chapter_idx: number;
  chapter_name: string;
  group_id: string;
  group_selected_labs: GroupSelectedLabs;
  lab_list: LabList;
  language : string;
}

interface ExercisesPoolState {
  chapterDetail: Chapter | null;
  isFetching: boolean;
  isUpdateExercise: boolean;
  updateExerciseLevel: number;
  error: API_ERROR_RESPONSE | null;
}

const initialState: {
  [key: string]: ExercisesPoolState;
} = {};

interface ExercisePoolRequest {
  groupId: string;
  chapterIdx: number;
}

export const fetchExercisesPool = createAsyncThunk(
  "exercisesPool/fetchExercisesPool",
  async (request: ExercisePoolRequest, { rejectWithValue }) => {
    try {
      const params = {
        group_id: request.groupId,
        chapter_idx: request.chapterIdx,
      };
      const response = await axiosInstance.get(
        `/supervisor/get_lab_chapter_info`,
        {
          params: params,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const updateAssignedExercise = createAsyncThunk(
  "exercisePool/updateAssignedExercise",
  async (request: AssignedExerciseRequest, { rejectWithValue }) => {
    try {
      const newRequest = {
        chapter_id: request.chapter_id,
        group_id: request.group_id,
        item_id: request.item_id,
        select_items: request.select_items,
      };
      const response = await axiosInstance.post(
        `/supervisor/update_group_assigned_chapter_item`,
        newRequest,
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

const exercisesPoolSlice = createSlice({
  name: "exercisesPoolSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchExercisesPool.pending, (state, action) => {
        const { groupId, chapterIdx } = action.meta.arg;
        const key = `${groupId}.${chapterIdx}`;
        const existState = state[key];
        state[key] = {
          chapterDetail: existState?.chapterDetail || null,
          isFetching: true,
          isUpdateExercise: existState?.isUpdateExercise || false,
          error: null,
          updateExerciseLevel: existState?.updateExerciseLevel || 0,
        };
      })
      .addCase(fetchExercisesPool.fulfilled, (state, action) => {
        const { groupId, chapterIdx } = action.meta.arg;
        const key = `${groupId}.${chapterIdx}`;
        state[key] = {
          chapterDetail: action.payload,
          isFetching: false,
          isUpdateExercise: false,
          error: null,
          updateExerciseLevel: 0,
        };
      })
      .addCase(fetchExercisesPool.rejected, (state, action) => {
        const { groupId, chapterIdx } = action.meta.arg;
        const key = `${groupId}.${chapterIdx}`;
        state[key] = {
          chapterDetail: null,
          isFetching: false,
          isUpdateExercise: false,
          error: action.payload as API_ERROR_RESPONSE,
          updateExerciseLevel: 0,
        };
      })
      .addCase(updateAssignedExercise.pending, (state, action) => {
        const { group_id, chapter_idx, item_id } = action.meta.arg;
        const key = `${group_id}.${chapter_idx}`;
        const existState = state[key];
        state[key] = {
          chapterDetail: existState?.chapterDetail || null,
          isFetching: false,
          isUpdateExercise: true,
          error: null,
          updateExerciseLevel: item_id,
        };
      })
      .addCase(updateAssignedExercise.fulfilled, (state, action) => {
        const { group_id, chapter_idx, item_id } = action.meta.arg;
        const key = `${group_id}.${chapter_idx}`;
        const existState = state[key];
        state[key] = {
          chapterDetail: existState?.chapterDetail || null,
          isFetching: false,
          isUpdateExercise: false,
          error: null,
          updateExerciseLevel: item_id,
        };
      })
      .addCase(updateAssignedExercise.rejected, (state, action) => {
        const { group_id, chapter_idx, item_id } = action.meta.arg;
        const key = `${group_id}.${chapter_idx}`;
        const existState = state[key];
        state[key] = {
          chapterDetail: existState?.chapterDetail || null,
          isFetching: false,
          isUpdateExercise: false,
          error: action.payload as API_ERROR_RESPONSE,
          updateExerciseLevel: item_id,
        };
      }),
});

export const getExercisesPoolState = (state: RootState) => state.exercisesPool;

export default exercisesPoolSlice.reducer;
