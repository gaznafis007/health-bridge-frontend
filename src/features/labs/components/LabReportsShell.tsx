"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LabReportCard } from "@/features/labs/components/LabReportCard";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyReports } from "@/lib/labs/labs.api";
import type { LabReport } from "@/lib/labs/labs.types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

export function LabReportsShell() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!accessToken) {
      router.replace("/auth/login?redirect=/lab-tests/reports");
      return;
    }

    const token = accessToken;
    let mounted = true;

    async function load() {
      try {
        const data = await getMyReports(token);
        if (mounted) {
          setReports(data);
          setError(null);
        }
      } catch (err) {
        if (!mounted) return;
        if (getApiErrorStatus(err) === 401) {
          router.replace("/auth/login?redirect=/lab-tests/reports");
          return;
        }
        setError(getApiErrorMessage(err, "Could not load reports."));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [accessToken, isAuthLoading, router]);

  return (
    <RequireRole allowed={["PATIENT"]}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <SectionHeader
          title="My lab reports"
          description="Download and view reports from your lab bookings."
          action={
            <Link
              href="/lab-tests/bookings"
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              My bookings
            </Link>
          }
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}

        {error ? <ErrorMessage message={error} /> : null}

        {!isLoading && !error && reports.length === 0 ? (
          <EmptyState
            title="No reports yet"
            description="Reports appear here once your lab results are ready."
          />
        ) : null}

        <div className="mt-6 space-y-4">
          {reports.map((report) => (
            <LabReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </RequireRole>
  );
}
