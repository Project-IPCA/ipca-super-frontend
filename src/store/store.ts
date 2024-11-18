import { configureStore } from "@reduxjs/toolkit";
import loginFormReducer from "../features/loginForm/redux/loginFormSlice";
import myGroupsReducer from "../features/myGroupsList/redux/myGroupListSlice";
import availableGroupsReducer from "../features/availableGroupList/redux/AvailableGroupListSlice";
import groupFormReducer from "../features/groupForm/redux/groupFormSlice";
import groupExercisesReducer from "../features/groupExercises/redux/groupExercisesSlice";
import groupStudentsReducer from "../features/groupStudents/redux/GroupStudentsSlice";

export const store = configureStore({
  reducer: {
    login: loginFormReducer,
    myGroups: myGroupsReducer,
    availableGroups: availableGroupsReducer,
    groupForm: groupFormReducer,
    groupExercise: groupExercisesReducer,
    groupStudent: groupStudentsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
