"use client";

import Link from "next/link";
import { useState } from "react";

import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { AppointmentStatusBadge } from "@/features/appointments/components/AppointmentStatusBadge";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { getDoctorAppointments } from "@/lib/appointments/appointments.api";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function DoctorScheduleShell() {
  const [from, setFrom] = useState(todayIsoDate());
  const [toInclusive, setToInclusive] = useState(todayIsoDate());

  const { data, error, isLoading } = useAuthenticatedSWR(
    `appointments/doctor?from=${from}&to=${toInclusive}`,
    (token) => getDoctorAppointments(token, { from, toInclusive }),
  );

  return (
    <RequireRole allowed={["DOCTOR"]}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <SectionHeader
          title="My schedule"
          description="View and manage your appointments."
          action={
            <Link
              href="/appointments/doctor/availability"
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Manage availability
            </Link>
          }
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <label className="text-sm">
            From
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="ml-2 rounded-lg border border-[var(--color-border)] px-3 py-2"
            />
          </label>
          <label className="text-sm">
            To
            <input
              type="date"
              value={toInclusive}
              onChange={(e) => setToInclusive(e.target.value)}
              className="ml-2 rounded-lg border border-[var(--color-border)] px-3 py-2"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}

        {error ? <ErrorMessage message="Could not load schedule." /> : null}

        {data && data.length === 0 ? (
          <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
            No appointments in this range.
          </p>
        ) : null}

        <ul className="mt-8 space-y-4">
          {data?.map((appt) => (
            <li key={appt.id}>
              <Link
                href={`/appointments/doctor/${appt.id}`}
                className="block rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:bg-slate-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {appt.startTime} — {appt.patient?.firstName}{" "}
                      {appt.patient?.lastName}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {new Date(appt.date).toLocaleDateString()} ·{" "}
                      {appt.healthCenter?.name}
                    </p>
                  </div>
                  <AppointmentStatusBadge status={appt.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </RequireRole>
  );
}
