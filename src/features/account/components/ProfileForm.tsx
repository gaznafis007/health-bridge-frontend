"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errors";
import { updateProfile } from "@/lib/users/users.api";
import type { UpdateProfilePayload } from "@/lib/users/users.types";

export function ProfileForm() {
  const { user, accessToken, refreshUser } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfilePayload>({
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      profilePicture: user?.profilePicture ?? "",
    },
  });

  async function onSubmit(values: UpdateProfilePayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);

    try {
      await updateProfile(accessToken, {
        firstName: values.firstName,
        lastName: values.lastName,
        profilePicture: values.profilePicture || undefined,
      });
      await refreshUser();
      setSuccess(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not update profile."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="First name" error={errors.firstName?.message}>
        <input
          {...register("firstName", { required: "First name is required" })}
          className={inputClass}
        />
      </Field>
      <Field label="Last name" error={errors.lastName?.message}>
        <input
          {...register("lastName", { required: "Last name is required" })}
          className={inputClass}
        />
      </Field>
      <Field label="Profile picture URL" error={errors.profilePicture?.message}>
        <input {...register("profilePicture")} className={inputClass} type="url" />
      </Field>

      {submitError ? <ErrorMessage message={submitError} /> : null}
      {success ? (
        <p className="text-sm font-medium text-emerald-600">Profile updated successfully.</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)]";
