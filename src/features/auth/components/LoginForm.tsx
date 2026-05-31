"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { signinAction } from "@/lib/auth/auth.actions";

interface FormState {
  identity: string;
  password: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const [form, setForm] = useState<FormState>({ identity: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setFieldErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signinAction({
        identity: form.identity.trim(),
        password: form.password,
      });

      if (!result.success) {
        setSubmitError(result.error.message);
        if (result.error.fieldErrors) {
          setFieldErrors((current) => ({ ...current, ...result.error.fieldErrors }));
        }
        return;
      }

      setSession(result.data);
      const redirectUrl = searchParams.get("redirect");
      router.replace(redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="identity"
          className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]"
        >
          Email or Phone
        </label>
        <input
          id="identity"
          type="text"
          autoComplete="username"
          value={form.identity}
          onChange={(event) =>
            setForm((current) => ({ ...current, identity: event.target.value }))
          }
          aria-invalid={fieldErrors.identity ? "true" : "false"}
          className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
        />
        {fieldErrors.identity ? (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {fieldErrors.identity}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            aria-invalid={fieldErrors.password ? "true" : "false"}
            className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 pr-12 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {fieldErrors.password ? (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      {submitError ? <ErrorMessage message={submitError} /> : null}

      <Button
        type="submit"
        variant="primary"
        className="w-full rounded-2xl"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-[var(--color-primary)]">
          Register
        </Link>
      </p>
    </form>
  );
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (form.identity.trim().length === 0) {
    errors.identity = "Enter your email or phone number.";
  }

  if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}
