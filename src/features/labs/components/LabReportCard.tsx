import { Button } from "@/components/ui/Button";
import { LabStatusBadge } from "@/features/labs/components/LabStatusBadge";
import type { LabReport } from "@/lib/labs/labs.types";

interface LabReportCardProps {
  report: LabReport;
}

export function LabReportCard({ report }: LabReportCardProps) {
  return (
    <article className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-[var(--color-primary)]">
          <FileIcon />
        </div>
        <div>
          <p className="font-medium text-[var(--color-text-primary)]">
            {report.reportFileName}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Uploaded {new Date(report.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2">
            <LabStatusBadge status={report.status} kind="report" />
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => window.open(report.reportUrl, "_blank", "noopener,noreferrer")}
      >
        View report
      </Button>
    </article>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
