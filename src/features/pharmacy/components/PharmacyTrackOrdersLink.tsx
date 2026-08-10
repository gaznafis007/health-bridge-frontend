"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  PHARMACY_TRACKING_UPDATED_EVENT,
  readDeliveryPhoneForTracking,
} from "@/features/pharmacy/lib/pharmacy-tracking.storage";

interface PharmacyTrackOrdersLinkProps {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
  variant?: "default" | "overDark";
}

export function PharmacyTrackOrdersLink({
  pathname,
  onNavigate,
  className,
  variant = "default",
}: PharmacyTrackOrdersLinkProps) {
  const [deliveryPhone, setDeliveryPhone] = useState<string | null>(null);

  useEffect(() => {
    function refresh() {
      setDeliveryPhone(readDeliveryPhoneForTracking());
    }

    refresh();
    window.addEventListener(PHARMACY_TRACKING_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(PHARMACY_TRACKING_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!deliveryPhone) {
    return null;
  }

  const href = `/pharmacy/track-order?phone=${encodeURIComponent(deliveryPhone)}`;
  const isActive = pathname.startsWith("/pharmacy/track-order");

  const isOverDark = variant === "overDark";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={
        className ??
        (isOverDark
          ? `rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 hover:bg-white/10 hover:!text-white ${
              isActive ? "bg-white/15 !text-white" : "!text-white/90"
            }`
          : `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-sky-50 hover:text-[var(--color-primary)] ${
              isActive
                ? "bg-sky-100 text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)]"
            }`)
      }
    >
      Track Orders
    </Link>
  );
}
