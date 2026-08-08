"use client";

import Link from "next/link";
import { useState } from "react";

const STORAGE_KEY = "hb_guest_session_banner_dismissed";

interface GuestSessionBannerProps {
  isReady: boolean;
}

export function GuestSessionBanner({ isReady }: GuestSessionBannerProps) {
  const [dismissed, setDismissed] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.sessionStorage.getItem(STORAGE_KEY) === "true",
  );

  if (!isReady || dismissed) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-[var(--color-text-secondary)]">
      <div className="flex gap-3">
        <span className="mt-0.5 text-[var(--color-primary)]" aria-hidden="true">
          i
        </span>
        <p>
          <span className="font-semibold text-[var(--color-text-primary)]">
            You&apos;re shopping as a guest.
          </span>{" "}
          After checkout you&apos;ll see order status immediately. After your first order, use{" "}
          <strong className="font-semibold text-[var(--color-text-primary)]">Track Orders</strong>{" "}
          in the navbar, or{" "}
          <Link href="/pharmacy/track-order" className="text-[var(--color-primary)] underline">
            track by phone or order ID
          </Link>
          . You can also{" "}
          <Link href="/auth/register" className="text-[var(--color-primary)] underline">
            register for an account
          </Link>{" "}
          to save order history.
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss guest session message"
        onClick={() => {
          window.sessionStorage.setItem(STORAGE_KEY, "true");
          setDismissed(true);
        }}
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:bg-white"
      >
        ×
      </button>
    </div>
  );
}
