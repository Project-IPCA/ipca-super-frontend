import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

interface ExerciseRequest {
  studentId: string;
  chapterIdx: number;
  itemId: number;
}

export interface AssignedExercise {
  chapter_name: string;
  chapter_id: string;
  chapter_index: number;
  content: string;
  exercise_id: string;
  full_mark: number;
  level: string;
  name: string;
  testcase: string;
}

export interface SubmissionHistory {
  exercise_id: string;
  is_loop: boolean;
  marking: number;
  output: string | null;
  result: string;
  sourcecode_filename: string;
  status: string;
  stu_id: string;
  submission_id: string;
  time_submit: string;
  error_message: string;
}

interface AssignedExerciseState {
  exceriseDetail: AssignedExercise | null;
  submissionHistory: SubmissionHistory[];
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: {
  [key: string]: AssignedExerciseState;
} = {};

export const cancelStudentSubmission = createAsyncThunk(
  "studentInfo/cancelStudentSubmission",
  async (submissionId: string, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.put(
        `${VITE_IPCA_API}/supervisor/cancle_student_submission/${submissionId}`,
        null,
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

export const fetchSubmissionHistory = createAsyncThunk(
  "studentInfo/fetchSubmissionHistory",
  async (request: ExerciseRequest, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const params = {
        stu_id: request.studentId,
        chapter_idx: request.chapterIdx,
        item_id: request.itemId,
      };
      const response = await axios.get(
        `${VITE_IPCA_API}/common/student_submission`,
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

export const fetchAssignedExercise = createAsyncThunk(
  "studentInfo/fetchAssignedExercise",
  async (request: ExerciseRequest, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const params = {
        stu_id: request.studentId,
        chapter_idx: request.chapterIdx,
        item_id: request.itemId,
      };
      const response = await axios.get(
        `${VITE_IPCA_API}/supervisor/assigned_student_exercise`,
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

const exerciseDetailSlice = createSlice({
  name: "assignedExerciseSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchAssignedExercise.pending, (state, action) => {
        const { studentId, chapterIdx, itemId } = action.meta.arg;
        const key = `${studentId}.${chapterIdx}.${itemId}`;
        const existExercise = state[key];
        state[key] = {
          exceriseDetail: existExercise?.exceriseDetail || null,
          submissionHistory: existExercise?.submissionHistory,
          isFetching: true,
          error: null,
        };
      })
      .addCase(fetchAssignedExercise.fulfilled, (state, action) => {
        const { studentId, chapterIdx, itemId } = action.meta.arg;
        const key = `${studentId}.${chapterIdx}.${itemId}`;
        const existExercise = state[key];
        state[key] = {
          exceriseDetail: action.payload,
          submissionHistory: existExercise?.submissionHistory,
          isFetching: false,
          error: null,
        };
      })
      .addCase(fetchAssignedExercise.rejected, (state, action) => {
        const { studentId, chapterIdx, itemId } = action.meta.arg;
        const key = `${studentId}.${chapterIdx}.${itemId}`;
        const existExercise = state[key];
        state[key] = {
          exceriseDetail: null,
          submissionHistory: existExercise?.submissionHistory,
          isFetching: false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      })
      .addCase(fetchSubmissionHistory.pending, (state, action) => {
        const { studentId, chapterIdx, itemId } = action.meta.arg;
        const key = `${studentId}.${chapterIdx}.${itemId}`;
        const existExercise = state[key];
        state[key] = {
          exceriseDetail: existExercise?.exceriseDetail,
          submissionHistory: existExercise?.submissionHistory,
          isFetching: true,
          error: null,
        };
      })
      .addCase(fetchSubmissionHistory.fulfilled, (state, action) => {
        const { studentId, chapterIdx, itemId } = action.meta.arg;
        const key = `${studentId}.${chapterIdx}.${itemId}`;
        const existExercise = state[key];
        state[key] = {
          exceriseDetail: existExercise?.exceriseDetail,
          submissionHistory: action.payload,
          isFetching: false,
          error: null,
        };
      })
      .addCase(fetchSubmissionHistory.rejected, (state, action) => {
        const { studentId, chapterIdx, itemId } = action.meta.arg;
        const key = `${studentId}.${chapterIdx}.${itemId}`;
        const existExercise = state[key];
        state[key] = {
          exceriseDetail: existExercise?.exceriseDetail,
          submissionHistory: existExercise?.submissionHistory,
          isFetching: false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      }),
});

export const getExerciseDetailSlice = (state: RootState) =>
  state.exerciseDetail;

export default exerciseDetailSlice.reducer;
