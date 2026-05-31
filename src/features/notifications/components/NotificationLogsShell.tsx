"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { DataTableShell } from "@/components/ui/DataTableShell";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { getNotificationLogs } from "@/lib/notifications/notifications.api";
import type { NotificationLog } from "@/lib/notifications/notifications.types";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

const columnHelper = createColumnHelper<NotificationLog>();

const columns = [
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.accessor("category", { header: "Category" }),
  columnHelper.accessor("notificationType", { header: "Type" }),
  columnHelper.accessor("subject", { header: "Subject" }),
  columnHelper.accessor("deliveryStatus", { header: "Status" }),
];

export function NotificationLogsShell() {
  const [skip, setSkip] = useState(0);
  const take = 20;

  const { data, error, isLoading } = useAuthenticatedSWR(
    `notifications/logs?skip=${skip}&take=${take}`,
    (token) => getNotificationLogs(token, skip, take),
  );

  return (
    <RequireRole allowed={["PATIENT", "DOCTOR", "ADMIN", "DISPATCHER", "DRIVER"]}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="Notification history"
          description="Delivery log for emails and SMS sent to your account."
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}

        {error ? <ErrorMessage message="Could not load notification logs." /> : null}

        {data ? (
          <>
            <DataTableShell data={data.items} columns={columns} />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Showing {data.skip + 1}–{Math.min(data.skip + data.take, data.total)} of{" "}
                {data.total}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={skip === 0}
                  onClick={() => setSkip((s) => Math.max(0, s - take))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={skip + take >= data.total}
                  onClick={() => setSkip((s) => s + take)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </RequireRole>
  );
}
