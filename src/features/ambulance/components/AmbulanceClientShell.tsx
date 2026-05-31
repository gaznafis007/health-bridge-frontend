"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getAmbulanceHealthCenters } from "@/lib/ambulance/ambulance.api";
import type { AmbulanceHealthCenter } from "@/lib/ambulance/ambulance.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

export function AmbulanceClientShell() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [healthCenters, setHealthCenters] = useState<AmbulanceHealthCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace("/auth/login?redirect=/ambulance");
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function loadCenters() {
      setIsLoading(true);

      try {
        const centers = await getAmbulanceHealthCenters(token);
        if (!isMounted) return;
        setHealthCenters(centers);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace("/auth/login?redirect=/ambulance");
          return;
        }

        setError(getApiErrorMessage(err, "We could not load health centers."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCenters();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return <AmbulanceSkeleton />;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="surface-card overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-br from-red-50 via-white to-orange-50 p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <AmbulanceIcon />
              </div>
              <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
                Emergency Ambulance
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                Request urgent transport, track your ambulance live on the map,
                and get to the nearest health center quickly.
              </p>
              <p className="mt-3 text-sm font-medium text-[var(--color-text-primary)]">
                {healthCenters.length} health center
                {healthCenters.length === 1 ? "" : "s"} available for routing.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Link
                href="/ambulance/request"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700"
              >
                Request emergency
              </Link>
              <Link
                href="/ambulance/bookings"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-primary)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-sky-50"
              >
                My bookings
              </Link>
            </div>
          </div>
        </div>

        {error ? <ErrorMessage message={error} /> : null}

        {healthCenters.length === 0 && !error ? (
          <EmptyState
            title="No health centers available"
            description="Emergency routing requires at least one registered health center."
            icon={<AmbulanceIcon />}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {healthCenters.slice(0, 4).map((center) => (
              <article
                key={center.id}
                className="surface-card rounded-[2rem] border border-[var(--color-border)] p-5"
              >
                <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
                  {center.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {center.address}, {center.city}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                  {center.type.replaceAll("_", " ")}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AmbulanceSkeleton() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8 animate-pulse">
        <div className="h-56 rounded-[2rem] bg-red-50" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 rounded-[2rem] border border-[var(--color-border)] bg-white"
            />
          ))}
        </div>
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
