import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE, Pagination } from "../../../constants/constants";
import { GroupStudent } from "..";
import { RootState } from "../../../store/store";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

export interface LabInfo {
  chapter_id: string;
  chapter_idx: number;
  full_mark: number;
  name: string;
  no_item: number;
}

interface ChapterScore {
  [key: string]: number;
}

export interface Student {
  avatar: string;
  active: boolean;
  can_submit: boolean;
  chapter_score: ChapterScore;
  f_name: string;
  kmitl_id: string;
  l_name: string;
  midterm_score: number;
  status: boolean;
  stu_id: string;
}

interface GroupStudent {
  group_id: string;
  lab_info: LabInfo[];
  student_list: Student[];
  pagination: Pagination;
}

interface GroupStudentState {
  groupStudent: GroupStudent;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: GroupStudentState = {
  groupStudent: {
    group_id: "",
    lab_info: [],
    student_list: [],
    pagination: {
      page: 1,
      pageSize: 10,
      pages: 10,
    },
  },
  isFetching: false,
  error: null,
};

interface UpdateStudentCanSubmitRequest {
  studentId: string;
  canSubmit: boolean;
}

interface StudentsRequest {
  groupId: string;
  studentsList: string;
}

interface GroupStudentRequest {
  groupId: string;
  page: number;
}

export const addStudents = createAsyncThunk(
  "groupStudents/addStudents",
  async ({ groupId, studentsList }: StudentsRequest, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const request = {
        group_id: groupId,
        students_data: studentsList,
      };
      const response = await axios.post(
        `${VITE_IPCA_API}/supervisor/students`,
        request,
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

export const updateStudentCanSubmit = createAsyncThunk(
  "groupStudents/updateStudentCanSubmit",
  async (
    { studentId, canSubmit }: UpdateStudentCanSubmitRequest,
    { rejectWithValue },
  ) => {
    try {
      const token = getFreshAccessToken();
      const request = {
        can_submit: canSubmit,
      };
      const response = await axios.put(
        `${VITE_IPCA_API}/supervisor/student_can_submit/${studentId}`,
        request,
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

export const fetchGroupStudents = createAsyncThunk(
  "groupStudents/fetchGroupStudents",
  async ({ groupId, page }: GroupStudentRequest, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const params = {
        group_id: groupId,
        page: page,
        pageSize: 10,
      };
      const response = await axios.get(
        `${VITE_IPCA_API}/supervisor/get_student_group_list`,
        {
          params,
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

const groupStudentsSlice = createSlice({
  name: "groupDetail",
  initialState,
  reducers: {
    clearGroupStudentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchGroupStudents.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchGroupStudents.fulfilled, (state, action) => {
        state.groupStudent = action.payload;
        state.isFetching = false;
      })
      .addCase(fetchGroupStudents.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
        state.isFetching = false;
      })
      .addCase(addStudents.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearGroupStudentsError } = groupStudentsSlice.actions;
export const getGroupStudents = (state: RootState) =>
  state.groupStudent.groupStudent;
export const getGroupStudentsStatus = (state: RootState) =>
  state.groupStudent.isFetching;
export const getGroupStudentsError = (state: RootState) =>
  state.groupStudent.error;
export default groupStudentsSlice.reducer;
