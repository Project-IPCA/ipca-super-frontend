import { isAxiosError } from "axios";
import { API_ERROR_RESPONSE } from "../constants/constants";
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
