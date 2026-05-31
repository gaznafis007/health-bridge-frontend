"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getDashboardPathForRole } from "@/lib/auth/dashboard-routes";

export function DashboardRedirectShell() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/auth/login?redirect=/dashboard");
      return;
    }

    router.replace(getDashboardPathForRole(user.role));
  }, [isAuthenticated, isLoading, router, user]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
