"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { DataTableShell } from "@/components/ui/DataTableShell";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import {
  collectSample,
  completeSample,
  confirmBookingPayment,
  listAllBookings,
  processSample,
} from "@/lib/labs/labs.api";
import type { LabBooking } from "@/lib/labs/labs.types";

const columnHelper = createColumnHelper<LabBooking>();

export function AdminLabBookingsShell() {
  const { accessToken } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "admin/lab/bookings",
    (token) => listAllBookings(token, 0, 50),
  );

  async function runAction(
    bookingId: string,
    action: (token: string, id: string) => Promise<LabBooking>,
  ) {
    if (!accessToken) return;
    setPendingId(bookingId);
    setActionError(null);
    try {
      await action(accessToken, bookingId);
      await mutate();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Action failed."));
    } finally {
      setPendingId(null);
    }
  }

  const columns = [
      columnHelper.accessor("id", {
        header: "Booking",
        cell: ({ getValue }) => (
          <span className="font-mono text-xs">{getValue().slice(0, 8)}…</span>
        ),
      }),
      columnHelper.accessor("bookingStatus", { header: "Status" }),
      columnHelper.accessor("sampleStatus", { header: "Sample" }),
      columnHelper.accessor("paymentStatus", { header: "Payment" }),
      columnHelper.accessor("totalAmount", {
        header: "Amount",
        cell: ({ getValue }) => `৳${getValue()}`,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const booking = row.original;
          const isPending = pendingId === booking.id;

          return (
            <div className="flex flex-wrap gap-1">
              {booking.bookingStatus === "PENDING_PAYMENT" ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-8 px-2 py-1 text-xs"
                  disabled={isPending}
                  onClick={() => runAction(booking.id, confirmBookingPayment)}
                >
                  Confirm pay
                </Button>
              ) : null}
              {booking.sampleStatus === "PENDING" ? (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-8 px-2 py-1 text-xs"
                  disabled={isPending}
                  onClick={() => runAction(booking.id, collectSample)}
                >
                  Collect
                </Button>
              ) : null}
              {booking.sampleStatus === "COLLECTED" ? (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-8 px-2 py-1 text-xs"
                  disabled={isPending}
                  onClick={() => runAction(booking.id, processSample)}
                >
                  Process
                </Button>
              ) : null}
              {booking.sampleStatus === "PROCESSING" ? (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-8 px-2 py-1 text-xs"
                  disabled={isPending}
                  onClick={() => runAction(booking.id, completeSample)}
                >
                  Complete
                </Button>
              ) : null}
              <Link
                href={`/lab-tests/bookings/${booking.id}`}
                className="inline-flex min-h-8 items-center px-2 text-xs font-semibold text-[var(--color-primary)]"
              >
                View
              </Link>
            </div>
          );
        },
      }),
    ];

  return (
    <div>
      <SectionHeader
        title="Lab bookings"
        description="Confirm payments and advance sample lifecycle."
      />
      {actionError ? <ErrorMessage message={actionError} /> : null}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}
      {error ? <ErrorMessage message="Could not load bookings." /> : null}
      {data ? (
        <DataTableShell
          data={data.data}
          columns={columns}
          emptyMessage="No lab bookings."
        />
      ) : null}
    </div>
  );
}
