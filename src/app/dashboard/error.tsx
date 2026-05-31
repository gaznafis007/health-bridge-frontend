"use client";

import Link from "next/link";

export default function DashboardError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-heading text-2xl font-bold">Dashboard unavailable</h1>
      <p className="mt-3 text-[var(--color-text-secondary)]">
        Something went wrong loading your dashboard.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
