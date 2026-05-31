"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { DataTableShell } from "@/components/ui/DataTableShell";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import {
  AdminFormField,
  adminInputClass,
} from "@/features/admin/components/AdminFormField";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createDriver,
  listDrivers,
  updateDriverStatus,
  verifyDriver,
} from "@/lib/ambulance/ambulance.api";
import type {
  AmbulanceDriver,
  CreateDriverPayload,
} from "@/lib/ambulance/ambulance.types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

const columnHelper = createColumnHelper<AmbulanceDriver>();

export function AdminAmbulanceDriversShell() {
  const { accessToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "admin/ambulance/drivers",
    (token) => listDrivers(token),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateDriverPayload>();

  async function onSubmit(values: CreateDriverPayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      await createDriver(accessToken, values);
      reset();
      setSuccess(true);
      await mutate();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not register driver."));
    }
  }

  async function handleVerify(driverId: string) {
    if (!accessToken) return;
    setPendingId(driverId);
    setActionError(null);
    try {
      await verifyDriver(accessToken, driverId);
      await mutate();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not verify driver."));
    } finally {
      setPendingId(null);
    }
  }

  async function handleSuspend(driverId: string) {
    if (!accessToken) return;
    setPendingId(driverId);
    setActionError(null);
    try {
      await updateDriverStatus(accessToken, driverId, "SUSPENDED");
      await mutate();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not update driver."));
    } finally {
      setPendingId(null);
    }
  }

  const columns = [
      columnHelper.accessor(
        (row) =>
          row.firstName && row.lastName
            ? `${row.firstName} ${row.lastName}`
            : row.userId.slice(0, 8),
        { id: "name", header: "Driver" },
      ),
      columnHelper.accessor("licenseNumber", { header: "License" }),
      columnHelper.accessor("status", { header: "Status" }),
      columnHelper.accessor("isVerified", {
        header: "Verified",
        cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const driver = row.original;
          const isPending = pendingId === driver.id;
          return (
            <div className="flex flex-wrap gap-1">
              {!driver.isVerified ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-8 px-2 py-1 text-xs"
                  disabled={isPending}
                  onClick={() => handleVerify(driver.id)}
                >
                  Verify
                </Button>
              ) : null}
              {driver.status === "ACTIVE" ? (
                <Button
                  type="button"
                  variant="danger"
                  className="min-h-8 px-2 py-1 text-xs"
                  disabled={isPending}
                  onClick={() => handleSuspend(driver.id)}
                >
                  Suspend
                </Button>
              ) : null}
            </div>
          );
        },
      }),
    ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Ambulance drivers"
        description="Register drivers and manage verification."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:grid-cols-2"
      >
        <h3 className="font-heading font-semibold sm:col-span-2">Register driver</h3>
        <AdminFormField label="User ID" error={errors.userId?.message}>
          <input
            {...register("userId", { required: "User ID is required" })}
            className={adminInputClass}
            placeholder="Driver user UUID"
          />
        </AdminFormField>
        <AdminFormField label="License number" error={errors.licenseNumber?.message}>
          <input
            {...register("licenseNumber", { required: "License is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        {submitError ? (
          <div className="sm:col-span-2">
            <ErrorMessage message={submitError} />
          </div>
        ) : null}
        {success ? (
          <p className="text-sm font-medium text-emerald-600 sm:col-span-2">
            Driver registered.
          </p>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register driver"}
          </Button>
        </div>
      </form>

      {actionError ? <ErrorMessage message={actionError} /> : null}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}
      {error ? <ErrorMessage message="Could not load drivers." /> : null}
      {data ? (
        <DataTableShell data={data} columns={columns} emptyMessage="No drivers yet." />
      ) : null}
    </div>
  );
}
