import Link from "next/link";

import type { LabCenter } from "@/lib/labs/labs.types";

interface LabCenterCardProps {
  center: LabCenter;
}

export function LabCenterCard({ center }: LabCenterCardProps) {
  return (
    <article className="surface-card flex h-full flex-col rounded-[2rem] border border-[var(--color-border)] p-6 transition duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[0_24px_50px_rgba(14,165,233,0.12)]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-[var(--color-primary)]">
        <FlaskIcon />
      </div>
      <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
        {center.name}
      </h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        {center.address}, {center.city}, {center.state} {center.zipCode}
      </p>
      <dl className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
        <div className="flex gap-2">
          <dt className="font-medium text-[var(--color-text-primary)]">Phone:</dt>
          <dd>{center.phone}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-[var(--color-text-primary)]">Email:</dt>
          <dd className="truncate">{center.email}</dd>
        </div>
      </dl>
      <Link
        href={`/lab-tests/${center.id}`}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
      >
        View tests & packages
      </Link>
    </article>
  );
}

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
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
