"use client";

import Link from "next/link";

import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { QuickActionLink } from "@/features/dashboard/components/QuickActionLink";
import { RecentListCard } from "@/features/dashboard/components/RecentListCard";
import { RequireRole } from "@/features/auth/components/RequireRole";
import {
  getPatientDashboard,
} from "@/lib/dashboard/dashboard.api";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

export function PatientDashboardShell() {
  const { data, error, isLoading } = useAuthenticatedSWR(
    "dashboard/patient",
    getPatientDashboard,
  );

  return (
    <RequireRole allowed={["PATIENT"]}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="Patient dashboard"
          description="Your upcoming care, orders, and reports at a glance."
          action={
            <div className="flex flex-wrap gap-2">
              <QuickActionLink href="/appointments" label="Book appointment" />
              <QuickActionLink href="/lab-tests" label="Book lab test" />
              <QuickActionLink href="/ambulance/request" label="Request ambulance" />
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
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <RecentListCard
              title="Upcoming appointments"
              viewAllHref="/appointments/history"
              emptyMessage="No upcoming appointments."
            >
              {data.upcomingAppointments.length === 0 ? null : (
                <ul className="space-y-3">
                  {data.upcomingAppointments.map((appt) => (
                    <li key={appt.id}>
                      <Link
                        href={`/appointments/${appt.id}`}
                        className="block rounded-xl border border-[var(--color-border)] px-4 py-3 transition hover:bg-slate-50"
                      >
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {appt.appointmentTime} — {appt.healthCenter?.name ?? "Clinic"}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {new Date(appt.date).toLocaleDateString()}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </RecentListCard>

            <RecentListCard
              title="Recent lab bookings"
              viewAllHref="/lab-tests/bookings"
              emptyMessage="No lab bookings yet."
            >
              {data.recentLabBookings.length === 0 ? null : (
                <ul className="space-y-3">
                  {data.recentLabBookings.map((booking) => (
                    <li key={booking.id}>
                      <Link
                        href={`/lab-tests/bookings/${booking.id}`}
                        className="block rounded-xl border border-[var(--color-border)] px-4 py-3 transition hover:bg-slate-50"
                      >
                        <p className="font-medium">{booking.center?.name ?? "Lab"}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {booking.bookingStatus}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </RecentListCard>

            <RecentListCard
              title="Recent ambulance bookings"
              viewAllHref="/ambulance/bookings"
              emptyMessage="No ambulance requests yet."
            >
              {data.recentAmbulanceBookings.length === 0 ? null : (
                <ul className="space-y-3">
                  {data.recentAmbulanceBookings.map((booking) => (
                    <li key={booking.id}>
                      <Link
                        href={`/ambulance/bookings/${booking.id}`}
                        className="block rounded-xl border border-[var(--color-border)] px-4 py-3 transition hover:bg-slate-50"
                      >
                        <p className="font-medium">{booking.status}</p>
                        <p className="text-sm text-[var(--color-text-secondary)] truncate">
                          {booking.pickupAddress}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </RecentListCard>

            <RecentListCard
              title="Recent pharmacy orders"
              viewAllHref="/pharmacy/orders"
              emptyMessage="No orders yet."
            >
              {data.recentOrders.length === 0 ? null : (
                <ul className="space-y-3">
                  {data.recentOrders.map((order) => (
                    <li key={order.id}>
                      <Link
                        href={`/pharmacy/orders/${order.id}`}
                        className="block rounded-xl border border-[var(--color-border)] px-4 py-3 transition hover:bg-slate-50"
                      >
                        <p className="font-medium">৳{order.finalAmount}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {order.deliveryStatus}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </RecentListCard>

            <RecentListCard
              title="Recent lab reports"
              viewAllHref="/lab-tests/reports"
              emptyMessage="No reports yet."
            >
              {data.recentReports.length === 0 ? null : (
                <ul className="space-y-3">
                  {data.recentReports.map((report) => (
                    <li key={report.id}>
                      <Link
                        href={`/lab-tests/reports/${report.reportToken}`}
                        className="block rounded-xl border border-[var(--color-border)] px-4 py-3 transition hover:bg-slate-50"
                      >
                        <p className="font-medium">{report.reportFileName}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {report.status}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </RecentListCard>

            <RecentListCard
              title="Recent prescriptions"
              viewAllHref="/appointments/prescriptions"
              emptyMessage="No prescriptions yet."
            >
              {data.recentPrescriptions.length === 0 ? null : (
                <ul className="space-y-3">
                  {data.recentPrescriptions.map((rx) => (
                    <li key={rx.id}>
                      <Link
                        href={`/appointments/${rx.appointmentId}`}
                        className="block rounded-xl border border-[var(--color-border)] px-4 py-3 transition hover:bg-slate-50"
                      >
                        <p className="font-medium">{rx.status}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {new Date(rx.issuedAt).toLocaleDateString()}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </RecentListCard>
          </div>
        ) : null}
      </div>
    </RequireRole>
  );
}
