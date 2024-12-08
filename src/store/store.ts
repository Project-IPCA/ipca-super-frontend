import { configureStore } from "@reduxjs/toolkit";
import loginFormReducer from "../features/loginForm/redux/loginFormSlice";
import myGroupsReducer from "../features/myGroupsList/redux/myGroupListSlice";
import availableGroupsReducer from "../features/availableGroupList/redux/AvailableGroupListSlice";
import groupFormReducer from "../features/groupForm/redux/groupFormSlice";
import groupExercisesReducer from "../features/groupExercises/redux/groupExercisesSlice";
import groupStudentsReducer from "../features/groupStudents/redux/GroupStudentsSlice";
import profileFormReducer from "../features/profileForm/redux/profileFormSlice";
import studentDetailSlice from "../features/studentDetail/redux/studentDetailSlice";
import exerciseDetailSlice from "../features/exerciseDetail/redux/ExerciseDetailSlice";
import codeDisplaySlice from "../features/codeDisplay/redux/CodeDisplaySlice";
import exercisesPoolSlice from "../features/exercisesPool/redux/ExercisesPoolSlice";

export const store = configureStore({
  reducer: {
    login: loginFormReducer,
    myGroups: myGroupsReducer,
    availableGroups: availableGroupsReducer,
    groupForm: groupFormReducer,
    groupExercise: groupExercisesReducer,
    groupStudent: groupStudentsReducer,
    profileForm: profileFormReducer,
    studentDetail: studentDetailSlice,
    exerciseDetail: exerciseDetailSlice,
    codeDisplay: codeDisplaySlice,
    exercisesPool: exercisesPoolSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
