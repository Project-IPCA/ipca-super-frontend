export const pageName = {
  Login: "LOGIN",
  ManageStudent: "MANAGE_STUDENT",
  ExerciseSubmit: "EXERCISE_SUBMIT",
};

export const NEGATIVE_ACTION = ["Logout", "Logout All", "Login Repeat"];

export const statusProperties = {
  ACCEPTED: {
    message: "Accepted",
    color: "bg-green-400",
  },
  WRONG_ANSWER: {
    message: "Wrong Answer",
    color: "bg-red-400",
  },
  PENDING: {
    message: "Pending",
    color: "bg-gray-500",
  },
  ERROR: {
    message: "Error",
    color: "bg-red-400",
  },
  REJECTED: {
    message: "Rejected",
    color: "bg-red-400",
  },
};

export type StatusType = keyof typeof statusProperties;
