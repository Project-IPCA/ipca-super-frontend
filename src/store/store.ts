import { configureStore } from "@reduxjs/toolkit";
import loginFormReducer from "../features/loginForm/redux/loginFormSlice";
import myGroupsReducer from "../features/myGroupsList/redux/myGroupListSlice";
import groupFormReducer from "../features/groupForm/redux/groupFormSlice";
import groupExercisesReducer from "../features/groupExercises/redux/groupExercisesSlice";

export const store = configureStore({
  reducer: {
    login: loginFormReducer,
    myGroups: myGroupsReducer,
    groupForm: groupFormReducer,
    groupExercise: groupExercisesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
