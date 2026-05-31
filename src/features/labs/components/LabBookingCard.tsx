import Link from "next/link";

import { LabStatusBadge } from "@/features/labs/components/LabStatusBadge";
import type { LabBooking } from "@/lib/labs/labs.types";

interface LabBookingCardProps {
  booking: LabBooking;
}

export function LabBookingCard({ booking }: LabBookingCardProps) {
  return (
    <article className="surface-card rounded-[2rem] border border-[var(--color-border)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
            {booking.center?.name ?? "Diagnostic center"}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Sample on {booking.sampleCollectionDate} at{" "}
            {booking.sampleCollectionTime}
          </p>
        </div>
        <p className="text-lg font-bold text-[var(--color-primary)]">
          ৳{Number.parseFloat(booking.totalAmount).toFixed(0)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <LabStatusBadge status={booking.bookingStatus} kind="booking" />
        <LabStatusBadge status={booking.sampleStatus} kind="sample" />
        <LabStatusBadge status={booking.paymentStatus} kind="payment" />
      </div>

      <Link
        href={`/lab-tests/bookings/${booking.id}`}
        className="mt-5 inline-flex text-sm font-semibold text-[var(--color-primary)]"
      >
        View details →
      </Link>
    </article>
  );
}
