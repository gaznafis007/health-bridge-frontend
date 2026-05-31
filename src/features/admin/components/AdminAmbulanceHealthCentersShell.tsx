"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
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
  createHealthCenter,
  getAmbulanceHealthCenters,
} from "@/lib/ambulance/ambulance.api";
import type {
  AmbulanceHealthCenter,
  CreateHealthCenterPayload,
} from "@/lib/ambulance/ambulance.types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";

const columnHelper = createColumnHelper<AmbulanceHealthCenter>();

export function AdminAmbulanceHealthCentersShell() {
  const { accessToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "admin/ambulance/health-centers",
    (token) => getAmbulanceHealthCenters(token),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateHealthCenterPayload>({
    defaultValues: { type: "HOSPITAL", latitude: 0, longitude: 0 },
  });

  async function onSubmit(values: CreateHealthCenterPayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      await createHealthCenter(accessToken, {
        ...values,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
      });
      reset({ type: "HOSPITAL", latitude: 0, longitude: 0 });
      setSuccess(true);
      await mutate();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not create health center."));
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("type", { header: "Type" }),
      columnHelper.accessor("city", { header: "City" }),
      columnHelper.accessor("phone", { header: "Phone" }),
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Ambulance health centers"
        description="Hospitals and clinics used for ambulance routing."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:grid-cols-2"
      >
        <h3 className="font-heading font-semibold sm:col-span-2">Add health center</h3>
        <AdminFormField label="Name" error={errors.name?.message}>
          <input
            {...register("name", { required: "Name is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Type">
          <select {...register("type")} className={adminInputClass}>
            <option value="HOSPITAL">Hospital</option>
            <option value="CLINIC">Clinic</option>
            <option value="DIAGNOSTIC_CENTER">Diagnostic center</option>
          </select>
        </AdminFormField>
        <AdminFormField label="Address" error={errors.address?.message}>
          <input
            {...register("address", { required: "Address is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="City" error={errors.city?.message}>
          <input
            {...register("city", { required: "City is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="State" error={errors.state?.message}>
          <input
            {...register("state", { required: "State is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Zip code" error={errors.zipCode?.message}>
          <input
            {...register("zipCode", { required: "Zip code is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Phone" error={errors.phone?.message}>
          <input
            {...register("phone", { required: "Phone is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Email" error={errors.email?.message}>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Latitude">
          <input
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Longitude">
          <input
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true })}
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
            Health center created.
          </p>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create health center"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}
      {error ? <ErrorMessage message="Could not load health centers." /> : null}
      {data ? (
        <DataTableShell data={data} columns={columns} emptyMessage="No health centers." />
      ) : null}
    </div>
  );
}
