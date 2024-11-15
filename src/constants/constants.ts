export interface API_ERROR_RESPONSE {
  code: string | null;
  error: string | null;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pages: number;
}

export const DAY_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THIRSDAY",
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
