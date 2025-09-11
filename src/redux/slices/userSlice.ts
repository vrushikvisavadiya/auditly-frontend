// src/redux/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/src/api/auth";
import type { RootState } from "../store";

// Updated User interface based on your API response
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization_id: string;
  organization_name: string;
  platform_role: string | null;
  must_change_password: boolean;
  is_active: boolean;
  user_role: string; // "OWNER" in your case
}

// API Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface UserState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};

// Async thunk to fetch current user
export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string; state: RootState }
>("user/fetchCurrentUser", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token =
      state.auth.accessToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null);

    if (!token) {
      throw new Error("No access token");
    }

    // Use authService to get current user
    const response: ApiResponse<User> = await authService.getCurrentUser();

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch user");
    }

    return response.data; // Return the user data from the API response
  } catch (error: any) {
    if (error.response?.status === 401) {
      return rejectWithValue("Authentication expired");
    }
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch user"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          state.user = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.user = null;
      });
  },
});

export const { clearUser, setUser } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;

// Helper selectors for specific user data
export const selectUserFullName = (state: RootState) => {
  const user = state.user.user;
  return user ? `${user.first_name} ${user.last_name}` : "";
};

export const selectUserInitials = (state: RootState) => {
  const user = state.user.user;
  return user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : "";
};

export const selectIsOwner = (state: RootState) => {
  return state.user.user?.user_role === "OWNER";
};

export default userSlice.reducer;
