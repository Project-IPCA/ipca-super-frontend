import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

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
}

interface ExercisesPoolState {
  chapterDetail: Chapter | null;
  isFetching: boolean;
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
      const token = getFreshAccessToken();
      const params = {
        group_id: request.groupId,
        chapter_idx: request.chapterIdx,
      };
      const response = await axios.get(
        `${VITE_IPCA_API}/supervisor/get_lab_chapter_info`,
        {
          params: params,
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

export const updateAssignedExercise = createAsyncThunk(
  "exercisePool/updateAssignedExercise",
  async (request: AssignedExerciseRequest, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const newRequest = {
        chapter_id: request.chapter_id,
        group_id: request.group_id,
        item_id: request.item_id,
        select_items: request.select_items,
      };
      const response = await axios.post(
        `${VITE_IPCA_API}/supervisor/update_group_assigned_chapter_item`,
        newRequest,
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
          error: null,
        };
      })
      .addCase(fetchExercisesPool.fulfilled, (state, action) => {
        const { groupId, chapterIdx } = action.meta.arg;
        const key = `${groupId}.${chapterIdx}`;
        state[key] = {
          chapterDetail: action.payload,
          isFetching: false,
          error: null,
        };
      })
      .addCase(fetchExercisesPool.rejected, (state, action) => {
        const { groupId, chapterIdx } = action.meta.arg;
        const key = `${groupId}.${chapterIdx}`;
        state[key] = {
          chapterDetail: null,
          isFetching: false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      })
      .addCase(updateAssignedExercise.rejected, (state, action) => {
        const { group_id, chapter_idx } = action.meta.arg;
        const key = `${group_id}.${chapter_idx}`;
        const existState = state[key];
        state[key] = {
          chapterDetail: existState?.chapterDetail || null,
          isFetching: false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      }),
});

export const getExercisesPoolState = (state: RootState) => state.exercisesPool;

export default exercisesPoolSlice.reducer;
