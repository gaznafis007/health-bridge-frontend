"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { DataTableShell } from "@/components/ui/DataTableShell";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import { deliverReport, listAdminReports, uploadBookingReport } from "@/lib/labs/labs.api";
import type { LabReport } from "@/lib/labs/labs.types";

const columnHelper = createColumnHelper<LabReport>();

export function AdminLabReportsShell() {
  const { accessToken } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [uploadBookingId, setUploadBookingId] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "admin/lab/reports",
    (token) => listAdminReports(token),
  );

  async function handleDeliver(reportId: string) {
    if (!accessToken) return;
    setPendingId(reportId);
    setActionError(null);
    try {
      await deliverReport(accessToken, reportId);
      await mutate();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not deliver report."));
    } finally {
      setPendingId(null);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !uploadBookingId.trim() || !uploadFile) return;
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      await uploadBookingReport(accessToken, uploadBookingId.trim(), uploadFile);
      setUploadSuccess(true);
      setUploadFile(null);
      setUploadBookingId("");
      await mutate();
    } catch (err) {
      setUploadError(getApiErrorMessage(err, "Could not upload report."));
    } finally {
      setIsUploading(false);
    }
  }

  const columns = [
      columnHelper.accessor("reportFileName", { header: "File" }),
      columnHelper.accessor("bookingId", {
        header: "Booking",
        cell: ({ getValue }) => (
          <span className="font-mono text-xs">{getValue().slice(0, 8)}…</span>
        ),
      }),
      columnHelper.accessor("status", { header: "Status" }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
          row.original.status === "READY" ? (
            <Button
              type="button"
              variant="secondary"
              className="min-h-8 px-2 py-1 text-xs"
              disabled={pendingId === row.original.id}
              onClick={() => handleDeliver(row.original.id)}
            >
              Deliver
            </Button>
          ) : (
            "—"
          ),
      }),
    ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Lab reports"
        description="Upload reports and deliver them to patients."
      />

      <form
        onSubmit={handleUpload}
        className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-white p-5"
      >
        <h3 className="font-heading font-semibold">Upload report</h3>
        <div>
          <label className="mb-2 block text-sm font-semibold">Booking ID</label>
          <input
            value={uploadBookingId}
            onChange={(e) => setUploadBookingId(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
            placeholder="Booking UUID"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Report file (PDF/JPG/PNG)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </div>
        {uploadError ? <ErrorMessage message={uploadError} /> : null}
        {uploadSuccess ? (
          <p className="text-sm font-medium text-emerald-600">Report uploaded.</p>
        ) : null}
        <Button type="submit" disabled={isUploading || !uploadFile}>
          {isUploading ? "Uploading..." : "Upload report"}
        </Button>
      </form>

      {actionError ? <ErrorMessage message={actionError} /> : null}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}
      {error ? <ErrorMessage message="Could not load reports." /> : null}
      {data ? (
        <DataTableShell data={data} columns={columns} emptyMessage="No reports yet." />
      ) : null}
    </div>
  );
}
