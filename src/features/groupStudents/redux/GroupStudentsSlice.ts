import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
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
  },
  isFetching: false,
  error: null,
};

export const fetchGroupStudents = createAsyncThunk(
  "groupStudents/fetchGroupStudents",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const params = {
        group_id: groupId,
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
