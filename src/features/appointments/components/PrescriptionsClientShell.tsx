"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { PrescriptionCard } from "@/features/appointments/components/PrescriptionCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyPrescriptions } from "@/lib/appointments/appointments.api";
import type { Prescription } from "@/lib/appointments/appointments.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

export function PrescriptionsClientShell() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const take = 20;

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace("/auth/login?redirect=/appointments/prescriptions");
      return;
    }

    let isMounted = true;

    async function loadPrescriptions() {
      setIsLoading(true);

      try {
        const page = await getMyPrescriptions(accessToken, 0, take);
        if (!isMounted) return;
        setPrescriptions(page.items);
        setTotal(page.total);
        setSkip(page.items.length);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (getApiErrorStatus(err) === 401) {
          router.replace("/auth/login?redirect=/appointments/prescriptions");
          return;
        }

        setError(getApiErrorMessage(err, "We could not load your prescriptions."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPrescriptions();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthLoading, router]);

  async function loadMore() {
    if (!accessToken || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const page = await getMyPrescriptions(accessToken, skip, take);
      setPrescriptions((current) => [...current, ...page.items]);
      setSkip((current) => current + page.items.length);
      setTotal(page.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "We could not load more prescriptions."));
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (isAuthLoading || isLoading) {
    return <PrescriptionsSkeleton />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <Link
            href="/appointments"
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            ← Back to appointments
          </Link>
          <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
            My prescriptions
          </h1>
        </div>

        {error ? <ErrorMessage message={error} /> : null}

        {prescriptions.length === 0 && !error ? (
          <EmptyState
            title="No prescriptions yet"
            description="Prescriptions from completed visits will appear here."
            icon={<PillIcon />}
            action={
              <Link
                href="/appointments/history"
                className="text-sm font-semibold text-[var(--color-primary)]"
              >
                View appointment history
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
            {prescriptions.length < total ? (
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

function PrescriptionsSkeleton() {
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

function PillIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="m8 16 8-8a4 4 0 1 1 5.6 5.6l-8 8A4 4 0 0 1 8 16Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
