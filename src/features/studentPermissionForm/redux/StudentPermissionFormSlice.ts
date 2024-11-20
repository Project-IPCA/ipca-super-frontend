import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../../utils";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

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
