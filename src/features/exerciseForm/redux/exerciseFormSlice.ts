import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

export const VITE_IPCA_RT = import.meta.env.VITE_IPCA_RT;

interface Constraint {
  keyword: string;
  limit: number;
}

interface Constraints {
  classes: Constraint[];
  functions: Constraint[];
  imports: Constraint[];
  methods: Constraint[];
  reverse_words: Constraint[];
  variablse: Constraint[];
}

export interface ExerciseDataRequest {
  name: string;
  sourcecode: string;
  content: string;
  keyword_constraints: {
    suggested_constraints: Constraints | null;
    user_defined_constraints: Constraints | null;
  };
}

export interface ExerciseFormRequest extends ExerciseDataRequest {
  chapter_id: string;
  level: string;
}

export interface EditExerciseFormRequest extends ExerciseDataRequest {
  job_id: string;
  exercise_id: string;
}

interface ExerciseFormState {
  error: API_ERROR_RESPONSE | null;
  isFetching: boolean;
}

const initialState: ExerciseFormState = {
  error: null,
  isFetching: false,
};

export const createExercise = createAsyncThunk(
  "exerciseForm/createExercise",
  async (request: ExerciseFormRequest, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.post(
        `${VITE_IPCA_API}/supervisor/exercise`,
        request,
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

export const updateExercise = createAsyncThunk(
  "exerciseForm/updateExercise",
  async (request: EditExerciseFormRequest, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.put(
        `${VITE_IPCA_API}/supervisor/exercise`,
        request,
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

const exerciseFormSlice = createSlice({
  name: "exerciseForm",
  initialState,
  reducers: {
    clearExerciseFormError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(createExercise.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearExerciseFormError } = exerciseFormSlice.actions;

export const getExerciseFormError = (state: RootState) =>
  state.exerciseForm.error;

export default exerciseFormSlice.reducer;
