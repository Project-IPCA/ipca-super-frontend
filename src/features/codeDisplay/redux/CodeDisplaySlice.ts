import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import axios from "axios";
import { resolveApiError } from "../../../utils/function";
import { RootState } from "../../../store/store";

const VITE_IPCA_STUDENT_CODE_MINIO = import.meta.env
  .VITE_IPCA_STUDENT_CODE_MINIO;

interface CodeDisplayState {
  code: string | null;
  isFetching: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: {
  [key: string]: CodeDisplayState;
} = {};

export const getCodeFromMinio = createAsyncThunk(
  "codeDisplay/getCodeFromMinio",
  async (fileName: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${VITE_IPCA_STUDENT_CODE_MINIO}/${fileName}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

const codeDisplaySlice = createSlice({
  name: "codeDisplay",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getCodeFromMinio.pending, (state, action) => {
        state[action.meta.arg] = {
          code: null,
          isFetching: true,
          error: null,
        };
      })
      .addCase(getCodeFromMinio.fulfilled, (state, action) => {
        state[action.meta.arg] = {
          code: action.payload,
          isFetching: false,
          error: null,
        };
      })
      .addCase(getCodeFromMinio.rejected, (state, action) => {
        state[action.meta.arg] = {
          code: null,
          isFetching: false,
          error: action.payload as API_ERROR_RESPONSE,
        };
      }),
});
export const getCodeDisplayState = (state: RootState) => state.codeDisplay;

export default codeDisplaySlice.reducer;
