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

const navButtonBase =
  "inline-flex min-h-9 items-center justify-center rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const navButtonFocusDefault =
  "focus-visible:outline-[var(--color-primary)]";

const navButtonFocusOverDark = "focus-visible:outline-white";

type AuthNavVariant = "default" | "overDark";

export function AuthNavActions({
  onNavigate,
  variant = "default",
}: {
  onNavigate?: () => void;
  variant?: AuthNavVariant;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isOverDark = variant === "overDark";
  const focusClass = isOverDark ? navButtonFocusOverDark : navButtonFocusDefault;

  if (isLoading) {
    return (
      <div className="inline-flex min-h-9 items-center justify-center px-2">
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
          className={`${navButtonBase} ${focusClass} ${
            isOverDark
              ? "border border-white/40 !text-white hover:bg-white/10"
              : "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-cyan-50"
          }`}
        >
          Login / Register
        </Link>
        <Link
          href="/appointments"
          onClick={onNavigate}
          className={`${navButtonBase} ${focusClass} bg-[var(--color-primary)] !text-white hover:bg-[var(--color-primary-dark)]`}
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
          className={navLinkClassName(link.variant, isOverDark, focusClass)}
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/account"
        onClick={onNavigate}
        className={`${navButtonBase} ${focusClass} ${
          isOverDark
            ? "border border-white/30 !text-white/90 hover:bg-white/10 hover:!text-white"
            : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-slate-50"
        }`}
      >
        Account
      </Link>
      <div
        className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 py-1.5 ${
          isOverDark
            ? "border-white/20 bg-white/10"
            : "border-[var(--color-border)] bg-white"
        }`}
      >
        <span
          className={`text-xs font-semibold transition-colors duration-300 ${
            isOverDark ? "!text-white" : "text-[var(--color-text-primary)]"
          }`}
        >
          {user.firstName}
        </span>
        <Badge variant="neutral">{formatRole(user.role)}</Badge>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={`${navButtonBase} ${focusClass} bg-[var(--color-primary)] !text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-60`}
      >
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </button>
    </>
  );
}

function formatRole(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function navLinkClassName(
  variant: AuthenticatedNavLinkVariant,
  isOverDark: boolean,
  focusClass: string,
) {
  if (isOverDark) {
    return variant === "primary"
      ? `${navButtonBase} ${focusClass} border border-white/40 !text-white hover:bg-white/10`
      : `${navButtonBase} ${focusClass} border border-white/30 !text-white/90 hover:bg-white/10 hover:!text-white`;
  }

  return variant === "primary"
    ? `${navButtonBase} ${focusClass} border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-cyan-50`
    : `${navButtonBase} ${focusClass} border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-slate-50`;
}
