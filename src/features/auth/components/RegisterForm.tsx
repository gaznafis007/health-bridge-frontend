"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { signupAction } from "@/lib/auth/auth.actions";
import type { SignupRole } from "@/lib/auth/auth.types";

interface FormState {
  role: SignupRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  specialization: string;
  qualification: string;
  licenseNumber: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const phonePattern = /^\+?[1-9]\d{7,14}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [form, setForm] = useState<FormState>({
    role: "PATIENT",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    qualification: "",
    licenseNumber: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setFieldErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        role: form.role,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        ...(form.role === "DOCTOR"
          ? {
              specialization: form.specialization.trim(),
              qualification: form.qualification.trim(),
              licenseNumber: form.licenseNumber.trim(),
            }
          : {}),
      };

      const result = await signupAction(payload);

      if (!result.success) {
        setSubmitError(result.error.message);
        if (result.error.fieldErrors) {
          setFieldErrors((current) => ({ ...current, ...result.error.fieldErrors }));
        }
        return;
      }

      setSession(result.data);
      router.replace("/");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">
          I am registering as
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["PATIENT", "Patient", "Book appointments, lab tests, and order medicines."],
              ["DOCTOR", "Doctor", "Manage appointments and patient care workflows."],
            ] as const
          ).map(([value, label, description]) => {
            const selected = form.role === value;

            return (
              <label
                key={value}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  selected
                    ? "border-[var(--color-primary)] bg-sky-50"
                    : "border-[var(--color-border)] bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={selected}
                  onChange={() =>
                    setForm((current) => ({
                      ...current,
                      role: value,
                    }))
                  }
                  className="sr-only"
                />
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {label}
                </p>
                <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
                  {description}
                </p>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="firstName"
          label="First Name"
          value={form.firstName}
          error={fieldErrors.firstName}
          onChange={(value) => setForm((current) => ({ ...current, firstName: value }))}
        />
        <FormField
          id="lastName"
          label="Last Name"
          value={form.lastName}
          error={fieldErrors.lastName}
          onChange={(value) => setForm((current) => ({ ...current, lastName: value }))}
        />
      </div>

      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        error={fieldErrors.email}
        onChange={(value) => setForm((current) => ({ ...current, email: value }))}
      />

      <FormField
        id="phone"
        label="Phone Number"
        type="tel"
        autoComplete="tel"
        value={form.phone}
        hint="e.g. +8801712345678"
        error={fieldErrors.phone}
        onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
      />

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            aria-invalid={fieldErrors.password ? "true" : "false"}
            className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 pr-12 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          8–72 characters
        </p>
        {fieldErrors.password ? (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      {form.role === "DOCTOR" ? (
        <div className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-slate-50 p-5">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            Doctor credentials
          </p>
          <FormField
            id="specialization"
            label="Specialization"
            value={form.specialization}
            error={fieldErrors.specialization}
            onChange={(value) =>
              setForm((current) => ({ ...current, specialization: value }))
            }
          />
          <FormField
            id="qualification"
            label="Qualification"
            value={form.qualification}
            error={fieldErrors.qualification}
            onChange={(value) =>
              setForm((current) => ({ ...current, qualification: value }))
            }
          />
          <FormField
            id="licenseNumber"
            label="License Number"
            value={form.licenseNumber}
            error={fieldErrors.licenseNumber}
            onChange={(value) =>
              setForm((current) => ({ ...current, licenseNumber: value }))
            }
          />
        </div>
      ) : null}

      {submitError ? <ErrorMessage message={submitError} /> : null}

      <Button
        type="submit"
        variant="primary"
        className="w-full rounded-2xl"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-[var(--color-primary)]">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function FormField({
  id,
  label,
  value,
  error,
  hint,
  type = "text",
  autoComplete,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? "true" : "false"}
        className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
      />
      {hint ? <p className="mt-2 text-xs text-[var(--color-text-muted)]">{hint}</p> : null}
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (form.firstName.trim().length < 1) {
    errors.firstName = "First name is required.";
  }

  if (form.lastName.trim().length < 1) {
    errors.lastName = "Last name is required.";
  }

  if (!emailPattern.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!phonePattern.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  if (form.password.length < 8 || form.password.length > 72) {
    errors.password = "Password must be between 8 and 72 characters.";
  }

  if (form.role === "DOCTOR") {
    if (form.specialization.trim().length === 0) {
      errors.specialization = "Specialization is required for doctors.";
    }

    if (form.qualification.trim().length === 0) {
      errors.qualification = "Qualification is required for doctors.";
    }

    if (form.licenseNumber.trim().length === 0) {
      errors.licenseNumber = "License number is required for doctors.";
    }
  }

  return errors;
}
