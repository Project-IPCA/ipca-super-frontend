import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resolveApiError } from "../../../utils";
import axiosInstance from "../../../utils/axios";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { RootState } from "../../../store/store";

interface UpdateStudentCanSubmitRequest {
  studentId: string;
  canSubmit: boolean;
}

export const updateStudentCanSubmit = createAsyncThunk(
  "groupStudents/updateStudentCanSubmit",
  async (
    { studentId, canSubmit }: UpdateStudentCanSubmitRequest,
    { rejectWithValue },
  ) => {
    try {
      const request = {
        can_submit: canSubmit,
      };
      const response = await axiosInstance.put(
        `/supervisor/student_can_submit/${studentId}`,
        request,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

interface StudentPermissionFormState {
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: StudentPermissionFormState = {
  isFetching: false,
  error: null,
};

const studentPermissionFormSlice = createSlice({
  name: "studentPermissionForm",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(updateStudentCanSubmit.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(updateStudentCanSubmit.fulfilled, (state, _) => {
        state.isFetching = false;
      })
      .addCase(updateStudentCanSubmit.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const getStudentPermFormStatus = (state: RootState) =>
  state.studentPermissionForm.isFetching;

export default studentPermissionFormSlice.reducer;
