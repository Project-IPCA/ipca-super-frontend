import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import axios from "axios";
import { RootState } from "../../../store/store";
import { resolveApiError } from "../../../utils/function";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

interface LoginState {
  token: string;
  username: string;
  password: string;
  error: API_ERROR_RESPONSE | null;
}

interface UserRequest {
  username: string;
  password: string;
}
const initialState: LoginState = {
  token: "",
  username: "",
  password: "",
  error: null,
};

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async ({ username, password }: UserRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${VITE_IPCA_API}/auth/login`, {
        username: username,
        password: password,
      });
      if (response.status === 200) {
        const token = response.data;
        localStorage.setItem("access_token", token.accessToken);
        localStorage.setItem("refresh_token", token.refreshToken);
        return {
          token: token.accessToken,
        };
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  },
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearErrorState(state) {
      state.error = null;
    },

    setLogoutState(state) {
      state.token = "";
      state.username = "";
      state.password = "";
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.token = initialState.token;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.username = "";
        state.password = "";
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.username = "";
        state.password = "";
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const getLoginState = (state: RootState) => state.login;
export const { clearErrorState, setLogoutState } = loginSlice.actions;
export default loginSlice.reducer;
