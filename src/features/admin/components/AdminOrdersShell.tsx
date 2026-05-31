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
import type { Order } from "@/features/pharmacy/lib/pharmacy.types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import {
  getAdminOrder,
  listAdminOrders,
  updateOrderDeliveryStatus,
} from "@/lib/pharmacy/admin.api";

const columnHelper = createColumnHelper<Order>();

const deliveryStatuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

export function AdminOrdersShell() {
  const { accessToken } = useAuth();
  const [lookupId, setLookupId] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(
    "admin/pharmacy/orders",
    (token) => listAdminOrders(token, { take: 50 }),
  );

  const { register, handleSubmit, reset } = useForm<{ deliveryStatus: Order["deliveryStatus"] }>();

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !lookupId.trim()) return;
    setIsLookingUp(true);
    setLookupError(null);
    try {
      const order = await getAdminOrder(accessToken, lookupId.trim());
      setSelectedOrder(order);
      reset({ deliveryStatus: order.deliveryStatus });
    } catch (err) {
      setLookupError(getApiErrorMessage(err, "Order not found."));
      setSelectedOrder(null);
    } finally {
      setIsLookingUp(false);
    }
  }

  async function onUpdateStatus(values: { deliveryStatus: Order["deliveryStatus"] }) {
    if (!accessToken || !selectedOrder) return;
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const updated = await updateOrderDeliveryStatus(
        accessToken,
        selectedOrder.id,
        values,
      );
      setSelectedOrder(updated);
      setUpdateSuccess(true);
      await mutate();
    } catch (err) {
      setUpdateError(getApiErrorMessage(err, "Could not update delivery status."));
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Order ID",
        cell: ({ getValue }) => (
          <span className="font-mono text-xs">{getValue().slice(0, 8)}…</span>
        ),
      }),
      columnHelper.accessor("finalAmount", {
        header: "Amount",
        cell: ({ getValue }) => `৳${getValue()}`,
      }),
      columnHelper.accessor("paymentStatus", { header: "Payment" }),
      columnHelper.accessor("deliveryStatus", { header: "Delivery" }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Pharmacy orders"
        description="Review orders and update delivery status."
      />

      <form
        onSubmit={handleLookup}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-5"
      >
        <AdminFormField label="Look up order by ID">
          <input
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            className={adminInputClass}
            placeholder="Order UUID"
          />
        </AdminFormField>
        <Button type="submit" disabled={isLookingUp}>
          {isLookingUp ? "Looking up..." : "Look up"}
        </Button>
      </form>

      {lookupError ? <ErrorMessage message={lookupError} /> : null}

      {selectedOrder ? (
        <form
          onSubmit={handleSubmit(onUpdateStatus)}
          className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-slate-50 p-5"
        >
          <p className="text-sm text-[var(--color-text-secondary)]">
            Order {selectedOrder.id} — ৳{selectedOrder.finalAmount} (
            {selectedOrder.paymentStatus})
          </p>
          <AdminFormField label="Delivery status">
            <select {...register("deliveryStatus")} className={adminInputClass}>
              {deliveryStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </AdminFormField>
          {updateError ? <ErrorMessage message={updateError} /> : null}
          {updateSuccess ? (
            <p className="text-sm font-medium text-emerald-600">Status updated.</p>
          ) : null}
          <Button type="submit">Update delivery status</Button>
        </form>
      ) : null}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}
      {error ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Order list unavailable — use look-up by ID above.
        </p>
      ) : null}
      {data?.items?.length ? (
        <DataTableShell
          data={data.items}
          columns={columns}
          emptyMessage="No orders found."
        />
      ) : null}
    </div>
  );
}
