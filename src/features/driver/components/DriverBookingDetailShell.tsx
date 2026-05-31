"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { AmbulanceStatusBadge } from "@/features/ambulance/components/AmbulanceStatusBadge";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { DriverLocationPublisher } from "@/features/driver/components/DriverLocationPublisher";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  driverArrive,
  driverCompleteTrip,
  driverStartTrip,
  getAmbulanceBooking,
} from "@/lib/ambulance/ambulance.api";
import type { AmbulanceBooking } from "@/lib/ambulance/ambulance.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

interface DriverBookingDetailShellProps {
  bookingId: string;
}

const activeStatuses = new Set(["ACCEPTED", "ARRIVED", "IN_TRANSIT"]);

export function DriverBookingDetailShell({ bookingId }: DriverBookingDetailShellProps) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [booking, setBooking] = useState<AmbulanceBooking | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!accessToken) {
      router.replace(`/auth/login?redirect=/driver/bookings/${bookingId}`);
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const data = await getAmbulanceBooking(token, bookingId);
        if (isMounted) {
          setBooking(data);
          setLoadError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        if (getApiErrorStatus(err) === 401) {
          router.replace(`/auth/login?redirect=/driver/bookings/${bookingId}`);
          return;
        }
        setLoadError(getApiErrorMessage(err, "Could not load booking."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [accessToken, bookingId, isAuthLoading, router]);

  async function runAction(
    action: (token: string, id: string) => Promise<AmbulanceBooking>,
  ) {
    if (!accessToken) return;
    setIsActing(true);
    setActionError(null);
    try {
      const updated = await action(accessToken, bookingId);
      setBooking(updated);
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Action failed."));
    } finally {
      setIsActing(false);
    }
  }

  return (
    <RequireRole allowed={["DRIVER"]}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/driver"
          className="text-sm font-semibold text-[var(--color-primary)]"
        >
          ← Back to assignments
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}

        {loadError ? (
          <div className="mt-8">
            <EmptyState title="Booking unavailable" description={loadError} />
          </div>
        ) : null}

        {booking ? (
          <div className="mt-6 space-y-6">
            <SectionHeader
              title={booking.emergencyType}
              description={`${booking.pickupAddress} → ${booking.destinationAddress}`}
              action={<AmbulanceStatusBadge status={booking.status} />}
            />

            <DriverLocationPublisher
              bookingId={booking.id}
              enabled={activeStatuses.has(booking.status)}
            />

            {actionError ? <ErrorMessage message={actionError} /> : null}

            <div className="flex flex-wrap gap-3">
              {booking.status === "ACCEPTED" ? (
                <Button
                  type="button"
                  disabled={isActing}
                  onClick={() => runAction(driverArrive)}
                >
                  Mark arrived
                </Button>
              ) : null}
              {booking.status === "ARRIVED" ? (
                <Button
                  type="button"
                  disabled={isActing}
                  onClick={() => runAction(driverStartTrip)}
                >
                  Start trip
                </Button>
              ) : null}
              {booking.status === "IN_TRANSIT" ? (
                <Button
                  type="button"
                  disabled={isActing}
                  onClick={() => runAction(driverCompleteTrip)}
                >
                  Complete trip
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </RequireRole>
  );
}
