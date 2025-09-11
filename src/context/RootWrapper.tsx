// components/RootWrapper.tsx
"use client";
import React, { useEffect, ReactNode, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { fetchCurrentUser, clearUser } from "@/src/redux/slices/userSlice";
import { logout } from "@/src/redux/slices/authSlice";

interface RootWrapperProps {
  children: ReactNode;
}

export default function RootWrapper({ children }: RootWrapperProps) {
  const dispatch = useAppDispatch();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { status: userStatus, error: userError } = useAppSelector(
    (state) => state.user
  );

  // Get access token from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    }
  }, []);

  // Fetch user when token is available and user status is idle
  useEffect(() => {
    if (accessToken && userStatus === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [accessToken, dispatch, userStatus]);

  // Handle authentication errors
  useEffect(() => {
    if (userError === "Authentication expired") {
      // Clear user and logout
      dispatch(clearUser());
      dispatch(logout());
      // Clear localStorage token
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessExpiresAt");
        localStorage.removeItem("refreshExpiresAt");
        localStorage.removeItem("user");
      }
      setAccessToken(null);
    }
  }, [userError, dispatch]);

  // Show loading state during initial user fetch (only if we have a token)
  if (accessToken && userStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[var(--auditly-dark-blue)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if user fetch fails (non-auth errors)
  if (userError && userError !== "Authentication expired") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{userError}</p>
          <button
            onClick={() => dispatch(fetchCurrentUser())}
            className="px-4 py-2 bg-[var(--auditly-dark-blue)] text-white rounded hover:bg-[var(--auditly-orange)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
