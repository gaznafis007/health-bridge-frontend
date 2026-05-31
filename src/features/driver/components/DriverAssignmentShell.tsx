"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { AmbulanceStatusBadge } from "@/features/ambulance/components/AmbulanceStatusBadge";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getActiveBookings, getAmbulanceBooking } from "@/lib/ambulance/ambulance.api";
import type { AmbulanceBooking } from "@/lib/ambulance/ambulance.types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

export function DriverAssignmentShell() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [bookingId, setBookingId] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const { data: activeBookings, isLoading } = useAuthenticatedSWR(
    "driver/active-bookings",
    (token) => getActiveBookings(token),
  );

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !bookingId.trim()) return;
    setIsLookingUp(true);
    setLookupError(null);
    try {
      await getAmbulanceBooking(accessToken, bookingId.trim());
      router.push(`/driver/bookings/${bookingId.trim()}`);
    } catch (err) {
      setLookupError(getApiErrorMessage(err, "Booking not found or not assigned to you."));
    } finally {
      setIsLookingUp(false);
    }
  }

  return (
    <RequireRole allowed={["DRIVER"]}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="My assignment"
          description="Open your assigned booking to update status and share live location."
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : null}

        {activeBookings?.length ? (
          <ul className="mb-8 space-y-3">
            {activeBookings.map((booking: AmbulanceBooking) => (
              <li key={booking.id}>
                <Link
                  href={`/driver/bookings/${booking.id}`}
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white p-4 transition hover:border-[var(--color-primary)]"
                >
                  <div>
                    <p className="font-semibold">{booking.emergencyType}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {booking.pickupAddress}
                    </p>
                  </div>
                  <AmbulanceStatusBadge status={booking.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <form
          onSubmit={handleLookup}
          className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-slate-50 p-5"
        >
          <p className="text-sm text-[var(--color-text-secondary)]">
            Have a booking ID from dispatch? Enter it below.
          </p>
          <input
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
            placeholder="Booking UUID"
          />
          {lookupError ? <ErrorMessage message={lookupError} /> : null}
          <Button type="submit" disabled={isLookingUp}>
            {isLookingUp ? "Loading..." : "Open booking"}
          </Button>
        </form>
      </div>
    </RequireRole>
  );
}
