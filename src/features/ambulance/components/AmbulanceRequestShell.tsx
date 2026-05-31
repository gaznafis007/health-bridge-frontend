"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { AmbulanceBookingForm } from "@/features/ambulance/components/AmbulanceBookingForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getAmbulanceHealthCenters } from "@/lib/ambulance/ambulance.api";
import type { AmbulanceHealthCenter } from "@/lib/ambulance/ambulance.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

export function AmbulanceRequestShell() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [healthCenters, setHealthCenters] = useState<AmbulanceHealthCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.replace("/auth/login?redirect=/ambulance/request");
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
          router.replace("/auth/login?redirect=/ambulance/request");
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
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-[2rem] bg-red-50" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!accessToken) {
    return null;
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <AmbulanceBookingForm
        accessToken={accessToken}
        healthCenters={healthCenters}
      />
    </section>
  );
}
