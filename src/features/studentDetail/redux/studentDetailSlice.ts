import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { resolveApiError } from "../../../utils";
import { RootState } from "../../../store/store";
import axiosInstance from "../../../utils/axios";

interface Department {
  dept_id: string;
  name_th: string;
  name_en: string;
}

interface Group {
  group_id: string;
  name: string;
  number: number;
}

export interface StudentInfo {
  avatar: string;
  can_submit: boolean;
  dept: Department;
  dob: string;
  email: string;
  f_name: string;
  gender: string;
  group: Group;
  is_online: boolean;
  kmitl_id: string;
  l_name: string;
  nickname: string;
  tel: string;
  user_id: string;
}

export interface GroupChapterPermission {
  chapter_idx: number;
  access_time_end: string;
  access_time_start: string;
  allow_access: boolean;
  allow_access_type: string;
  allow_submit: boolean;
  allow_submit_type: string;
  chapter_full_mark: number;
  chapter_id: string;
  chapter_name: string;
  class_id: string;
  items: Item[];
  no_items: number;
  status: string;
  submit_time_end: string;
  submit_time_start: string;
  time_end: string;
  time_start: string;
}

interface Item {
  is_access: boolean;
  is_submit: boolean;
  chapter_idx: number;
  full_mark: number;
  item_idx: number;
  marking: number;
  status: string;
  time_end: string;
  time_start: string;
}

interface StudentInfoState {
  studentInfo: StudentInfo | null;
  chapterList: GroupChapterPermission[];
  isFetching: boolean;
  isDeleteStudent: boolean;
  isResetPassword: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: {
  [key: string]: StudentInfoState;
} = {};

export const fetchStudentChapterList = createAsyncThunk(
  "studentInfo/fetchStudentChapterList",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const params = {
        studentId: studentId,
      };
      const response = await axiosInstance.get(
        `/supervisor/student_chapter_list`,
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

export const deleteStudent = createAsyncThunk(
  "studentInfo/deleteStudent",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/supervisor/student/${studentId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const resetStudentPasword = createAsyncThunk(
  "studentInfo/resetStudentPassword",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/supervisor/reset_student_password/${studentId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

export const fetchStudentInfo = createAsyncThunk(
  "studentInfo/fetchStudentInfo",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/supervisor/student_info/${studentId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

const studentDetailSlice = createSlice({
  name: "studentDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchStudentInfo.pending, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: true,
          isDeleteStudent: existStudentInfo?.isDeleteStudent || false,
          isResetPassword: existStudentInfo?.isResetPassword || false,
          error: null,
        };
      })
      .addCase(fetchStudentInfo.fulfilled, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: action.payload,
          chapterList: existStudentInfo?.chapterList,
          isFetching: false,
          isDeleteStudent: existStudentInfo?.isDeleteStudent || false,
          isResetPassword: existStudentInfo?.isResetPassword || false,
          error: null,
        };
      })
      .addCase(fetchStudentInfo.rejected, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: false,
          isDeleteStudent: existStudentInfo?.isDeleteStudent || false,
          isResetPassword: existStudentInfo?.isResetPassword || false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      })
      .addCase(fetchStudentChapterList.pending, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: true,
          isDeleteStudent: existStudentInfo?.isDeleteStudent || false,
          isResetPassword: existStudentInfo?.isResetPassword || false,
          error: null,
        };
      })
      .addCase(fetchStudentChapterList.fulfilled, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: action.payload,
          isFetching: false,
          isDeleteStudent: existStudentInfo?.isDeleteStudent || false,
          isResetPassword: existStudentInfo?.isResetPassword || false,
          error: null,
        };
      })
      .addCase(fetchStudentChapterList.rejected, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: true,
          isDeleteStudent: existStudentInfo?.isDeleteStudent || false,
          isResetPassword: existStudentInfo?.isResetPassword || false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      })
      .addCase(resetStudentPasword.pending, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: existStudentInfo?.isFetching || false,
          isDeleteStudent: existStudentInfo?.isDeleteStudent || false,
          isResetPassword: true,
          error: existStudentInfo?.error || null,
        };
      })
      .addCase(resetStudentPasword.fulfilled, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: existStudentInfo?.isFetching || false,
          isDeleteStudent: existStudentInfo?.isDeleteStudent || false,
          isResetPassword: false,
          error: existStudentInfo?.error || null,
        };
      })

      .addCase(resetStudentPasword.rejected, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: existStudentInfo?.isFetching || false,
          isDeleteStudent: existStudentInfo?.isDeleteStudent || false,
          isResetPassword: false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      })
      .addCase(deleteStudent.pending, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: existStudentInfo?.isFetching || false,
          isDeleteStudent: true,
          isResetPassword: existStudentInfo?.isResetPassword || false,
          error: existStudentInfo?.error || null,
        };
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: existStudentInfo?.isFetching || false,
          isDeleteStudent: false,
          isResetPassword: existStudentInfo?.isResetPassword || false,
          error: existStudentInfo?.error || null,
        };
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        const studentId = action.meta.arg;
        const existStudentInfo = state[studentId];
        state[studentId] = {
          studentInfo: existStudentInfo?.studentInfo || null,
          chapterList: existStudentInfo?.chapterList,
          isFetching: existStudentInfo?.isFetching || false,
          isDeleteStudent: false,
          isResetPassword: existStudentInfo?.isResetPassword || false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      }),
});

export const getStudentDetailState = (state: RootState) => state.studentDetail;

export default studentDetailSlice.reducer;
