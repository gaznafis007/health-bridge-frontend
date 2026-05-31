"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { StatCard } from "@/components/ui/StatCard";
import { QuickActionLink } from "@/features/dashboard/components/QuickActionLink";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { getDoctorDashboard } from "@/lib/dashboard/dashboard.api";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

export function DoctorDashboardShell() {
  const { data, error, isLoading } = useAuthenticatedSWR(
    "dashboard/doctor",
    getDoctorDashboard,
  );

  const chartData = data
    ? [
        { name: "Scheduled", value: data.counts.scheduled },
        { name: "Completed", value: data.counts.completed },
        { name: "Cancelled", value: data.counts.cancelled },
      ]
    : [];

  return (
    <RequireRole allowed={["DOCTOR"]}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="Doctor dashboard"
          description="Today&apos;s schedule and performance summary."
          action={
            <div className="flex flex-wrap gap-2">
              <QuickActionLink href="/appointments/doctor" label="My schedule" />
              <QuickActionLink href="/appointments/doctor/availability" label="Availability" />
            </div>
          }
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}

        {error ? (
          <ErrorMessage message="We could not load your dashboard. Please try again." />
        ) : null}

        {data ? (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Today&apos;s visits" value={data.todayAppointments.length} />
              <StatCard label="Scheduled (all)" value={data.counts.scheduled} />
              <StatCard label="Completed (all)" value={data.counts.completed} />
              <StatCard
                label="Fees earned today"
                value={`৳${data.feesEarnedToday}`}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                <h3 className="font-heading text-lg font-semibold">Appointment counts</h3>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                <h3 className="font-heading text-lg font-semibold">Today&apos;s appointments</h3>
                {data.todayAppointments.length === 0 ? (
                  <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                    No appointments scheduled for today.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {data.todayAppointments.map((appt) => (
                      <li key={appt.id}>
                        <Link
                          href={`/appointments/doctor/${appt.id}`}
                          className="block rounded-xl border border-[var(--color-border)] px-4 py-3 transition hover:bg-slate-50"
                        >
                          <p className="font-medium">
                            {appt.appointmentTime} — {appt.patient.firstName}{" "}
                            {appt.patient.lastName}
                          </p>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {appt.healthCenter.name} · {appt.status}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        ) : null}
      </div>
    </RequireRole>
  );
}
