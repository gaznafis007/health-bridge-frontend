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
import { listCategories, listMedicines } from "@/features/pharmacy/lib/pharmacy.api";
import type { Medicine } from "@/features/pharmacy/lib/pharmacy.types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import {
  createMedicine,
  type CreateMedicinePayload,
} from "@/lib/pharmacy/admin.api";

const columnHelper = createColumnHelper<Medicine>();

export function AdminMedicinesShell() {
  const { accessToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: categories } = useAuthenticatedSWR(
    "admin/pharmacy/categories-for-medicines",
    () => listCategories(),
  );

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "admin/pharmacy/medicines",
    () => listMedicines(),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMedicinePayload>();

  async function onSubmit(values: CreateMedicinePayload) {
    if (!accessToken) return;
    setSubmitError(null);
    setSuccess(false);
    try {
      await createMedicine(accessToken, {
        ...values,
        price: Number(values.price),
        stockQuantity: Number(values.stockQuantity),
      });
      reset();
      setSuccess(true);
      await mutate();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not create medicine."));
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("categoryName", { header: "Category" }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: ({ getValue }) => `৳${getValue()}`,
      }),
      columnHelper.accessor("stockQuantity", { header: "Stock" }),
      columnHelper.accessor("status", { header: "Status" }),
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Medicines"
        description="Add medicines to the pharmacy catalog."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:grid-cols-2"
      >
        <h3 className="font-heading font-semibold sm:col-span-2">Add medicine</h3>
        <AdminFormField label="Category" error={errors.categoryId?.message}>
          <select
            {...register("categoryId", { required: "Category is required" })}
            className={adminInputClass}
          >
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </AdminFormField>
        <AdminFormField label="Name" error={errors.name?.message}>
          <input
            {...register("name", { required: "Name is required" })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Generic name">
          <input {...register("genericName")} className={adminInputClass} />
        </AdminFormField>
        <AdminFormField label="Manufacturer">
          <input {...register("manufacturer")} className={adminInputClass} />
        </AdminFormField>
        <AdminFormField label="Price (BDT)" error={errors.price?.message}>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("price", { required: "Price is required", min: 0 })}
            className={adminInputClass}
          />
        </AdminFormField>
        <AdminFormField label="Stock quantity" error={errors.stockQuantity?.message}>
          <input
            type="number"
            min="0"
            {...register("stockQuantity", {
              required: "Stock is required",
              min: 0,
            })}
            className={adminInputClass}
          />
        </AdminFormField>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" {...register("requiresPrescription")} id="rx" />
          <label htmlFor="rx" className="text-sm font-medium">
            Requires prescription
          </label>
        </div>
        {submitError ? (
          <div className="sm:col-span-2">
            <ErrorMessage message={submitError} />
          </div>
        ) : null}
        {success ? (
          <p className="text-sm font-medium text-emerald-600 sm:col-span-2">
            Medicine created.
          </p>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create medicine"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}
      {error ? <ErrorMessage message="Could not load medicines." /> : null}
      {data ? (
        <DataTableShell data={data} columns={columns} emptyMessage="No medicines yet." />
      ) : null}
    </div>
  );
}
