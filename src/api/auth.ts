// src/api/auth.ts
import { authApi, noAuthApi } from "./axiosInstance";
import { ENDPOINTS } from "./endpoints";

// Types
interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  first_name: string;
  last_name: string;
  org_name: string;
  email: string;
  phone_number: string;
}

interface ResetPasswordPayload {
  uid: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

interface ChangePasswordPayload {
  new_password: string;
  confirm_password: string;
}

// Auth API functions
export const authService = {
  // Login user
  login: async (payload: LoginPayload) => {
    const { data } = await noAuthApi.post(ENDPOINTS.LOGIN, payload);
    return data;
  },

  // Register user
  signup: async (payload: SignupPayload) => {
    const { data } = await noAuthApi.post(ENDPOINTS.SIGNUP, payload);
    return data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const { data } = await noAuthApi.post(ENDPOINTS.FORGOT_PASSWORD, { email });
    return data;
  },

  // Reset password with token (from email)
  resetPasswordWithToken: async (payload: ResetPasswordPayload) => {
    const { uid, token, new_password, confirm_password } = payload;
    const url = `${ENDPOINTS.RESET_PASSWORD}?uid=${encodeURIComponent(
      uid
    )}&token=${encodeURIComponent(token)}`;
    const { data } = await noAuthApi.post(url, {
      new_password,
      confirm_password,
    });
    return data;
  },

  // Change password on first login
  changePasswordFirstLogin: async (payload: ChangePasswordPayload) => {
    const { data } = await authApi.post(
      ENDPOINTS.CHANGE_PASSWORD_FIRST_LOGIN,
      payload
    );
    return data;
  },

  // Logout
  logout: async () => {
    try {
      const { data } = await authApi.post(ENDPOINTS.LOGOUT);
      return data;
    } catch (error) {
      // Even if logout fails on server, clear local storage
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    const { data } = await authApi.get(ENDPOINTS.USER_PROFILE);
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await authApi.get(ENDPOINTS.GET_CURRENT_USER);
    return data;
  },
};
