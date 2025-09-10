// src/redux/slices/authSlice.ts
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

// Add proper type for forgot password response
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

  // forgot password flow - ADD THESE FIELDS
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

  // ADD THESE INITIAL VALUES
  forgotPasswordStatus: "idle",
  forgotPasswordError: null,
  forgotPasswordMessage: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/accounts/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const json = (await res
        .json()
        .catch(() => null)) as ApiLoginResponse | null;

      if (!res.ok || !json) {
        return rejectWithValue(json?.message || "Login failed");
      }

      const mapped = {
        accessToken: json.tokens.access,
        refreshToken: json.tokens.refresh,
        accessExpiresAt: json.tokens.access_expires_at,
        refreshExpiresAt: json.tokens.refresh_expires_at,
        user: {
          id: json.user.id,
          email: json.user.email,
          firstName: json.user.firstName,
          lastName: json.user.lastName,
          platformRole: json.user.platform_role,
          mustChangePassword: json.user.must_change_password,
          isActive: json.user.is_active,
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
    } catch (e: any) {
      return rejectWithValue(e?.message || "Network error");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/accounts/signup/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = (await res
        .json()
        .catch(() => null)) as ApiSignupResponse | null;

      if (!res.ok || !json?.success) {
        return rejectWithValue(json?.message || "Sign up failed");
      }

      return {
        message: json.message,
        info: json.data,
      };
    } catch (e: any) {
      return rejectWithValue(e?.message || "Network error");
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/accounts/reset-password/?uid=${uid}&token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to reset password");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Network error occurred");
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
    const authToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/accounts/change-password-first-login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to reset password");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Network error occurred");
    }
  }
);

// FIXED FORGOT PASSWORD THUNK
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/accounts/forgot-password/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      // Parse JSON once
      const json = (await res
        .json()
        .catch(() => null)) as ApiForgotPasswordResponse | null;

      if (!res.ok) {
        return rejectWithValue(json?.message || "Failed to send reset link");
      }

      // Return the parsed JSON, not res.json() again
      return json;
    } catch (e: any) {
      return rejectWithValue(e?.message || "Network error");
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

export const { logout, resetRegistration, resetForgotPassword } =
  authSlice.actions;
export default authSlice.reducer;
