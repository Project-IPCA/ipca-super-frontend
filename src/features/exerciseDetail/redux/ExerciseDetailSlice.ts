import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";
import axiosInstance from "../../../utils/axios";

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
  isCancelSubmission: boolean;
  error: API_ERROR_RESPONSE | null;
}

interface CancelStudentSubmissionRequest extends ExerciseRequest {
  submissionId: string;
}

const initialState: {
  [key: string]: AssignedExerciseState;
} = {};

export const cancelStudentSubmission = createAsyncThunk(
  "studentInfo/cancelStudentSubmission",
  async (request: CancelStudentSubmissionRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/supervisor/cancle_student_submission/${request.submissionId}`,
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
      const params = {
        stu_id: request.studentId,
        chapter_idx: request.chapterIdx,
        item_id: request.itemId,
      };
      const response = await axiosInstance.get(`/common/student_submission`, {
        params: params,
      });
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
      const params = {
        stu_id: request.studentId,
        chapter_idx: request.chapterIdx,
        item_id: request.itemId,
      };
      const response = await axiosInstance.get(
        `/supervisor/assigned_student_exercise`,
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
          isCancelSubmission: existExercise?.isCancelSubmission || false,
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
          isCancelSubmission: existExercise?.isCancelSubmission || false,
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
          isCancelSubmission: existExercise?.isCancelSubmission || false,
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
          isCancelSubmission: existExercise?.isCancelSubmission || false,
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
          isCancelSubmission: existExercise?.isCancelSubmission || false,
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
          isCancelSubmission: existExercise?.isCancelSubmission || false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      })
      .addCase(cancelStudentSubmission.pending, (state, action) => {
        const { studentId, chapterIdx, itemId } = action.meta.arg;
        const key = `${studentId}.${chapterIdx}.${itemId}`;
        const existExercise = state[key];
        state[key] = {
          exceriseDetail: existExercise?.exceriseDetail,
          submissionHistory: existExercise?.submissionHistory,
          isFetching: existExercise?.isFetching,
          isCancelSubmission: true,
          error: null,
        };
      })
      .addCase(cancelStudentSubmission.fulfilled, (state, action) => {
        const { studentId, chapterIdx, itemId } = action.meta.arg;
        const key = `${studentId}.${chapterIdx}.${itemId}`;
        const existExercise = state[key];
        state[key] = {
          exceriseDetail: existExercise?.exceriseDetail,
          submissionHistory: existExercise?.submissionHistory,
          isFetching: existExercise?.isFetching,
          isCancelSubmission: false,
          error: null,
        };
      })
      .addCase(cancelStudentSubmission.rejected, (state, action) => {
        const { studentId, chapterIdx, itemId } = action.meta.arg;
        const key = `${studentId}.${chapterIdx}.${itemId}`;
        const existExercise = state[key];
        state[key] = {
          exceriseDetail: existExercise?.exceriseDetail,
          submissionHistory: existExercise?.submissionHistory,
          isFetching: existExercise?.isFetching,
          isCancelSubmission: false,
          error: null,
        };
      }),
});

export const getExerciseDetailSlice = (state: RootState) =>
  state.exerciseDetail;

export default exerciseDetailSlice.reducer;
