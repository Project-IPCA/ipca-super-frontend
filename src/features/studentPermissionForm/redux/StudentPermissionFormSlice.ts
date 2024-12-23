import { createAsyncThunk } from "@reduxjs/toolkit";
import { resolveApiError } from "../../../utils";
import axiosInstance from "../../../utils/axios";

interface UpdateStudentCanSubmitRequest {
  studentId: string;
  canSubmit: boolean;
}

export const updateStudentCanSubmit = createAsyncThunk(
  "groupStudents/updateStudentCanSubmit",
  async (
    { studentId, canSubmit }: UpdateStudentCanSubmitRequest,
    { rejectWithValue }
  ) => {
    try {
      const request = {
        can_submit: canSubmit,
      };
      const response = await axiosInstance.put(
        `/supervisor/student_can_submit/${studentId}`,
        request
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);
