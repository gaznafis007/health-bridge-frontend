"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { getPublicReport } from "@/lib/labs/labs.api";
import type { PublicReportResponse } from "@/lib/labs/labs.types";
import { getApiErrorMessage } from "@/lib/api/errors";

interface PublicReportShellProps {
  reportToken: string;
}

export function PublicReportShell({ reportToken }: PublicReportShellProps) {
  const [report, setReport] = useState<PublicReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getPublicReport(reportToken);
        if (mounted) {
          setReport(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(getApiErrorMessage(err, "Report not found or link expired."));
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [reportToken]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ErrorMessage message={error ?? "Report unavailable."} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-heading text-2xl font-bold">{report.reportFileName}</h1>
      <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
        Your lab report is ready to view.
      </p>
      <Button
        type="button"
        className="mt-8"
        onClick={() =>
          window.open(report.reportUrl, "_blank", "noopener,noreferrer")
        }
      >
        Open report
      </Button>
    </div>
  );
}
