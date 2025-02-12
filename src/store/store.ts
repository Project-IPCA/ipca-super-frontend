import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
import exerciseFormSlice from "../features/exerciseForm/redux/exerciseFormSlice";
import exerciseInfoSlice from "../features/exerciseInfo/redux/exerciseInfoSlice";
import adminFormSlice from "../features/adminForm/redux/adminFormSlice";
import adminListSlice from "../features/adminList/redux/AdminListSlice";
import dashboardSlice from "../features/dashboard/redux/DashboardSlice";
import groupDashboardSlice from "../features/groupDashboard/redux/groupDashboardSlice";
import groupActivityLogSlice from "../features/groupLogs/redux/groupLogSlice";
import studentPermissionFormSlice from "../features/studentPermissionForm/redux/StudentPermissionFormSlice";
import permissionFormSlice from "../features/permissionForm/redux/permissionFormSlice";

export const RESET_STATE = "RESET_STATE";

const appReducer = combineReducers({
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
  exerciseForm: exerciseFormSlice,
  exerciseInfo: exerciseInfoSlice,
  adminForm: adminFormSlice,
  adminList: adminListSlice,
  dashboard: dashboardSlice,
  groupDashboard: groupDashboardSlice,
  groupActivityLog: groupActivityLogSlice,
  studentPermissionForm: studentPermissionFormSlice,
  permissionForm: permissionFormSlice,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STATE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const resetState = () => ({
  type: RESET_STATE,
});
