"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LabBookingCard } from "@/features/labs/components/LabBookingCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyBookings } from "@/lib/labs/labs.api";
import type { LabBooking } from "@/lib/labs/labs.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

export function LabBookingsClientShell() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<LabBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const take = 20;

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace("/auth/login?redirect=/lab-tests/bookings");
      return;
    }

    let isMounted = true;

    async function loadBookings() {
      setIsLoading(true);

      try {
        const page = await getMyBookings(accessToken, 0, take);
        if (!isMounted) return;
        setBookings(page.data);
        setTotal(page.total);
        setSkip(page.data.length);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace("/auth/login?redirect=/lab-tests/bookings");
          return;
        }

        setError(getApiErrorMessage(err, "We could not load your bookings."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthLoading, router]);

  async function loadMore() {
    if (!accessToken || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const page = await getMyBookings(accessToken, skip, take);
      setBookings((current) => [...current, ...page.data]);
      setSkip((current) => current + page.data.length);
      setTotal(page.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "We could not load more bookings."));
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (isAuthLoading || isLoading) {
    return <BookingsSkeleton />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/lab-tests"
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              ← Back to lab tests
            </Link>
            <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
              My lab bookings
            </h1>
          </div>
        </div>

        {error ? <ErrorMessage message={error} /> : null}

        {bookings.length === 0 && !error ? (
          <EmptyState
            title="No bookings yet"
            description="Browse diagnostic centers and book your first lab test."
            icon={<FlaskIcon />}
            action={
              <Link
                href="/lab-tests"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
              >
                Browse centers
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <LabBookingCard key={booking.id} booking={booking} />
            ))}
            {bookings.length < total ? (
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading..." : "Load more"}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function BookingsSkeleton() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-64 rounded bg-slate-200" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-[2rem] border border-[var(--color-border)] bg-white"
          />
        ))}
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
