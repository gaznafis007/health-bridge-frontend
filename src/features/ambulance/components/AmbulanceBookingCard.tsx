import Link from "next/link";

import { AmbulanceStatusBadge } from "@/features/ambulance/components/AmbulanceStatusBadge";
import type { AmbulanceBooking } from "@/lib/ambulance/ambulance.types";

interface AmbulanceBookingCardProps {
  booking: AmbulanceBooking;
}

export function AmbulanceBookingCard({ booking }: AmbulanceBookingCardProps) {
  return (
    <article className="surface-card rounded-[2rem] border border-[var(--color-border)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
            {booking.emergencyType}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {booking.pickupAddress} → {booking.destinationAddress}
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[var(--color-primary)]">
            ৳{Number.parseFloat(booking.estimatedFare).toFixed(0)}
          </p>
          <div className="mt-2 flex justify-end">
            <AmbulanceStatusBadge status={booking.status} />
          </div>
        </div>
      </div>
      <Link
        href={`/ambulance/bookings/${booking.id}`}
        className="mt-5 inline-flex text-sm font-semibold text-[var(--color-primary)]"
      >
        Track ambulance →
      </Link>
    </article>
  );
}
