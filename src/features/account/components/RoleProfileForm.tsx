"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errors";
import { updateDoctorProfile, updatePatientProfile } from "@/lib/users/users.api";
import type {
  UpdateDoctorProfilePayload,
  UpdatePatientProfilePayload,
} from "@/lib/users/users.types";

export function RoleProfileForm() {
  const { user, accessToken, refreshUser } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (user?.role === "DOCTOR") {
    return (
      <DoctorProfileForm
        accessToken={accessToken}
        refreshUser={refreshUser}
        submitError={submitError}
        setSubmitError={setSubmitError}
        success={success}
        setSuccess={setSuccess}
      />
    );
  }

  if (user?.role === "PATIENT") {
    return (
      <PatientProfileForm
        accessToken={accessToken}
        refreshUser={refreshUser}
        submitError={submitError}
        setSubmitError={setSubmitError}
        success={success}
        setSuccess={setSuccess}
      />
    );
  }

  return (
    <p className="text-sm text-[var(--color-text-secondary)]">
      Role-specific profile fields are not available for your account type.
    </p>
  );
}

function PatientProfileForm({
  accessToken,
  refreshUser,
  submitError,
  setSubmitError,
  success,
  setSuccess,
}: FormShellProps) {
  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<UpdatePatientProfilePayload>();

  async function onSubmit(values: UpdatePatientProfilePayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      await updatePatientProfile(accessToken, values);
      await refreshUser();
      setSuccess(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not update patient profile."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextField label="Blood group" {...register("bloodGroup")} />
      <TextField label="Address" {...register("address")} />
      <TextField label="City" {...register("city")} />
      <TextField label="Emergency contact" {...register("emergencyContact")} />
      <TextField label="Emergency phone" {...register("emergencyPhone")} />
      <TextField label="Allergies" {...register("allergies")} />
      <FormFooter submitError={submitError} success={success} isSubmitting={isSubmitting} />
    </form>
  );
}

function DoctorProfileForm({
  accessToken,
  refreshUser,
  submitError,
  setSubmitError,
  success,
  setSuccess,
}: FormShellProps) {
  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<UpdateDoctorProfilePayload>();

  async function onSubmit(values: UpdateDoctorProfilePayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      await updateDoctorProfile(accessToken, {
        ...values,
        consultationFee: values.consultationFee
          ? Number(values.consultationFee)
          : undefined,
      });
      await refreshUser();
      setSuccess(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not update doctor profile."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextField label="Hospital" {...register("hospital")} />
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Biography</span>
        <textarea
          {...register("biography")}
          rows={4}
          className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
        />
      </label>
      <TextField
        label="Consultation fee"
        type="number"
        step="0.01"
        {...register("consultationFee", { valueAsNumber: true })}
      />
      <FormFooter submitError={submitError} success={success} isSubmitting={isSubmitting} />
    </form>
  );
}

interface FormShellProps {
  accessToken: string | null;
  refreshUser: () => Promise<void>;
  submitError: string | null;
  setSubmitError: (v: string | null) => void;
  success: boolean;
  setSuccess: (v: boolean) => void;
}

function TextField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
      />
    </label>
  );
}

function FormFooter({
  submitError,
  success,
  isSubmitting,
}: {
  submitError: string | null;
  success: boolean;
  isSubmitting: boolean;
}) {
  return (
    <>
      {submitError ? <ErrorMessage message={submitError} /> : null}
      {success ? (
        <p className="text-sm font-medium text-emerald-600">Profile updated successfully.</p>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save details"}
      </Button>
    </>
  );
}
