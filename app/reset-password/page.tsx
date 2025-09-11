"use client";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ExternalLayout from "@/components/ExternalLayout";
import InputWrapper from "@/components/InputWrapper";
import { SuccessToast } from "@/components/Toast";
import toast from "react-hot-toast";
import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  resetPassword,
  resetPasswordWithToken,
} from "@/src/redux/slices/authSlice";
import { ROUTES } from "@/src/routes/constants";

// Separate component that uses useSearchParams
function ResetPasswordForm() {
  const inputClass = "auditly-input";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");

  const { status, error } = useAppSelector((s) => s.auth);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Determine which scenario this is
  const isTokenReset = !!(token && uid); // From email link
  const isFirstLogin = !isTokenReset; // From first login

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setLocalError("Password must be at least 8 characters long");
      return;
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(newPassword)) {
      setLocalError("Password must include at least one uppercase letter");
      return;
    }

    // Check for number
    if (!/\d/.test(newPassword)) {
      setLocalError("Password must include at least one number");
      return;
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      setLocalError("Password must include at least one special character");
      return;
    }

    let res;

    if (isTokenReset && token && uid) {
      // Reset with token from email link
      res = await dispatch(
        resetPasswordWithToken({
          uid,
          token,
          newPassword,
          confirmPassword,
        })
      );
    } else {
      // First login password reset
      res = await dispatch(
        resetPassword({
          newPassword,
          confirmPassword,
        })
      );
    }

    if (
      resetPassword.fulfilled.match(res) ||
      resetPasswordWithToken.fulfilled.match(res)
    ) {
      toast((t) => (
        <SuccessToast
          t={t}
          title="Password reset successful!"
          description="You can now log in with your new password."
        />
      ));

      // Redirect based on scenario
      setTimeout(() => {
        if (isTokenReset) {
          router.push("/login"); // From email link -> go to login
        } else {
          router.push(ROUTES.ORGANIZATION); // From first login -> go to welcome
        }
      }, 2000);
    } else {
      toast.error((res.payload as string) || "Failed to reset password");
    }
  }

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <form className="flex flex-col gap-2.5 w-full" onSubmit={handleSubmit}>
      <div className="mb-0">
        <p className="self-stretch text-black text-base font-semibold leading-[normal]">
          Please enter your new password below.
        </p>
        <p className="text-[var(--auditly-light-blue)] text-[10px] leading-relaxed mt-2">
          Must be at least 8 characters and include a number, an uppercase
          letter, and a special character.
        </p>
      </div>

      {/* New Password Field with Toggle Eye */}
      <InputWrapper label="New Password" errorMessage="">
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            className={inputClass}
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 hover:opacity-75 transition-opacity"
            onClick={() => setShowNewPassword(!showNewPassword)}
            aria-label={showNewPassword ? "Hide password" : "Show password"}
          >
            <Icon
              name={showNewPassword ? "visibility_off" : "visibility"}
              className="text-[var(--auditly-light-blue)] hover:text-gray-800 cursor-pointer text-xl"
            />
          </button>
        </div>
      </InputWrapper>

      {/* Confirm Password Field with Toggle Eye */}
      <InputWrapper label="Confirm Password" errorMessage="">
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={inputClass}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 hover:opacity-75 transition-opacity"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            <Icon
              name={showConfirmPassword ? "visibility_off" : "visibility"}
              className="text-[var(--auditly-light-blue)] hover:text-gray-800 cursor-pointer text-xl"
            />
          </button>
        </div>
      </InputWrapper>

      {(error || localError) && (
        <p className="text-red-600 text-sm mt-2" role="alert">
          {localError || error}
        </p>
      )}

      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 mt-4">
        <button
          type="button"
          onClick={handleBackToLogin}
          className="text-[var(--auditly-dark-blue)] [font-family:Poppins] text-sm font-semibold leading-[normal] flex items-center gap-2 hover:text-[var(--auditly-orange)] transition-colors"
        >
          <Icon name="arrow_back" className="text-sm" />
          Back to Login
        </button>

        <Button
          type="submit"
          disabled={status === "loading" || !newPassword || !confirmPassword}
        >
          {status === "loading" ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
}

// Loading component
function ResetPasswordLoading() {
  return (
    <div className="flex flex-col gap-2.5 w-full animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded w-32 ml-auto"></div>
    </div>
  );
}

// Main component with Suspense
export default function ResetPassword() {
  return (
    <ExternalLayout title="Reset Password">
      <Suspense fallback={<ResetPasswordLoading />}>
        <ResetPasswordForm />
      </Suspense>
    </ExternalLayout>
  );
}
