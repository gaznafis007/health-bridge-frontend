"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LabReportCard } from "@/features/labs/components/LabReportCard";
import { LabStatusBadge } from "@/features/labs/components/LabStatusBadge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  cancelBooking,
  getBooking,
  getBookingReports,
} from "@/lib/labs/labs.api";
import type { LabBooking, LabReport } from "@/lib/labs/labs.types";
import { getApiErrorMessage, getApiErrorStatus, mapApiErrorMessage } from "@/lib/api/errors";

interface LabBookingDetailShellProps {
  bookingId: string;
}

const timelineSteps = [
  { key: "PENDING_PAYMENT", label: "Pending payment" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "COLLECTED", label: "Sample collected" },
  { key: "PROCESSING", label: "Processing" },
  { key: "COMPLETED", label: "Completed" },
] as const;

export function LabBookingDetailShell({ bookingId }: LabBookingDetailShellProps) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [booking, setBooking] = useState<LabBooking | null>(null);
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace(`/auth/login?redirect=/lab-tests/bookings/${bookingId}`);
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function loadBookingDetail() {
      setIsLoading(true);

      try {
        const [bookingData, reportsData] = await Promise.all([
          getBooking(token, bookingId),
          getBookingReports(token, bookingId).catch(() => [] as LabReport[]),
        ]);

        if (!isMounted) return;

        setBooking(bookingData);
        setReports(reportsData);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace(`/auth/login?redirect=/lab-tests/bookings/${bookingId}`);
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

    loadBookingDetail();

    return () => {
      isMounted = false;
    };
  }, [accessToken, bookingId, isAuthLoading, router]);

  async function handleCancel() {
    if (!accessToken || !booking) return;

    setIsCancelling(true);
    setCancelError(null);

    try {
      const updated = await cancelBooking(accessToken, booking.id);
      setBooking(updated);
      setShowCancelConfirm(false);
    } catch (err) {
      setCancelError(mapApiErrorMessage(err, "We could not cancel this booking."));
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
          icon={<FlaskIcon />}
          action={
            <Link
              href="/lab-tests/bookings"
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              Back to bookings
            </Link>
          }
        />
      </section>
    );
  }

  const canCancel =
    booking.bookingStatus === "PENDING_PAYMENT" ||
    booking.bookingStatus === "CONFIRMED";

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <Link
            href="/lab-tests/bookings"
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            ← Back to bookings
          </Link>
          <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
            Booking details
          </h1>
        </div>

        <article className="surface-card space-y-6 rounded-[2rem] border border-[var(--color-border)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
                {booking.center?.name ?? "Diagnostic center"}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Booked {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
            <p className="text-2xl font-bold text-[var(--color-primary)]">
              ৳{Number.parseFloat(booking.totalAmount).toFixed(0)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <LabStatusBadge status={booking.bookingStatus} kind="booking" />
            <LabStatusBadge status={booking.sampleStatus} kind="sample" />
            <LabStatusBadge status={booking.paymentStatus} kind="payment" />
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Sample date" value={booking.sampleCollectionDate} />
            <InfoItem label="Sample time" value={booking.sampleCollectionTime} />
            <InfoItem label="Payment method" value={booking.paymentMethod} />
            {booking.notes ? (
              <InfoItem label="Notes" value={booking.notes} className="sm:col-span-2" />
            ) : null}
          </dl>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              Progress
            </h3>
            <ol className="grid gap-3 sm:grid-cols-5">
              {timelineSteps.map((step, index) => {
                const activeIndex = getTimelineIndex(booking);
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
          </div>

          <div>
            <h3 className="mb-3 font-heading text-lg font-semibold text-[var(--color-text-primary)]">
              Items
            </h3>
            <ul className="space-y-2">
              {booking.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
                >
                  <span>{item.test?.name ?? item.package?.name ?? "Item"}</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    ৳{Number.parseFloat(item.price).toFixed(0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
            Reports
          </h2>
          {reports.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">
              No reports yet. They will appear here when ready.
            </p>
          ) : (
            reports.map((report) => (
              <LabReportCard key={report.id} report={report} />
            ))
          )}
        </section>

        {canCancel ? (
          <div className="space-y-3">
            {cancelError ? <ErrorMessage message={cancelError} /> : null}
            {!showCancelConfirm ? (
              <Button type="button" variant="danger" onClick={() => setShowCancelConfirm(true)}>
                Cancel booking
              </Button>
            ) : (
              <div className="surface-card rounded-[2rem] border border-red-200 bg-red-50 p-5">
                <p className="text-sm text-red-800">
                  Are you sure you want to cancel this booking?
                </p>
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
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={isCancelling}
                  >
                    Keep booking
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

function getTimelineIndex(booking: LabBooking) {
  if (booking.bookingStatus === "CANCELLED") return -1;

  if (booking.sampleStatus === "COMPLETED" || booking.sampleStatus === "DELIVERED") {
    return 4;
  }

  if (booking.sampleStatus === "PROCESSING") return 3;
  if (booking.sampleStatus === "COLLECTED") return 2;
  if (booking.bookingStatus === "CONFIRMED") return 1;

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
        <div className="h-96 rounded-[2rem] bg-white" />
      </div>
    </section>
  );
}

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M9 3h6v4l5 9a2 2 0 0 1-1.7 3H5.7A2 2 0 0 1 4 16l5-9V3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
