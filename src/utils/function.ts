import { isAxiosError } from "axios";
import {
  API_ERROR_RESPONSE,
  DAY_OF_WEEK,
  DAYS_2_LANGUAGE,
  GENDER_2_LANGUAGE,
  GENDER_LIST,
  LANGUAGE,
  ROLE_2_LANGUAGE,
  ROLE_LIST,
} from "../constants/constants";
import { format, parseISO } from "date-fns";

export const resolveApiError = (error: unknown): API_ERROR_RESPONSE => {
  if (!isAxiosError(error) || !error.response) {
    const data = {
      code: "",
      error: "",
    };
    return data as API_ERROR_RESPONSE;
  }
  return error.response?.data;
};

export const formatDateTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, "yyyy-MM-dd HH:mm:ss");
};

export const getDayFromDayEnum = (day: string, lang: string) => {
  const day2lang = DAYS_2_LANGUAGE[DAY_OF_WEEK.indexOf(day)];

  switch (lang) {
    case LANGUAGE.th:
      return day2lang.th;
    case LANGUAGE.en:
      return day2lang.en;
  }
};

export const getGenderFromEnum = (gender: string, lang: string) => {
  const gender2lang = GENDER_2_LANGUAGE[GENDER_LIST.indexOf(gender)];
  switch (lang) {
    case LANGUAGE.th:
      return gender2lang.th;
    case LANGUAGE.en:
      return gender2lang.en;
  }
};

export const getRoleFromEnum = (role: string, lang: string) => {
  const role2lang = ROLE_2_LANGUAGE[ROLE_LIST.indexOf(role)];
  switch (lang) {
    case LANGUAGE.th:
      return role2lang.th;
    case LANGUAGE.en:
      return role2lang.en;
  }
};
