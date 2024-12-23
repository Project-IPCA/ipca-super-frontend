import { createAsyncThunk } from "@reduxjs/toolkit";
import { resolveApiError } from "../../utils/function";
import axiosInstance from "../../utils/axios";

export const logout = createAsyncThunk(
  "layout/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/auth/logout`);
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);
