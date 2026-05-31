"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { AmbulanceBookingCard } from "@/features/ambulance/components/AmbulanceBookingCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyAmbulanceBookings } from "@/lib/ambulance/ambulance.api";
import type { AmbulanceBooking } from "@/lib/ambulance/ambulance.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

export function AmbulanceBookingsShell() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<AmbulanceBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const take = 10;

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace("/auth/login?redirect=/ambulance/bookings");
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function loadBookings() {
      setIsLoading(true);

      try {
        const page = await getMyAmbulanceBookings(token, 0, take);
        if (!isMounted) return;
        setBookings(page.items);
        setTotal(page.total);
        setSkip(page.items.length);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace("/auth/login?redirect=/ambulance/bookings");
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

    const token = accessToken;
    setIsLoadingMore(true);

    try {
      const page = await getMyAmbulanceBookings(token, skip, take);
      setBookings((current) => [...current, ...page.items]);
      setSkip((current) => current + page.items.length);
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
              href="/ambulance"
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              ← Back to ambulance
            </Link>
            <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
              My ambulance bookings
            </h1>
          </div>
          <Link
            href="/ambulance/request"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            New emergency request
          </Link>
        </div>

        {error ? <ErrorMessage message={error} /> : null}

        {bookings.length === 0 && !error ? (
          <EmptyState
            title="No ambulance requests yet"
            description="Request emergency transport when you need urgent medical help."
            icon={<AmbulanceIcon />}
            action={
              <Link
                href="/ambulance/request"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Request ambulance
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <AmbulanceBookingCard key={booking.id} booking={booking} />
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
