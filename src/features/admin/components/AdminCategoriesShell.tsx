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
import { listCategories } from "@/features/pharmacy/lib/pharmacy.api";
import type { MedicineCategory } from "@/features/pharmacy/lib/pharmacy.types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import {
  createCategory,
  type CreateCategoryPayload,
} from "@/lib/pharmacy/admin.api";

const columnHelper = createColumnHelper<MedicineCategory>();

export function AdminCategoriesShell() {
  const { accessToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "admin/pharmacy/categories",
    () => listCategories(),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryPayload>();

  async function onSubmit(values: CreateCategoryPayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      await createCategory(accessToken, values);
      reset();
      setSuccess(true);
      await mutate();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not create category."));
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: ({ getValue }) => getValue() ?? "—",
      }),
      columnHelper.accessor("medicineCount", { header: "Medicines" }),
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Medicine categories"
        description="Create and review pharmacy catalog categories."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-white p-5"
      >
        <h3 className="font-heading font-semibold">Add category</h3>
        <AdminFormField label="Name" error={errors.name?.message}>
          <input
            {...register("name", { required: "Name is required", minLength: 2 })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Description">
          <textarea {...register("description")} className={adminInputClass} rows={2} />
        </AdminFormField>
        {submitError ? <ErrorMessage message={submitError} /> : null}
        {success ? (
          <p className="text-sm font-medium text-emerald-600">Category created.</p>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create category"}
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}
      {error ? <ErrorMessage message="Could not load categories." /> : null}
      {data ? (
        <DataTableShell data={data} columns={columns} emptyMessage="No categories yet." />
      ) : null}
    </div>
  );
}
