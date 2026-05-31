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
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import {
  createLabCenter,
  getCenters,
  type CreateLabCenterPayload,
} from "@/lib/labs/labs.api";
import type { LabCenter } from "@/lib/labs/labs.types";

const columnHelper = createColumnHelper<LabCenter>();

export function AdminLabCentersShell() {
  const { accessToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "admin/lab/centers",
    (token) => getCenters(token),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLabCenterPayload>();

  async function onSubmit(values: CreateLabCenterPayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      await createLabCenter(accessToken, values);
      reset();
      setSuccess(true);
      await mutate();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not create center."));
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("city", { header: "City" }),
      columnHelper.accessor("phone", { header: "Phone" }),
      columnHelper.accessor("email", { header: "Email" }),
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Diagnostic centers"
        description="Create and manage lab diagnostic centers."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:grid-cols-2"
      >
        <h3 className="font-heading font-semibold sm:col-span-2">Add center</h3>
        {(
          [
            ["name", "Name", true],
            ["address", "Address", true],
            ["city", "City", true],
            ["state", "State", true],
            ["zipCode", "Zip code", true],
            ["phone", "Phone", true],
            ["email", "Email", true],
          ] as const
        ).map(([field, label, required]) => (
          <AdminFormField
            key={field}
            label={label}
            error={errors[field]?.message}
          >
            <input
              {...register(field, required ? { required: `${label} is required` } : {})}
              className={adminInputClass}
              type={field === "email" ? "email" : "text"}
            />
          </AdminFormField>
        ))}
        {submitError ? (
          <div className="sm:col-span-2">
            <ErrorMessage message={submitError} />
          </div>
        ) : null}
        {success ? (
          <p className="text-sm font-medium text-emerald-600 sm:col-span-2">
            Center created.
          </p>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create center"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}
      {error ? <ErrorMessage message="Could not load centers." /> : null}
      {data ? (
        <DataTableShell data={data} columns={columns} emptyMessage="No centers yet." />
      ) : null}
    </div>
  );
}
