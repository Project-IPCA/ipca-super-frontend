export const TABLE_HEAD = [
  "Chapter",
  "Score",
  "Access Exercise",
  "Allow Submit",
  "Actions",
];

export const TABS_VALUE = {
  accessExercise: "ACCESS_EXERCISE",
  allowSubmit: "ALLOW_SUBMIT",
};

export const TABS_MENU = [
  {
    label: "Access Exercise",
    value: TABS_VALUE.accessExercise,
  },
  {
    label: "Allow Submit",
    value: TABS_VALUE.allowSubmit,
  },
];

export const TIME_RANGE = {
  timeStart: "timeStart",
  timeEnd: "timeEnd",
};

export const DATE_COMPARE = {
  before: "BEFORE",
  after: "AFTER",
  between: "BETWEEN",
};

export const PERMISSION_VALUE = {
  all: "ALL_PERMISSION",
  access: "ACCESS_PERMISSION",
  submit: "SUBMIT_PERMISSION",
  custom: "CUSTOM_PERMISSION",
};

export const PERMISSION_SELECTED = [
  { label: "All permissions", value: PERMISSION_VALUE.all },
  { label: "Access Permission Only", value: PERMISSION_VALUE.access },
  { label: "Submit Permission Only", value: PERMISSION_VALUE.submit },
  { label: "Custom Permissions", value: PERMISSION_VALUE.custom },
];
