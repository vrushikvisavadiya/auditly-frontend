"use client";

import Button from "@/components/Button";
import ExternalLayout from "@/components/ExternalLayout";
import InputWrapper from "@/components/InputWrapper";
import { SuccessToast } from "@/components/Toast";
import { forgotPassword } from "@/src/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const dispatch = useAppDispatch();
  const { forgotPasswordStatus, forgotPasswordError, forgotPasswordMessage } =
    useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    const result = await dispatch(forgotPassword({ email: email.trim() }));
    console.log("result: ", result);

    if (forgotPassword.fulfilled.match(result)) {
      toast((t) => (
        <SuccessToast
          t={t}
          title="Reset password link sent!"
          description={
            forgotPasswordMessage ||
            "A message is sent to your email address for confirmation of password reset"
          }
        />
      ));
    } else {
      toast.error(forgotPasswordError || "Failed to send reset link");
    }
  }

  const inputClass = "auditly-input";
  const isLoading = forgotPasswordStatus === "loading";
  const emailSent = forgotPasswordStatus === "succeeded";

  return (
    <ExternalLayout
      title="Forgot Password?"
      subtitle="Please enter the email address you'd like your password reset information sent to"
      aboveTitleComponent={
        emailSent && (
          <div
            className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
            role="alert"
          >
            If the email address you entered is registered, you will receive a
            password reset link shortly.
          </div>
        )
      }
    >
      <form className="flex flex-col gap-2.5 w-full" onSubmit={handleSubmit}>
        <InputWrapper label="Email Address">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={isLoading}
          />
        </InputWrapper>

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <a
            href="/signup"
            className="text-[var(--auditly-dark-blue)] [font-family:Poppins] text-sm font-semibold leading-[normal]"
          >
            Create an account
          </a>
          <Button type="submit" disabled={!email || isLoading}>
            {isLoading ? "Sending..." : "Request Reset Link"}
          </Button>
        </div>

        {forgotPasswordError && forgotPasswordStatus === "failed" && (
          <p className="text-red-600 text-sm mt-2" role="alert">
            {forgotPasswordError}
          </p>
        )}
      </form>
    </ExternalLayout>
  );
}
