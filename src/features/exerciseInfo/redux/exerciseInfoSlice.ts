import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;
export const VITE_IPCA_RT = import.meta.env.VITE_IPCA_RT;
import axiosInstance from "../../../utils/axios";
import {
  SuggestedConstraint,
  UserConstraint,
} from "../../exerciseForm/ExerciseForm";

export interface Testcase {
  exercise_id: string;
  is_active: boolean;
  is_ready: string;
  show_to_student: boolean;
  testcase_content: string;
  testcase_error: string | null;
  testcase_id: string | null;
  testcase_note: string | null;
  testcase_output: string | null;
}

interface LabExercise {
  added_by: string;
  content: string;
  created_by: string;
  exercise_id: string;
  name: string;
  sourcecode: string;
  suggested_constraints: SuggestedConstraint;
  testcase_list: Testcase[];
  user_defined_constraints: UserConstraint;
}

interface ExerciseInfoState {
  exerciseInfo: LabExercise | null;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: {
  [key: string]: ExerciseInfoState;
} = {};

interface ExerciseTestcaseRequest {
  exercise_id: string;
  job_id: string;
  removed_list: string[];
  testcase_list: Testcase[];
}

export const fetchExercisesInfo = createAsyncThunk(
  "exerciseInfo/fetchExerciseInfo",
  async (exerciseId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/supervisor/get_exercise_data/${exerciseId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

export const updateExerciseTestcase = createAsyncThunk(
  "exerciseInfo/updateExerciseTestcase",
  async (request: ExerciseTestcaseRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${VITE_IPCA_API}/supervisor/save_exercise_testcase`,
        request
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

const exerciseInfoSlice = createSlice({
  name: "exerciseInfoSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchExercisesInfo.pending, (state, action) => {
        const key = action.meta.arg;
        const existState = state[key];
        state[key] = {
          exerciseInfo: existState?.exerciseInfo || null,
          isFetching: true,
          error: null,
        };
      })
      .addCase(fetchExercisesInfo.fulfilled, (state, action) => {
        const key = action.meta.arg;
        state[key] = {
          exerciseInfo: action.payload,
          isFetching: false,
          error: null,
        };
      })
      .addCase(fetchExercisesInfo.rejected, (state, action) => {
        const key = action.meta.arg;
        state[key] = {
          exerciseInfo: null,
          isFetching: false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      }),
});

export const getExercisesInfoState = (state: RootState) => state.exerciseInfo;

export default exerciseInfoSlice.reducer;
