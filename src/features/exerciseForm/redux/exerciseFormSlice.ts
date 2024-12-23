import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";
import axiosInstance from "../../../utils/axios";
import { UserConstraint } from "../ExerciseForm";

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
  reserved_words: Constraint[];
  variables: Constraint[];
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

export interface CheckKeywordRequest {
  exercise_kw_list: UserConstraint;
  sourcecode: string;
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
      const response = await axiosInstance.post(
        `/supervisor/exercise`,
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(resolveApiError(error));
      }
    }
  }
);

export const updateExercise = createAsyncThunk(
  "exerciseForm/updateExercise",
  async (request: EditExerciseFormRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/supervisor/exercise`, request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(resolveApiError(error));
      }
    }
  }
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
