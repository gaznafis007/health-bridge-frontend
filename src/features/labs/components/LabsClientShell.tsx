"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LabCenterCard } from "@/features/labs/components/LabCenterCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getCenters } from "@/lib/labs/labs.api";
import type { LabCenter } from "@/lib/labs/labs.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

export function LabsClientShell() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [centers, setCenters] = useState<LabCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!accessToken) {
      router.replace("/auth/login?redirect=/lab-tests");
      return;
    }

    const token = accessToken;
    let isMounted = true;

    async function loadCenters() {
      setIsLoading(true);

      try {
        const data = await getCenters(token);
        if (!isMounted) return;
        setCenters(data);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace("/auth/login?redirect=/lab-tests");
          return;
        }

        setError(getApiErrorMessage(err, "We could not load diagnostic centers."));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCenters();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return <LabsSkeleton />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="surface-card overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-[var(--color-primary)]">
                <FlaskIcon />
              </div>
              <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
                Lab Tests
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                Book home sample collection, track your sample lifecycle, and
                access reports online.
              </p>
            </div>
            <Link
              href="/lab-tests/bookings"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-primary)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-sky-50"
            >
              My bookings
            </Link>
          </div>
        </div>

        {error ? <ErrorMessage message={error} /> : null}

        {centers.length === 0 && !error ? (
          <EmptyState
            title="No diagnostic centers yet"
            description="Check back soon — centers will appear here when available."
            icon={<FlaskIcon />}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {centers.map((center) => (
              <LabCenterCard key={center.id} center={center} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LabsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8 animate-pulse">
        <div className="h-48 rounded-[2rem] bg-sky-100" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-[2rem] border border-[var(--color-border)] bg-white"
            />
          ))}
        </div>
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
      <path
        d="M9 7h6M7 14h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
