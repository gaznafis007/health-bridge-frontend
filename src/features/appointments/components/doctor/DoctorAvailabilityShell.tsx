"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { RequireRole } from "@/features/auth/components/RequireRole";
import {
  createAvailability,
  deleteAvailability,
  getDoctorAvailability,
  getHealthCenters,
} from "@/lib/appointments/appointments.api";
import type {
  AvailabilityRule,
  CreateAvailabilityPayload,
  DayOfWeek,
  HealthCenter,
} from "@/lib/appointments/appointments.types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function DoctorAvailabilityShell() {
  const { accessToken } = useAuth();
  const [centers, setCenters] = useState<HealthCenter[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "appointments/doctor/availability",
    getDoctorAvailability,
  );

  useEffect(() => {
    if (!accessToken) return;
    const token = accessToken;
    getHealthCenters(token).then(setCenters).catch(() => {});
  }, [accessToken]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<CreateAvailabilityPayload>({
    defaultValues: {
      healthCenterId: "",
      startTime: "09:00",
      endTime: "12:00",
      slotDurationMinutes: 20,
      isRecurring: true,
      dayOfWeek: "MONDAY",
    },
  });

  const isRecurring = watch("isRecurring");

  async function onSubmit(values: CreateAvailabilityPayload) {
    if (!accessToken) return;
    setSubmitError(null);
    try {
      await createAvailability(accessToken, values);
      await mutate();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not create availability."));
    }
  }

  async function handleDelete(rule: AvailabilityRule) {
    if (!accessToken) return;
    await deleteAvailability(accessToken, rule.id);
    await mutate();
  }

  return (
    <RequireRole allowed={["DOCTOR"]}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <SectionHeader
          title="Availability"
          description="Set recurring or one-off slots patients can book."
          action={
            <Link href="/appointments/doctor" className="text-sm font-semibold text-[var(--color-primary)]">
              Back to schedule
            </Link>
          }
        />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : null}

        {error ? <ErrorMessage message="Could not load availability." /> : null}

        {data && data.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {data.map((rule) => (
              <li
                key={rule.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3"
              >
                <div className="text-sm">
                  <p className="font-medium">
                    {rule.healthCenter?.name ?? rule.healthCenterId}
                  </p>
                  <p className="text-[var(--color-text-secondary)]">
                    {rule.startTime}–{rule.endTime} · {rule.slotDurationMinutes}m ·{" "}
                    {rule.isRecurring ? rule.dayOfWeek : rule.specificDate}
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => handleDelete(rule)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
            No availability rules yet.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4 rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <h3 className="font-heading text-lg font-semibold">Add availability</h3>

          <label className="block text-sm">
            Health center
            <select
              {...register("healthCenterId", { required: true })}
              className="mt-1 w-full rounded-xl border border-[var(--color-border)] px-4 py-3"
            >
              <option value="">Select center</option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Start time
              <input type="time" {...register("startTime")} className="mt-1 w-full rounded-xl border px-4 py-3" />
            </label>
            <label className="block text-sm">
              End time
              <input type="time" {...register("endTime")} className="mt-1 w-full rounded-xl border px-4 py-3" />
            </label>
          </div>

          <label className="block text-sm">
            Slot duration (minutes)
            <input
              type="number"
              {...register("slotDurationMinutes", { valueAsNumber: true })}
              className="mt-1 w-full rounded-xl border px-4 py-3"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isRecurring")} />
            Recurring weekly
          </label>

          {isRecurring ? (
            <label className="block text-sm">
              Day of week
              <select {...register("dayOfWeek")} className="mt-1 w-full rounded-xl border px-4 py-3">
                {(
                  [
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                    "SUNDAY",
                  ] as DayOfWeek[]
                ).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="block text-sm">
              Specific date
              <input type="date" {...register("specificDate")} className="mt-1 w-full rounded-xl border px-4 py-3" />
            </label>
          )}

          {submitError ? <ErrorMessage message={submitError} /> : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add rule"}
          </Button>
        </form>
      </div>
    </RequireRole>
  );
}
