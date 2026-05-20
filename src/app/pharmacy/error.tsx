"use client";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function PharmacyError({
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry?: () => void;
}) {
  const retry = unstable_retry ?? reset;

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="surface-card rounded-[2rem] border border-[var(--color-border)] p-8 text-center">
        <ErrorMessage message="Something went wrong loading the pharmacy. Please try again." />
        <div className="mt-6">
          <Button onClick={() => retry()}>Try Again</Button>
        </div>
      </div>
    </section>
  );
}
