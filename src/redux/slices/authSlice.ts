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
          // credentials: "include", // uncomment if your backend sets HttpOnly cookies
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
          mustChangePassword: json.user.must_change_password, // if true naviget to reset password
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        info: json.data, // RegistrationInfo
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { logout, resetRegistration } = authSlice.actions;
export default authSlice.reducer;
