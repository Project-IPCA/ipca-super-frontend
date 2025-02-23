export interface API_ERROR_RESPONSE {
  code: string | null;
  error: string | null;
}

export const LANGUAGE = {
  th: "th",
  en: "en",
};

export interface Pagination {
  page: number;
  pageSize: number;
  pages: number;
}

export const DAY_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const AVAILABLE_TIME = [
  "8:45 - 11:45",
  "9:00 - 12:00",
  "13:00 - 16:00",
  "13:30 - 16:30",
  "16:30 - 19:30",
];

export const SEMESTER = ["1", "2", "3"];

export const ALLOW_TYPE = {
  always: "ALWAYS",
  deny: "DENY",
  timer: "TIMER",
  timerPaused: "TIME_PAUSED",
  dateTime: "DATETIME",
};

export const PERMISIION_PREFIX = {
  submit: "SUBMIT",
  access: "ACCESS",
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAYS_2_LANGUAGE = [
  {
    en: "Monday",
    th: "วันจันทร์",
  },
  {
    en: "Tuesday",
    th: "วันอังคาร",
  },
  {
    en: "Wednesday",
    th: "วันพุธ",
  },
  {
    en: "Thursday",
    th: "วันพฤหัสบดี",
  },
  {
    en: "Friday",
    th: "วันศุกร์",
  },
  {
    en: "Saturday",
    th: "วันเสาร์",
  },
  {
    en: "Sunday",
    th: "วันอาทิตย์",
  },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const SUBMISSION_STATUS = {
  wrongAnswer: "WRONG_ANSWER",
  accepted: "ACCEPTED",
  error: "ERROR",
  pending: "PENDING",
  rejected: "REJECTED",
};

export const ROLE_LIST = ["TA", "SUPERVISOR", "EXECUTIVE"];
export const ROLE_2_LANGUAGE = [
  {
    th: "ผู้ช่วยสอน",
    en: "Teacher Assistant",
  },
  {
    th: "อาจารย์ผู้สอน",
    en: "Supervisor",
  },
  {
    th: "ผู้บริหาร",
    en: "Executive",
  },
];

export const GENDER_LIST = ["MALE", "FEMALE", "OTHER"];
export const GENDER_2_LANGUAGE = [
  {
    th: "ชาย",
    en: "Male",
  },
  {
    th: "หญิง",
    en: "Female",
  },
  {
    th: "อื่นๆ",
    en: "Other",
  },
];

export const ROLE = {
  ta: "TA",
  supervisor: "SUPERVISOR",
  executive: "EXECUTIVE",
  beyonder: "BEYONDER",
  student: "STUDENT",
};

export const ROLE_DISPLAY_2_LANGUAGE = {
  student: {
    en: "Student",
    th: "นักเรียน",
  },
  ta: {
    en: "Teacher Assistant",
    th: "ผู้ช่วยสอน",
  },
  supervisor: {
    en: "Supervisor",
    th: "อาจารย์",
  },
  executive: {
    en: "Executive",
    th: "ผู้บริหาร",
  },
  beyonder: {
    en: "Beyonder",
    th: "บียอนเดอร์",
  },
  invalid: {
    en: "Invalid",
    th: "ไม่ถูกต้อง",
  },
};

export const ROLE_PERMISSION = [
  "GROUP_ADMIN",
  "STUDENT_ADMIN",
  "EXERCISE_ADMIN",
  "DASHBOARD_ADMIN",
];

export const GROUP_ADMIN = "GROUP_ADMIN";
export const STUDENT_ADMIN = "STUDENT_ADMIN";
export const EXERCISE_ADMIN = "EXERCISE_ADMIN";
export const DASHBOARD_ADMIN = "DASHBOARD_ADMIN";

export type Permission =
  | "GROUP_ADMIN"
  | "STUDENT_ADMIN"
  | "EXERCISE_ADMIN"
  | "DASHBOARD_ADMIN";

export const C_LANG = "C";
export const PYTHON_LANG = "PYTHON";

export const PROGRAMMING_LANG_OPTIONS = [
  { label: "C", value: "C" },
  { label: "Python", value: "PYTHON" },
];
