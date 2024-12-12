import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

interface Testcase {
  excerise_id: string;
  is_active: boolean;
  is_ready: string;
  show_to_student: boolean;
  testcase_content: string;
  testcase_error: string;
  testcase_id: string;
  testcase_note: string;
  testcase_output: string;
}

interface LabExercise {
  added_by: string;
  content: string;
  created_by: string;
  exercise_id: string;
  name: string;
  sourcecode: string;
  suggested_constraints: number[];
  testcase_list: Testcase[];
  user_defined_constraints: number[];
}

interface ExerciseInfoState {
  exerciseInfo: LabExercise | null;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: {
  [key: string]: ExerciseInfoState;
} = {};

export const fetchExercisesInfo = createAsyncThunk(
  "exerciseInfo/fetchExerciseInfo",
  async (exerciseId: string, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.get(
        `${VITE_IPCA_API}/supervisor/get_exercise_data/${exerciseId}`,
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
