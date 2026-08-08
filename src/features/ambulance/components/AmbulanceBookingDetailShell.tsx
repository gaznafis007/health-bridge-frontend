"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { AmbulanceLiveMap } from "@/features/ambulance/components/AmbulanceLiveMap";
import { AmbulanceStatusBadge } from "@/features/ambulance/components/AmbulanceStatusBadge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  cancelAmbulanceBooking,
  getAmbulanceBooking,
  getAmbulanceLiveLocation,
  getAmbulanceLocationTrail,
} from "@/lib/ambulance/ambulance.api";
import { formatEstimatedDistance } from "@/lib/ambulance/ambulance.utils";
import type {
  AmbulanceBooking,
  AmbulanceLiveLocation,
  LatLng,
} from "@/lib/ambulance/ambulance.types";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  mapApiErrorMessage,
} from "@/lib/api/errors";

interface AmbulanceBookingDetailShellProps {
  bookingId: string;
}

const LOCATION_POLL_INTERVAL_MS = 5000;
const STATUS_POLL_INTERVAL_MS = 8000;

const timelineSteps = [
  { key: "REQUESTED", label: "Requested" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "ARRIVED", label: "Arrived" },
  { key: "IN_TRANSIT", label: "In transit" },
  { key: "COMPLETED", label: "Completed" },
] as const;

const activeStatuses = new Set([
  "REQUESTED",
  "ACCEPTED",
  "ARRIVED",
  "IN_TRANSIT",
]);

export function AmbulanceBookingDetailShell({
  bookingId,
}: AmbulanceBookingDetailShellProps) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [booking, setBooking] = useState<AmbulanceBooking | null>(null);
  const [liveLocation, setLiveLocation] = useState<AmbulanceLiveLocation | null>(
    null,
  );
  const [trailPoints, setTrailPoints] = useState<LatLng[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace(`/auth/login?redirect=/ambulance/bookings/${bookingId}`);
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function loadBooking() {
      setIsLoading(true);

      try {
        const data = await getAmbulanceBooking(token, bookingId);
        if (!isMounted) return;
        setBooking(data);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace(`/auth/login?redirect=/ambulance/bookings/${bookingId}`);
          return;
        }

        if (getApiErrorStatus(err) === 404) {
          setError("Booking not found.");
          return;
        }

        setError(getApiErrorMessage(err, "We could not load this booking."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBooking();

    return () => {
      isMounted = false;
    };
  }, [accessToken, bookingId, isAuthLoading, router]);

  useEffect(() => {
    if (!accessToken || !booking || !activeStatuses.has(booking.status)) {
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function pollBookingStatus() {
      try {
        const data = await getAmbulanceBooking(token, bookingId);
        if (isMounted) {
          setBooking(data);
        }
      } catch {
        // Ignore transient polling errors; initial load already handled errors.
      }
    }

    pollBookingStatus();
    const intervalId = window.setInterval(pollBookingStatus, STATUS_POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [accessToken, booking?.status, bookingId]);

  useEffect(() => {
    if (!accessToken || !booking || !activeStatuses.has(booking.status)) {
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function pollLocation() {
      try {
        const [location, trail] = await Promise.all([
          getAmbulanceLiveLocation(token, bookingId),
          getAmbulanceLocationTrail(token, bookingId),
        ]);
        if (isMounted) {
          setLiveLocation(location);
          setTrailPoints(
            trail.points.map((p) => ({ lat: p.latitude, lng: p.longitude })),
          );
        }
      } catch {
        // Location may not be available yet — ignore until next poll
      }
    }

    pollLocation();
    const intervalId = window.setInterval(pollLocation, LOCATION_POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [accessToken, booking?.status, bookingId]);

  async function handleCancel() {
    if (!accessToken || !booking) return;

    setIsCancelling(true);
    setCancelError(null);

    try {
      const updated = await cancelAmbulanceBooking(accessToken, booking.id, {
        cancelReason: cancelReason.trim() || "Patient cancelled the request",
      });
      setBooking(updated);
      setShowCancelConfirm(false);
      setCancelReason("");
      setLiveLocation(null);
    } catch (err) {
      setCancelError(mapApiErrorMessage(err, "We could not cancel this request."));
    } finally {
      setIsCancelling(false);
    }
  }

  if (isAuthLoading || isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !booking) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState
          title={error === "Booking not found." ? "Booking not found" : "Something went wrong"}
          description={error ?? "This booking could not be loaded."}
          icon={<AmbulanceIcon />}
          action={
            <Link
              href="/ambulance/bookings"
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              Back to bookings
            </Link>
          }
        />
      </section>
    );
  }

  const destinationLatLng =
    booking.destinationLatitude != null && booking.destinationLongitude != null
      ? {
          lat: booking.destinationLatitude,
          lng: booking.destinationLongitude,
        }
      : null;

  const ambulanceLatLng = liveLocation
    ? { lat: liveLocation.latitude, lng: liveLocation.longitude }
    : null;

  const canCancel = booking.status === "REQUESTED";
  const formattedDistance =
    booking.estimatedDistance != null
      ? formatEstimatedDistance(booking.estimatedDistance)
      : "";

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <Link
            href="/ambulance/bookings"
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            ← Back to bookings
          </Link>
          <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
            Live tracking
          </h1>
        </div>

        <article className="surface-card space-y-5 rounded-[2rem] border border-[var(--color-border)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
                {booking.emergencyType}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Requested {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--color-primary)]">
                ৳{Number.parseFloat(booking.estimatedFare).toFixed(0)}
              </p>
              {formattedDistance ? (
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {formattedDistance}
                </p>
              ) : null}
              <div className="mt-2 flex justify-end">
                <AmbulanceStatusBadge status={booking.status} />
              </div>
            </div>
          </div>

          <ol className="grid gap-3 sm:grid-cols-5">
            {timelineSteps.map((step, index) => {
              const activeIndex = getTimelineIndex(booking.status);
              const isComplete = index <= activeIndex;

              return (
                <li
                  key={step.key}
                  className={`rounded-2xl border px-3 py-3 text-center text-xs font-semibold ${
                    isComplete
                      ? "border-[var(--color-primary)] bg-sky-50 text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"
                  }`}
                >
                  {step.label}
                </li>
              );
            })}
          </ol>

          <dl className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Pickup" value={booking.pickupAddress} />
            <InfoItem label="Destination" value={booking.destinationAddress} />
            <InfoItem label="Vehicle type" value={booking.vehicleTypeRequired} />
            <InfoItem label="Patient condition" value={booking.patientCondition} />
            {booking.specialRequirements ? (
              <InfoItem
                label="Special requirements"
                value={booking.specialRequirements}
                className="sm:col-span-2"
              />
            ) : null}
          </dl>
        </article>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Map
            </h2>
            {liveLocation ? (
              <p className="text-xs text-[var(--color-text-secondary)]">
                Last update: {new Date(liveLocation.recordedAt).toLocaleTimeString()}
              </p>
            ) : (
              <p className="text-xs text-[var(--color-text-secondary)]">
                {activeStatuses.has(booking.status)
                  ? "Waiting for ambulance location..."
                  : "Live tracking unavailable for this status."}
              </p>
            )}
          </div>
          <AmbulanceLiveMap
            pickupLatLng={{
              lat: booking.pickupLatitude,
              lng: booking.pickupLongitude,
            }}
            destinationLatLng={destinationLatLng}
            ambulanceLatLng={ambulanceLatLng}
            trailPoints={trailPoints}
          />
        </section>

        {canCancel ? (
          <div className="space-y-3">
            {cancelError ? <ErrorMessage message={cancelError} /> : null}
            {!showCancelConfirm ? (
              <Button
                type="button"
                variant="danger"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel request
              </Button>
            ) : (
              <div className="surface-card rounded-[2rem] border border-red-200 bg-red-50 p-5">
                <p className="text-sm text-red-800">
                  Cancel this emergency request? Only possible while status is REQUESTED.
                </p>
                <label className="mt-4 block text-sm font-semibold text-red-900">
                  Reason for cancellation (optional)
                  <textarea
                    rows={2}
                    value={cancelReason}
                    onChange={(event) => setCancelReason(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    placeholder="Patient no longer needs ambulance"
                  />
                </label>
                <div className="mt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleCancel}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "Cancelling..." : "Yes, cancel"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCancelConfirm(false);
                      setCancelReason("");
                    }}
                    disabled={isCancelling}
                  >
                    Keep request
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function getTimelineIndex(status: AmbulanceBooking["status"]) {
  if (status === "CANCELLED") return -1;
  if (status === "COMPLETED") return 4;
  if (status === "IN_TRANSIT") return 3;
  if (status === "ARRIVED") return 2;
  if (status === "ACCEPTED") return 1;
  return 0;
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[var(--color-text-primary)]">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 rounded bg-slate-200" />
        <div className="h-72 rounded-[2rem] bg-white" />
        <div className="h-96 rounded-2xl bg-sky-100" />
      </div>
    </section>
  );
}

function AmbulanceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M3 13h1l1.5-4h9l1.5 4H19a2 2 0 0 1 2 2v3h-2M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 13V9h6v4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
