"use client";

import Button from "@/components/Button";
import ExternalLayout from "@/components/ExternalLayout";
import InputWrapper from "@/components/InputWrapper";
import { SuccessToast } from "@/components/Toast";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    toast((t) => (
      <SuccessToast
        t={t}
        title="Reset password link sent!"
        description="A message is sent to your email address for confirmation of password reset"
      />
    ));
  }

  const inputClass = "auditly-input";
  return (
    <ExternalLayout
      title="Forgot Password?"
      subtitle="Please enter the email address you’d like your password reset information sent to"
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
        <InputWrapper
          label="Email Address"
          // errorMessage="This field is required"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </InputWrapper>
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <a
            href="/signup"
            className="text-[var(--auditly-dark-blue)] [font-family:Poppins] text-sm font-semibold leading-[normal]"
          >
            Create an account
          </a>
          <Button type="submit" disabled={!email}>
            Request Reset Link
          </Button>
        </div>
      </form>
    </ExternalLayout>
  );
}
