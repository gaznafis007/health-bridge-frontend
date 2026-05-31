"use client";

import Link from "next/link";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { getDashboardPathForRole } from "@/lib/auth/dashboard-routes";

export function HomeHeroActions() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="inline-flex min-h-12 w-48 animate-pulse rounded-2xl bg-slate-200" />
        <div className="inline-flex min-h-12 w-48 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const dashboardHref = getDashboardPathForRole(user.role);
    return (
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href={dashboardHref}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          Go to dashboard
        </Link>
        <Link
          href="/pharmacy"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--color-secondary)] px-6 py-3 text-sm font-semibold text-[var(--color-secondary)] transition hover:bg-emerald-50"
        >
          Order medicine
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <Link
        href="/appointments"
        className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
      >
        Book a consultation
      </Link>
      <Link
        href="/pharmacy"
        className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--color-secondary)] px-6 py-3 text-sm font-semibold text-[var(--color-secondary)] transition hover:bg-emerald-50"
      >
        Order medicine
      </Link>
    </div>
  );
}
