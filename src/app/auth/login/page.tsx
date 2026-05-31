import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
          Welcome back
        </p>
        <h2 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text-primary)]">
          Sign in to HealthBridge
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
          Use your email or phone number to access your account.
        </p>
      </div>

      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </>
  );
}

function LoginFormFallback() {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <Spinner />
    </div>
  );
}
