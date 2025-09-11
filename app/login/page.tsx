"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import ExternalLayout from "@/components/ExternalLayout";
import InputWrapper from "@/components/InputWrapper";
import { SuccessToast } from "@/components/Toast";
import toast from "react-hot-toast";
import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { loginUser } from "@/src/redux/slices/authSlice";
import { fetchCurrentUser } from "@/src/redux/slices/userSlice";

export default function Login() {
  const inputClass = "auditly-input";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(res)) {
      toast((t) => (
        <SuccessToast
          t={t}
          title="Login Successful"
          description={`Welcome back, ${res.payload.user.firstName}!`}
        />
      ));
      // Fetch current user data immediately after login
      await dispatch(fetchCurrentUser());

      if (res?.payload.user?.mustChangePassword) {
        router.push("/reset-password");
      } else {
        router.push("/welcome");
      }
    } else {
      toast.error((res.payload as string) || "Invalid credentials");
    }
  }

  return (
    <ExternalLayout title="Log In">
      <form className="flex flex-col gap-2.5 w-full" onSubmit={handleSubmit}>
        <InputWrapper label="Email Address" errorMessage="">
          <input
            type="email"
            className={inputClass}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </InputWrapper>

        <InputWrapper
          label="Password"
          topRightElement={
            <a
              href="/forgot-password"
              className="text-[var(--auditly-light-blue)] text-xs font-semibold"
            >
              Forgot Password?
            </a>
          }
        >
          <input
            type="password"
            className={inputClass}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </InputWrapper>

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <a
            href="/signup"
            className="text-[var(--auditly-dark-blue)] [font-family:Poppins] text-sm font-semibold leading-[normal]"
          >
            Create an account
          </a>
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Logging in..." : "Login"}
          </Button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2" role="alert">
            {error}
          </p>
        )}
      </form>
    </ExternalLayout>
  );
}
