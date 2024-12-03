export const pageName = {
  Login: "LOGIN",
  ManageStudent: "MANAGE_STUDENT",
  ExerciseSubmit: "EXERCISE_SUBMIT",
};

export const TABLE_HEAD = [
  {
    name : "Time Stampt",
    size : 150
  },
  {
    name :  "Remote IP",
    size : 70
  },
  {
    name : "User Agent",
    size : 150
  },
  {
    name : "Page Name",
    size : 140,
  },
  {
    name :  "Username",
    size : 70,
  },
  {
    name : "Action",
    size : 500
  }
];

export const NEGATIVE_ACTION = ["Logout", "Logout All", "Login Repeat"];

export const statusProperties = {
  "ACCEPTED": {
    message: "Accepted",
    color: "#4CAF50"
  },
  "WRONG_ANSWER": {
    message: "Wrong Answer",
    color: "#F44336"
  },
  "PENDING": {
    message: "Pending",
    color: "#607D8B"
  },
  "ERROR": {
    message: "Error",
    color: "#FF5722"
  },
  "REJECTED": {
    message: "Rejected",
    color: "#FF5722"
  }
}

export type StatusType = keyof typeof statusProperties;