"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { UserRole } from "@/lib/auth/auth.types";
import { getDashboardPathForRole } from "@/lib/auth/dashboard-routes";

interface RequireRoleProps {
  allowed: UserRole[];
  children: React.ReactNode;
  redirectTo?: string;
}

export function RequireRole({ allowed, children, redirectTo }: RequireRoleProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/auth/login");
      return;
    }

    if (!allowed.includes(user.role)) {
      router.replace(redirectTo ?? getDashboardPathForRole(user.role));
    }
  }, [allowed, isAuthenticated, isLoading, redirectTo, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || !allowed.includes(user.role)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <EmptyState
          title="Access denied"
          description="You do not have permission to view this page."
          action={
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              Go home
            </Link>
          }
        />
      </div>
    );
  }

  return children;
}
