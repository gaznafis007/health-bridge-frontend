"use client";

import Link from "next/link";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { getDashboardPathForRole } from "@/lib/auth/dashboard-routes";

const linkClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export function HomeHeroActions({ variant = "default" }: { variant?: "default" | "hero" }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const isHero = variant === "hero";

  const primaryClass = isHero
    ? `${linkClass} bg-[var(--color-primary)] !text-white shadow-lg shadow-sky-500/30 hover:bg-[var(--color-primary-dark)]`
    : `${linkClass} bg-[var(--color-primary)] !text-white hover:bg-[var(--color-primary-dark)]`;

  const secondaryClass = isHero
    ? `${linkClass} border border-white/30 bg-white/10 !text-white backdrop-blur-sm hover:bg-white/20`
    : `${linkClass} border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-emerald-50`;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="inline-flex min-h-10 w-44 animate-pulse rounded-lg bg-slate-200/40" />
        <div className="inline-flex min-h-10 w-44 animate-pulse rounded-lg bg-slate-200/40" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const dashboardHref = getDashboardPathForRole(user.role);
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={dashboardHref} className={primaryClass}>
          Go to dashboard
        </Link>
        <Link href="/pharmacy" className={secondaryClass}>
          Order medicine
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link href="/appointments" className={primaryClass}>
        Book a consultation
      </Link>
      <Link href="/pharmacy" className={secondaryClass}>
        Order medicine
      </Link>
    </div>
  );
}
