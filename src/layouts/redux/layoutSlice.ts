import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFreshAccessToken } from "../../utils/service";
import axios from "axios";
import { resolveApiError } from "../../utils/function";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

export const logout = createAsyncThunk(
  "layout/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFreshAccessToken();
      const response = await axios.post(
        `${VITE_IPCA_API}/auth/logout`,
        {},
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
