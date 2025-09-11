// src/api/organization.ts
import { AxiosResponse } from "axios";
import { authApi } from "./axiosInstance";
import { ENDPOINTS } from "./endpoints";

export interface State {
  id: number;
  code: string;
  name: string;
}

export interface RegistrationGroup {
  id: number;
  number: string;
  name: string;
  audit_type: string;
}

export interface MatchedGroup {
  number: string;
  name: string;
  audit_type: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface MatchGroupsResponse {
  matched_groups: MatchedGroup[];
}

export const organizationService = {
  // Fetch all states
  getStates: async (): Promise<State[]> => {
    try {
      const response: AxiosResponse<ApiResponse<State[]>> = await authApi.get(
        ENDPOINTS.STATES
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch states");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching states:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch states"
      );
    }
  },

  // Fetch all registration groups
  getRegistrationGroups: async (): Promise<RegistrationGroup[]> => {
    try {
      const response: AxiosResponse<ApiResponse<RegistrationGroup[]>> =
        await authApi.get(ENDPOINTS.REGISTRATION_GROUPS);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch registration groups"
        );
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching registration groups:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch registration groups"
      );
    }
  },

  // Match groups based on context
  matchGroups: async (context: string): Promise<MatchedGroup[]> => {
    try {
      const response: AxiosResponse<ApiResponse<MatchGroupsResponse>> =
        await authApi.post(ENDPOINTS.MATCH_GROUPS, { context });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to match groups");
      }

      return response.data.data.matched_groups;
    } catch (error: any) {
      console.error("Error matching groups:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to match groups"
      );
    }
  },
};
