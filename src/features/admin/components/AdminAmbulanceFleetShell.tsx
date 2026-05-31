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
  createFleetVehicle,
  getAmbulanceHealthCenters,
  listFleet,
  updateFleetStatus,
} from "@/lib/ambulance/ambulance.api";
import type {
  AmbulanceFleetVehicle,
  CreateFleetPayload,
} from "@/lib/ambulance/ambulance.types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

const columnHelper = createColumnHelper<AmbulanceFleetVehicle>();

const fleetStatuses = ["AVAILABLE", "ON_DUTY", "MAINTENANCE", "INACTIVE"] as const;

export function AdminAmbulanceFleetShell() {
  const { accessToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data: centers } = useAuthenticatedSWR(
    "admin/ambulance/centers-for-fleet",
    (token) => getAmbulanceHealthCenters(token),
  );

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "admin/ambulance/fleet",
    (token) => listFleet(token),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFleetPayload>({ defaultValues: { vehicleType: "BASIC" } });

  async function onSubmit(values: CreateFleetPayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      await createFleetVehicle(accessToken, values);
      reset({ vehicleType: "BASIC" });
      setSuccess(true);
      await mutate();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not add vehicle."));
    }
  }

  async function handleStatusChange(
    ambulanceId: string,
    status: AmbulanceFleetVehicle["status"],
  ) {
    if (!accessToken) return;
    setPendingId(ambulanceId);
    setActionError(null);
    try {
      await updateFleetStatus(accessToken, ambulanceId, status);
      await mutate();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not update status."));
    } finally {
      setPendingId(null);
    }
  }

  const columns = [
      columnHelper.accessor("vehicleNumber", { header: "Vehicle #" }),
      columnHelper.accessor("vehicleType", { header: "Type" }),
      columnHelper.accessor("status", { header: "Status" }),
      columnHelper.display({
        id: "actions",
        header: "Set status",
        cell: ({ row }) => (
          <select
            value={row.original.status}
            disabled={pendingId === row.original.id}
            onChange={(e) =>
              handleStatusChange(
                row.original.id,
                e.target.value as AmbulanceFleetVehicle["status"],
              )
            }
            className="rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs"
          >
            {fleetStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ),
      }),
    ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Ambulance fleet"
        description="Register vehicles and manage availability."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:grid-cols-3"
      >
        <h3 className="font-heading font-semibold sm:col-span-3">Add vehicle</h3>
        <AdminFormField label="Health center" error={errors.healthCenterId?.message}>
          <select
            {...register("healthCenterId", { required: "Center is required" })}
            className={adminInputClass}
          >
            <option value="">Select center</option>
            {centers?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </AdminFormField>
        <AdminFormField label="Vehicle number" error={errors.vehicleNumber?.message}>
          <input
            {...register("vehicleNumber", { required: "Number is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Vehicle type">
          <select {...register("vehicleType")} className={adminInputClass}>
            <option value="BASIC">Basic</option>
            <option value="ADVANCED">Advanced</option>
            <option value="ICU">ICU</option>
          </select>
        </AdminFormField>
        {submitError ? (
          <div className="sm:col-span-3">
            <ErrorMessage message={submitError} />
          </div>
        ) : null}
        {success ? (
          <p className="text-sm font-medium text-emerald-600 sm:col-span-3">
            Vehicle added.
          </p>
        ) : null}
        <div className="sm:col-span-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add vehicle"}
          </Button>
        </div>
      </form>

      {actionError ? <ErrorMessage message={actionError} /> : null}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}
      {error ? <ErrorMessage message="Could not load fleet." /> : null}
      {data ? (
        <DataTableShell data={data} columns={columns} emptyMessage="No vehicles yet." />
      ) : null}
    </div>
  );
}
