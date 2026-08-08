"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getAuthenticatedNavLinks,
  type AuthenticatedNavLinkVariant,
} from "@/lib/auth/dashboard-routes";

export function AuthNavActions({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isLoading) {
    return (
      <div className="inline-flex min-h-11 items-center justify-center px-3">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Link
          href="/auth/login"
          onClick={onNavigate}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-sky-50"
        >
          Login / Register
        </Link>
        <Link
          href="/appointments"
          onClick={onNavigate}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          Book Appointment
        </Link>
      </>
    );
  }

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signout();
      onNavigate?.();
      router.replace("/");
    } finally {
      setIsSigningOut(false);
    }
  }

  const navLinks = getAuthenticatedNavLinks(user.role);

  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={navLinkClassName(link.variant)}
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/account"
        onClick={onNavigate}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition hover:bg-slate-50"
      >
        Account
      </Link>
      <div className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          {user.firstName}
        </span>
        <Badge variant="neutral">{formatRole(user.role)}</Badge>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
      >
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </button>
    </>
  );
}

function formatRole(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

const navLinkClassNames: Record<AuthenticatedNavLinkVariant, string> = {
  default:
    "inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-slate-50",
  primary:
    "inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-sky-50",
};

function navLinkClassName(variant: AuthenticatedNavLinkVariant) {
  return navLinkClassNames[variant];
}
