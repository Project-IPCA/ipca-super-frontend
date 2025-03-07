import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import axiosInstance from "../../../utils/axios";
import axios from "axios";
import { resolveApiError } from "../../../utils";
import { RootState } from "../../../store/store";

export interface FormRequest {
  username: string;
  f_name: string;
  l_name: string;
  role: string;
  gender: string;
  dept_id: string;
}

interface AdminFormState {
  error: API_ERROR_RESPONSE | null;
  isFetching: boolean;
}

const initialState: AdminFormState = {
  error: null,
  isFetching: false,
};

export const createAdmin = createAsyncThunk(
  "adminForm/createAdmin",
  async (request: FormRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/supervisor/admin`, request);
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

const adminFormSlice = createSlice({
  name: "adminForm",
  initialState,
  reducers: {
    clearAdminFormError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(createAdmin.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(createAdmin.fulfilled, (state, _) => {
        state.isFetching = false;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearAdminFormError } = adminFormSlice.actions;
export const getAdminFormError = (state: RootState) => state.adminForm.error;
export const getAdminFormStatus = (state: RootState) =>
  state.adminForm.isFetching;
export default adminFormSlice.reducer;
