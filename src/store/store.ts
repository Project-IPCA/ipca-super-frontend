import { configureStore } from "@reduxjs/toolkit";
import loginFormReducer from "../features/loginForm/redux/loginFormSlice";

export const store = configureStore({
  reducer: {
    login: loginFormReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
