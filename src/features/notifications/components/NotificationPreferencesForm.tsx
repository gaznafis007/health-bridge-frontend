"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/notifications/notifications.api";
import type { NotificationPreferencesUpdate } from "@/lib/notifications/notifications.types";

export function NotificationPreferencesForm() {
  const { accessToken } = useAuth();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<NotificationPreferencesUpdate>();

  useEffect(() => {
    if (!accessToken) return;
    const token = accessToken;

    async function load() {
      try {
        const prefs = await getNotificationPreferences(token);
        reset({
          emailNotifications: prefs.emailNotifications,
          smsNotifications: prefs.smsNotifications,
          appointmentReminders: prefs.appointmentReminders,
          orderUpdates: prefs.orderUpdates,
          reportNotifications: prefs.reportNotifications,
          prescriptionReminders: prefs.prescriptionReminders,
        });
      } catch (error) {
        setLoadError(getApiErrorMessage(error, "Could not load preferences."));
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [accessToken, reset]);

  async function onSubmit(values: NotificationPreferencesUpdate) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      await updateNotificationPreferences(accessToken, values);
      setSuccess(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not save preferences."));
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (loadError) {
    return <ErrorMessage message={loadError} />;
  }

  const toggles: { name: keyof NotificationPreferencesUpdate; label: string }[] = [
    { name: "emailNotifications", label: "Email notifications" },
    { name: "smsNotifications", label: "SMS notifications" },
    { name: "appointmentReminders", label: "Appointment reminders" },
    { name: "orderUpdates", label: "Order updates" },
    { name: "reportNotifications", label: "Lab report notifications" },
    { name: "prescriptionReminders", label: "Prescription reminders" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {toggles.map(({ name, label }) => (
        <label
          key={name}
          className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3"
        >
          <span className="text-sm font-medium">{label}</span>
          <input type="checkbox" {...register(name)} className="h-5 w-5" />
        </label>
      ))}

      {submitError ? <ErrorMessage message={submitError} /> : null}
      {success ? (
        <p className="text-sm font-medium text-emerald-600">Preferences saved.</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save preferences"}
      </Button>
    </form>
  );
}
