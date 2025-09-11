"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ExternalLayout from "@/components/ExternalLayout";
import InputWrapper from "@/components/InputWrapper";
import { SuccessToast } from "@/components/Toast";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { loginUser } from "@/src/redux/slices/authSlice";
import { fetchCurrentUser } from "@/src/redux/slices/userSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// Zod schema for form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine(
      (email) =>
        !["noemail@email.com", "abc@abc.com", "test@test.com"].includes(
          email.toLowerCase()
        ),
      {
        message: "Please enter a valid email address",
      }
    ),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const inputClass = "auditly-input";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const res = await dispatch(loginUser(data));

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
  };

  return (
    <ExternalLayout title="Log In">
      <form
        className="flex flex-col gap-2.5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputWrapper
          label="Email Address"
          errorMessage={errors.email?.message || ""}
        >
          <input
            type="email"
            className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
            placeholder="you@example.com"
            {...register("email")}
            autoComplete="email"
          />
        </InputWrapper>

        <InputWrapper
          label="Password"
          errorMessage={errors.password?.message || ""}
          topRightElement={
            <a
              href="/forgot-password"
              className="text-[var(--auditly-light-blue)] text-xs font-semibold"
            >
              Forgot Password?
            </a>
          }
        >
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`${inputClass} ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="••••••••"
              {...register("password")}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 hover:opacity-75 transition-opacity"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                name={showPassword ? "visibility_off" : "visibility"}
                className="text-[var(--auditly-light-blue)] hover:text-gray-800 cursor-pointer text-xl"
              />
            </button>
          </div>
        </InputWrapper>

        {error && (
          <p className="text-red-600 text-sm mt-2" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 mt-4">
          <a
            href="/signup"
            className="text-[var(--auditly-dark-blue)] [font-family:Poppins] text-sm font-semibold leading-[normal] flex items-center gap-2 hover:text-[var(--auditly-orange)] transition-colors"
          >
            <Icon name="person_add" className="text-sm" />
            Create an account
          </a>
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </ExternalLayout>
  );
}
