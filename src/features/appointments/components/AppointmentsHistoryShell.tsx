"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { AppointmentCard } from "@/features/appointments/components/AppointmentCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyAppointments } from "@/lib/appointments/appointments.api";
import type { Appointment } from "@/lib/appointments/appointments.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

export function AppointmentsHistoryShell() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const take = 20;

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace("/auth/login?redirect=/appointments/history");
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function loadAppointments() {
      setIsLoading(true);

      try {
        const page = await getMyAppointments(token, 0, take);
        if (!isMounted) return;
        setAppointments(page.items);
        setTotal(page.total);
        setSkip(page.items.length);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace("/auth/login?redirect=/appointments/history");
          return;
        }

        setError(getApiErrorMessage(err, "We could not load your appointments."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthLoading, router]);

  async function loadMore() {
    if (!accessToken || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const page = await getMyAppointments(accessToken, skip, take);
      setAppointments((current) => [...current, ...page.items]);
      setSkip((current) => current + page.items.length);
      setTotal(page.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "We could not load more appointments."));
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (isAuthLoading || isLoading) {
    return <HistorySkeleton />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <Link
            href="/appointments"
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            ← Back to booking
          </Link>
          <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
            My appointments
          </h1>
        </div>

        {error ? <ErrorMessage message={error} /> : null}

        {appointments.length === 0 && !error ? (
          <EmptyState
            title="No appointments yet"
            description="Book your first in-person visit with a doctor."
            icon={<CalendarIcon />}
            action={
              <Link
                href="/appointments"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
              >
                Book appointment
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
            {appointments.length < total ? (
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

function HistorySkeleton() {
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

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
