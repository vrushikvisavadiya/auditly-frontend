"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import ExternalLayout from "@/components/ExternalLayout";
import Icon from "@/components/Icon";
import InputWrapper from "@/components/InputWrapper";
import Modal, { CheckModalHeader } from "@/components/Modal";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { registerUser, resetRegistration } from "@/src/redux/slices/authSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/routes/constants";

// Zod schema for form validation
const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .refine((name) => name.trim().length >= 2, {
      message: "First name must contain at least 2 characters",
    }),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .refine((name) => name.trim().length >= 2, {
      message: "Last name must contain at least 2 characters",
    }),
  orgName: z
    .string()
    .min(1, "Business name is required")
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name cannot exceed 100 characters")
    .refine((name) => name.trim().length >= 2, {
      message: "Business name must contain at least 2 characters",
    }),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine(
      (email) => {
        // Check for common fake/test email patterns
        const fakeEmails = [
          "test@test.com",
          "example@example.com",
          "user@example.com",
          "admin@admin.com",
          "noemail@email.com",
          "abc@abc.com",
          "fake@fake.com",
          "demo@demo.com",
        ];
        return !fakeEmails.includes(email.toLowerCase());
      },
      { message: "Please enter a valid, professional email address" }
    )
    .refine(
      (email) => {
        // Ensure it has a proper domain structure
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      { message: "Please enter a valid email address format" }
    ),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const inputClass = "auditly-input";
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    registrationStatus,
    registrationError,
    registrationMessage,
    registrationInfo,
  } = useAppSelector((s) => s.auth);

  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Open modal exactly once when signup succeeds
  useEffect(() => {
    if (registrationStatus === "succeeded" && !modalOpen) {
      setModalOpen(true);
      const dlg = document.getElementById(
        "signup-success"
      ) as HTMLDialogElement | null;
      if (!dlg) return;
      if (typeof dlg.showModal === "function") {
        if (!dlg.open) dlg.showModal();
      } else if (typeof dlg.show === "function") {
        dlg.show();
      }
    }
  }, [registrationStatus, modalOpen]);

  // Clear registration state on unmount (prevents stale UI)
  useEffect(() => {
    return () => {
      dispatch(resetRegistration());
    };
  }, [dispatch]);

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    if (registrationStatus === "loading") return;

    const payload = {
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      org_name: data.orgName.trim(),
      email: data.email.trim().toLowerCase(),
      phone_number: data.phone.replace(/[\s\-\(\)]/g, ""), // Clean phone number
    };

    await dispatch(registerUser(payload));
  };

  function handleCloseModal() {
    const dlg = document.getElementById(
      "signup-success"
    ) as HTMLDialogElement | null;
    if (dlg) {
      dlg.close();
    }
    setModalOpen(false);
    dispatch(resetRegistration());
    reset(); // Clear the form
  }

  function handleNavigateToLogin() {
    handleCloseModal();
    router.push(ROUTES.LOGIN);
  }

  const page = (
    <ExternalLayout title="Create your account">
      <form
        className="flex flex-col gap-2.5 w-full"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col md:flex-row gap-2.5">
          <InputWrapper
            label="First Name"
            errorMessage={errors.firstName?.message || ""}
          >
            <input
              type="text"
              className={`${inputClass} ${
                errors.firstName ? "border-red-500" : ""
              }`}
              placeholder="First Name"
              {...register("firstName")}
              autoComplete="given-name"
            />
          </InputWrapper>
          <InputWrapper
            label="Last Name"
            errorMessage={errors.lastName?.message || ""}
          >
            <input
              type="text"
              className={`${inputClass} ${
                errors.lastName ? "border-red-500" : ""
              }`}
              placeholder="Last Name"
              {...register("lastName")}
              autoComplete="family-name"
            />
          </InputWrapper>
        </div>

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
            inputMode="email"
          />
        </InputWrapper>

        <InputWrapper
          label="Business Name"
          errorMessage={errors.orgName?.message || ""}
        >
          <input
            type="text"
            className={`${inputClass} ${
              errors.orgName ? "border-red-500" : ""
            }`}
            placeholder="Your registered trading name"
            {...register("orgName")}
            autoComplete="organization"
          />
        </InputWrapper>

        <InputWrapper
          label="Mobile Number"
          errorMessage={errors.phone?.message || ""}
        >
          <input
            type="tel"
            className={`${inputClass} ${errors.phone ? "border-red-500" : ""}`}
            placeholder="+61 400 123 456"
            {...register("phone")}
            autoComplete="tel"
            inputMode="tel"
          />
        </InputWrapper>

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 mt-4">
          <a
            href="/login"
            className="text-[var(--auditly-dark-blue)] [font-family:Poppins] text-sm font-semibold leading-[normal] flex items-center gap-2 hover:text-[var(--auditly-orange)] transition-colors"
          >
            <Icon name="login" className="text-sm" />
            Already have an account? Log in
          </a>
          <Button type="submit" disabled={registrationStatus === "loading"}>
            {registrationStatus === "loading" ? "Submitting..." : "Sign Up"}
          </Button>
        </div>

        {registrationError && (
          <p className="text-red-600 text-sm mt-2" role="alert">
            {registrationError}
          </p>
        )}
      </form>
    </ExternalLayout>
  );

  return (
    <>
      <Modal
        id="signup-success"
        title="Registration Submitted"
        description={
          registrationMessage ||
          "Your application is under review. You'll get an email with your login link to set your password once approved."
        }
        header={<CheckModalHeader />}
        onClose={handleCloseModal}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            <Link href="/about" target="_blank" rel="noreferrer">
              <Button
                iconRight={
                  <Icon name="open_in_new" className="font-light text-lg" />
                }
                className="btn-green w-full"
              >
                Learn more about Auditly
              </Button>
            </Link>

            {/* <div className="flex gap-2">
              <Button className="btn-white flex-1" onClick={handleCloseModal}>
                Stay Here
              </Button>
              <Button
                className="btn-dark-blue flex-1"
                onClick={handleNavigateToLogin}
              >
                Go to Login
              </Button>
            </div> */}
          </div>
        </div>
      </Modal>

      {page}
    </>
  );
}
