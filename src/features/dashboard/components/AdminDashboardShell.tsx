"use client";

import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { StatCard } from "@/components/ui/StatCard";
import { QuickActionLink } from "@/features/dashboard/components/QuickActionLink";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { getAdminDashboard } from "@/lib/dashboard/dashboard.api";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

export function AdminDashboardShell() {
  const { data, error, isLoading } = useAuthenticatedSWR(
    "dashboard/admin",
    getAdminDashboard,
  );

  return (
    <RequireRole allowed={["ADMIN"]}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="Admin dashboard"
          description="Platform activity and operational overview."
          action={
            <div className="flex flex-wrap gap-2">
              <QuickActionLink href="/admin" label="Admin hub" />
              <QuickActionLink href="/admin/users" label="Manage users" />
            </div>
          }
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}

        {error ? (
          <ErrorMessage message="We could not load the admin dashboard." />
        ) : null}

        {data ? (
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold">Today</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Orders" value={data.today.orders} />
                <StatCard label="Lab bookings" value={data.today.labBookings} />
                <StatCard label="Appointments" value={data.today.appointments} />
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold">Ambulance</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Active bookings" value={data.ambulance.activeBookings} />
                <StatCard label="Fleet available" value={data.ambulance.fleetAvailable} />
                <StatCard label="Fleet on duty" value={data.ambulance.fleetOnDuty} />
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold">Lab</h3>
              <StatCard
                label="Pending payment bookings"
                value={data.lab.pendingPaymentBookings}
                hint="All-time PENDING_PAYMENT count"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <QuickActionLink href="/admin/pharmacy/orders" label="Pharmacy orders" />
              <QuickActionLink href="/admin/lab/bookings" label="Lab bookings" />
              <QuickActionLink href="/admin/ambulance/fleet" label="Ambulance fleet" />
              <QuickActionLink href="/dispatch" label="Dispatch queue" />
            </div>
          </div>
        ) : null}
      </div>
    </RequireRole>
  );
}
