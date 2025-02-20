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

export interface ExeriseRequest {
  request : ExerciseFormRequest | EditExerciseFormRequest
  language : string
}

export interface CheckKeywordRequest {
  exercise_kw_list: UserConstraint;
  sourcecode: string;
}

interface ExerciseFormState {
  error: API_ERROR_RESPONSE | null;
  isFetching: boolean;
  isDelete: boolean;
}

const initialState: ExerciseFormState = {
  error: null,
  isFetching: false,
  isDelete: false,
};

export const createExercise = createAsyncThunk(
  "exerciseForm/createExercise",
  async (request: ExeriseRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/supervisor/exercise/${request.language.toLocaleLowerCase()}`,
        request.request,
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
  async (request: ExeriseRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/supervisor/exercise/${request.language.toLocaleLowerCase()}`, request.request);
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

export const deleteExercise = createAsyncThunk(
  "exerciseForm/deleteExercise",
  async (exercise_id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/supervisor/exercise/${exercise_id}`,
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
      .addCase(createExercise.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(createExercise.fulfilled, (state, _) => {
        state.isFetching = false;
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(updateExercise.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(updateExercise.fulfilled, (state, _) => {
        state.isFetching = false;
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(deleteExercise.pending, (state, _) => {
        state.isDelete = true;
      })
      .addCase(deleteExercise.fulfilled, (state, _) => {
        state.isDelete = false;
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.isDelete = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearExerciseFormError } = exerciseFormSlice.actions;

export const getExerciseFormError = (state: RootState) =>
  state.exerciseForm.error;
export const getExerciseFormStatus = (state: RootState) =>
  state.exerciseForm.isFetching;
export const getExerciseFormDelete = (state: RootState) =>
  state.exerciseForm.isDelete;

export default exerciseFormSlice.reducer;
