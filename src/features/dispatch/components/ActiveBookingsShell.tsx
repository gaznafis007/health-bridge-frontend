"use client";

import Link from "next/link";

import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { AmbulanceStatusBadge } from "@/features/ambulance/components/AmbulanceStatusBadge";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { getActiveBookings } from "@/lib/ambulance/ambulance.api";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

export function ActiveBookingsShell() {
  const { data, error, isLoading } = useAuthenticatedSWR(
    "dispatch/active-bookings",
    (token) => getActiveBookings(token),
  );

  return (
    <RequireRole allowed={["DISPATCHER", "ADMIN"]}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="Active bookings"
          description="Ambulance requests awaiting or in progress. Select a booking to dispatch."
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}

        {error ? <ErrorMessage message="Could not load active bookings." /> : null}

        {data?.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--color-border)] bg-slate-50 px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">
            No active bookings right now.
          </p>
        ) : null}

        {data?.length ? (
          <ul className="mt-6 space-y-4">
            {data.map((booking) => (
              <li key={booking.id}>
                <Link
                  href={`/dispatch/bookings/${booking.id}`}
                  className="block rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:border-[var(--color-primary)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-heading font-semibold text-[var(--color-text-primary)]">
                        {booking.emergencyType}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {booking.pickupAddress} → {booking.destinationAddress}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <AmbulanceStatusBadge status={booking.status} />
                      <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">
                        ৳{Number.parseFloat(booking.estimatedFare).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </RequireRole>
  );
}
