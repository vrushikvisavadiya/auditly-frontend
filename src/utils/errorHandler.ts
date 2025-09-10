// src/utils/errorHandler.ts
import { AxiosError } from "axios";

export const handleApiError = (error: AxiosError): string => {
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as any;
    return data?.message || data?.error || "An error occurred";
  } else if (error.request) {
    // Request made but no response received
    return "Network error - please check your connection";
  } else {
    // Something else happened
    return error.message || "An unexpected error occurred";
  }
};
