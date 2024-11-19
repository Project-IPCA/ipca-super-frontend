import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { RootState } from "../../../store/store";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

interface Department {
  dept_id: string;
  name: string;
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

interface StudentInfoState {
  studentInfo: StudentInfo | null;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: {
  [key: string]: StudentInfoState;
} = {};

export const fetchStudentInfo = createAsyncThunk(
  "studentInfo/fetchStudentInfo",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.get(
        `${VITE_IPCA_API}/supervisor/student_info/${studentId}`,
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
          isFetching: true,
          error: null,
        };
      })
      .addCase(fetchStudentInfo.fulfilled, (state, action) => {
        const studentId = action.meta.arg;
        state[studentId] = {
          studentInfo: action.payload,
          isFetching: false,
          error: null,
        };
      })
      .addCase(fetchStudentInfo.rejected, (state, action) => {
        const studentId = action.meta.arg;
        state[studentId] = {
          studentInfo: null,
          isFetching: false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      }),
});

export const getStudentDetailState = (state: RootState) => state.studentDetail;

export default studentDetailSlice.reducer;
