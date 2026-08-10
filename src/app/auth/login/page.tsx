import { Suspense } from "react";

import { AuthPageIntro } from "@/features/auth/components/AuthPageIntro";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginPage() {
  return (
    <>
      <AuthPageIntro
        eyebrow="Welcome back"
        title="Sign in to HealthBridge"
        description="Use your email or phone number to access your account."
      />

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
