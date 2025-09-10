// src/redux/slices/authSlice.ts
import { authService } from "@/src/api/auth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type LoginPayload = { email: string; password: string };

type SignupPayload = {
  first_name: string;
  last_name: string;
  org_name: string;
  email: string;
  phone_number: string;
};

type ApiSignupResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    created_at: string;
    contact_person: string;
    org_name: string;
    email: string;
    phone_number: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  };
};

type ApiLoginResponse = {
  success: boolean;
  message: string;
  tokens: {
    access: string;
    refresh: string;
    access_expires_at: number; // epoch (seconds)
    refresh_expires_at: number; // epoch (seconds)
  };
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    platform_role: string | null;
    must_change_password: boolean;
    is_active: boolean;
  };
};

type ApiForgotPasswordResponse = {
  success: boolean;
  message: string;
};

type RegistrationInfo = ApiSignupResponse["data"];

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  platformRole: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
};

type AuthState = {
  // existing login fields...
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  user: { id: string; email: string } | null;
  accessToken: string | null;

  // signup flow (no tokens)
  registrationStatus: "idle" | "loading" | "succeeded" | "failed";
  registrationError: string | null;
  registrationMessage: string | null;
  registrationInfo: RegistrationInfo | null;

  // forgot password flow
  forgotPasswordStatus: "idle" | "loading" | "succeeded" | "failed";
  forgotPasswordError: string | null;
  forgotPasswordMessage: string | null;
};

const initialState: AuthState = {
  status: "idle",
  error: null,
  user: null,
  accessToken: null,

  registrationStatus: "idle",
  registrationError: null,
  registrationMessage: null,
  registrationInfo: null,

  forgotPasswordStatus: "idle",
  forgotPasswordError: null,
  forgotPasswordMessage: null,
};

// Updated thunks using authService
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload);

      const mapped = {
        accessToken: data.tokens.access,
        refreshToken: data.tokens.refresh,
        accessExpiresAt: data.tokens.access_expires_at,
        refreshExpiresAt: data.tokens.refresh_expires_at,
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          platformRole: data.user.platform_role,
          mustChangePassword: data.user.must_change_password,
          isActive: data.user.is_active,
        } as User,
      };

      // Persist (client side)
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", mapped.accessToken);
        localStorage.setItem("refreshToken", mapped.refreshToken);
        localStorage.setItem("accessExpiresAt", String(mapped.accessExpiresAt));
        localStorage.setItem(
          "refreshExpiresAt",
          String(mapped.refreshExpiresAt)
        );
        localStorage.setItem("user", JSON.stringify(mapped.user));
      }

      return mapped;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const data = await authService.signup(payload);
      return {
        message: data.message,
        info: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Sign up failed"
      );
    }
  }
);

export const resetPasswordWithToken = createAsyncThunk(
  "auth/resetPasswordWithToken",
  async (
    {
      uid,
      token,
      newPassword,
      confirmPassword,
    }: {
      uid: string;
      token: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await authService.resetPasswordWithToken({
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      newPassword,
      confirmPassword,
    }: {
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await authService.changePasswordFirstLogin({
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to send reset link"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      state.error = null;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessExpiresAt");
        localStorage.removeItem("refreshExpiresAt");
        localStorage.removeItem("user");
      }
    },
    resetRegistration(state) {
      state.registrationStatus = "idle";
      state.registrationError = null;
      state.registrationMessage = null;
      state.registrationInfo = null;
    },
    resetForgotPassword(state) {
      state.forgotPasswordStatus = "idle";
      state.forgotPasswordError = null;
      state.forgotPasswordMessage = null;
    },
    // Add hydration action for SSR/client sync
    hydrateAuth(state) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            state.accessToken = token;
            state.user = { id: user.id, email: user.email };
            state.status = "succeeded";
          } catch (error) {
            // Clear invalid data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user cases
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          id: action.payload.user.id,
          email: action.payload.user.email,
        };
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.registrationStatus = "loading";
        state.registrationError = null;
        state.registrationMessage = null;
        state.registrationInfo = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registrationStatus = "succeeded";
        state.registrationMessage = action.payload.message;
        state.registrationInfo = action.payload.info;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationStatus = "failed";
        state.registrationError =
          (action.payload as string) || "Sign up failed";
      })
      // Reset Password (first login)
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Reset Password with Token (from email link)
      .addCase(resetPasswordWithToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPasswordWithToken.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(resetPasswordWithToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordStatus = "loading";
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordStatus = "succeeded";
        state.forgotPasswordError = null;
        state.forgotPasswordMessage =
          action.payload?.message || "Reset link sent successfully";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordStatus = "failed";
        state.forgotPasswordError = action.payload as string;
      });
  },
});

export const { logout, resetRegistration, resetForgotPassword, hydrateAuth } =
  authSlice.actions;
export default authSlice.reducer;
