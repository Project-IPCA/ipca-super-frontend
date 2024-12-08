import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

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
      }),
});

export const getExercisesPoolState = (state: RootState) => state.exercisesPool;

export default exercisesPoolSlice.reducer;
