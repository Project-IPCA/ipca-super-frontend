import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ERROR_RESPONSE } from "../../../constants/constants";
import { resolveApiError } from "../../../utils/function";
import { RootState } from "../../../store/store";
import axiosInstance from "../../../utils/axios";

interface ProfileInfo {
  user_id: string;
  avatar: string;
  dept: Dept;
  dob: string;
  email: string;
  f_name: string;
  gender: string;
  l_name: string;
  nickname: string;
  tel: string;
}

export interface Dept {
  dept_id: string;
  name: string;
}

interface Selected {
  departments: Dept[];
}

export interface ProfileData {
  profile: ProfileInfo;
  selected: Selected;
}

interface ProfileState {
  data: ProfileData;
  isFetching: boolean;
  isUpdating: boolean;
  error: API_ERROR_RESPONSE | null;
}

const initialState: ProfileState = {
  data: {
    profile: {
      user_id: "",
      avatar: "",
      dept: {
        dept_id: "",
        name: "",
      },
      dob: "",
      email: "",
      f_name: "",
      gender: "",
      l_name: "",
      nickname: "",
      tel: "",
    },
    selected: {
      departments: [],
    },
  },
  isFetching: false,
  isUpdating: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/common/user_info`);
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (
    {
      avatar,
      confirm_new_password,
      current_password,
      dob,
      email,
      gender,
      new_password,
      nickname,
      tel,
      dept_id,
    }: {
      avatar: File | null;
      confirm_new_password: string | null;
      current_password: string | null;
      dob: string | null;
      email: string | null;
      gender: string | null;
      new_password: string | null;
      nickname: string | null;
      tel: string | null;
      dept_id: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      let avatarUrl: string | null = null;
      if (avatar) {
        const formData = new FormData();
        formData.append("file", avatar);

        const response = await axiosInstance.post(
          `/common/user_profile`,
          formData
        );

        avatarUrl = response.data.object_url;
      }
      const response = await axiosInstance.put(`/common/user_info`, {
        avatar: avatarUrl ? avatarUrl : null,
        confirm_new_password: confirm_new_password,
        current_password: current_password,
        dob: dob,
        email: email,
        gender: gender,
        new_password: new_password,
        nickname: nickname,
        tel: tel,
        dept_id: dept_id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(resolveApiError(error));
    }
  }
);

const profileFormSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchProfile.pending, (state, _) => {
        state.isFetching = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data.profile = action.payload.user_info;
        state.data.selected = action.payload.selected;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.data.profile = action.payload.user_info;
        state.data.selected = action.payload.selected;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as API_ERROR_RESPONSE;
      }),
});

export const { clearProfileError } = profileFormSlice.actions;

export const getProfile = (state: RootState) => state.profileForm.data;
export const getProfileStatus = (state: RootState) =>
  state.profileForm.isFetching;
export const getProfileUpdateStatus = (state: RootState) =>
  state.profileForm.isUpdating;
export const getProfileError = (state: RootState) => state.profileForm.error;

export default profileFormSlice.reducer;
