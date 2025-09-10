"use client";

import { useState, useEffect, FormEvent } from "react";
import Button from "@/components/Button";
import ExternalLayout from "@/components/ExternalLayout";
import Icon from "@/components/Icon";
import InputWrapper from "@/components/InputWrapper";
import Modal, { CheckModalHeader } from "@/components/Modal";

import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { registerUser, resetRegistration } from "@/src/redux/slices/authSlice";

export default function Signup() {
  const inputClass = "auditly-input";
  const dispatch = useAppDispatch();

  const {
    registrationStatus,
    registrationError,
    registrationMessage,
    registrationInfo,
  } = useAppSelector((s) => s.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Open modal exactly once when signup succeeds
  useEffect(() => {
    if (registrationStatus === "succeeded") {
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
  }, [registrationStatus]);

  // Clear registration state on unmount (prevents stale UI)
  useEffect(() => {
    return () => {
      dispatch(resetRegistration());
    };
  }, [dispatch]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (registrationStatus === "loading") return; // prevent double submit

    // Basic trimming + simple front-end validation
    const _first = firstName.trim();
    const _last = lastName.trim();
    const _org = orgName.trim();
    const _email = email.trim();
    const _phone = phone.trim();

    if (!_first || !_last || !_org || !_email || !_phone) return;

    const payload = {
      first_name: _first,
      last_name: _last,
      org_name: _org,
      email: _email,
      phone_number: _phone,
    };

    await dispatch(registerUser(payload));
  }

  function handleCloseModal() {
    const dlg = document.getElementById(
      "signup-success"
    ) as HTMLDialogElement | null;
    if (dlg) {
      dlg.close();
    }
    dispatch(resetRegistration());
  }

  const page = (
    <ExternalLayout title="Create your account">
      <form
        className="flex flex-col gap-2.5 w-full"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="flex flex-col md:flex-row gap-2.5">
          <InputWrapper label="First Name">
            <input
              type="text"
              className={inputClass}
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
            />
          </InputWrapper>
          <InputWrapper label="Last Name">
            <input
              type="text"
              className={inputClass}
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
            />
          </InputWrapper>
        </div>

        <InputWrapper label="Email Address">
          <input
            type="email"
            className={inputClass}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
          />
        </InputWrapper>

        <InputWrapper label="Business Name">
          <input
            type="text"
            className={inputClass}
            placeholder="Your registered trading name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
            autoComplete="organization"
          />
        </InputWrapper>

        <InputWrapper label="Mobile Number">
          <input
            type="tel"
            className={inputClass}
            placeholder="+61 400 123 456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
            inputMode="tel"
          />
        </InputWrapper>

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <a
            href="/login"
            className="text-[var(--auditly-dark-blue)] [font-family:Poppins] text-sm font-semibold leading-[normal]"
          >
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
          {registrationInfo && (
            <p className="text-sm">
              <strong>Request ID:</strong> {registrationInfo.id} <br />
              <strong>Status:</strong> {registrationInfo.status} <br />
              <strong>Email:</strong> {registrationInfo.email}
            </p>
          )}

          <div className="flex gap-2">
            <a href="/about" target="_blank" rel="noreferrer">
              <Button
                iconRight={
                  <Icon name="open_in_new" className="font-light! text-lg!" />
                }
                className="btn-green"
              >
                Learn more about Auditly
              </Button>
            </a>

            <Button className="btn" onClick={handleCloseModal}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {page}
    </>
  );
}
