"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import {
  AdminFormField,
  adminInputClass,
} from "@/features/admin/components/AdminFormField";
import { AdminOrdersList } from "@/features/admin/components/AdminOrdersList";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { OrderStatusBadge } from "@/features/pharmacy/components/OrderStatusBadge";
import { OrderSummary } from "@/features/pharmacy/components/OrderSummary";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import {
  DEFAULT_ADMIN_ORDERS_PAGE_SIZE,
  listAdminOrders,
  updateOrderDeliveryStatus,
  type AdminOrder,
} from "@/lib/pharmacy/admin.api";

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
  const [skip, setSkip] = useState(0);
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [appliedEmail, setAppliedEmail] = useState("");
  const [appliedPhone, setAppliedPhone] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const swrKey = `admin/pharmacy/orders?skip=${skip}&email=${appliedEmail}&phone=${appliedPhone}`;

  const { data, error, isLoading, mutate } = useAuthenticatedSWR(swrKey, (token) =>
    listAdminOrders(token, {
      skip,
      take: DEFAULT_ADMIN_ORDERS_PAGE_SIZE,
      email: appliedEmail || undefined,
      phone: appliedPhone || undefined,
    }),
  );

  const { register, handleSubmit, reset } = useForm<{
    deliveryStatus: AdminOrder["deliveryStatus"];
  }>();

  useEffect(() => {
    if (!selectedOrder || !data?.items) {
      return;
    }

    const refreshed = data.items.find((order) => order.id === selectedOrder.id);
    if (refreshed && refreshed.deliveryStatus !== selectedOrder.deliveryStatus) {
      setSelectedOrder(refreshed);
      reset({ deliveryStatus: refreshed.deliveryStatus });
    }
  }, [data?.items, reset, selectedOrder]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextEmail = emailInput.trim();
    const nextPhone = phoneInput.trim();

    if (
      (nextEmail.length > 0 && nextEmail.length < 3) ||
      (nextPhone.length > 0 && nextPhone.length < 3)
    ) {
      setSearchError("Email and phone searches need at least 3 characters.");
      return;
    }

    setSearchError(null);
    setSkip(0);
    setAppliedEmail(nextEmail.length >= 3 ? nextEmail : "");
    setAppliedPhone(nextPhone.length >= 3 ? nextPhone : "");
    setSelectedOrder(null);
  }

  function handleClearSearch() {
    setEmailInput("");
    setPhoneInput("");
    setAppliedEmail("");
    setAppliedPhone("");
    setSearchError(null);
    setSkip(0);
    setSelectedOrder(null);
  }

  function selectOrder(order: AdminOrder) {
    setSelectedOrder(order);
    reset({ deliveryStatus: order.deliveryStatus });
    setUpdateError(null);
    setUpdateSuccess(false);
  }

  async function onUpdateStatus(values: { deliveryStatus: AdminOrder["deliveryStatus"] }) {
    if (!accessToken || !selectedOrder) {
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const updated = await updateOrderDeliveryStatus(
        accessToken,
        selectedOrder.id,
        values,
      );
      setSelectedOrder({ ...selectedOrder, ...updated });
      reset({ deliveryStatus: updated.deliveryStatus });
      setUpdateSuccess(true);
      await mutate();
    } catch (err) {
      setUpdateError(getApiErrorMessage(err, "Could not update delivery status."));
    } finally {
      setIsUpdating(false);
    }
  }

  const total = data?.total ?? 0;
  const hasFilters = Boolean(appliedEmail || appliedPhone);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Pharmacy orders"
        description="Browse all pharmacy orders, search by customer email or delivery phone, and update delivery status."
      />

      <form
        onSubmit={handleSearch}
        className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <AdminFormField label="Search by email">
          <input
            type="search"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
            className={adminInputClass}
            placeholder="patient@example.com"
          />
        </AdminFormField>
        <AdminFormField label="Search by phone">
          <input
            type="search"
            value={phoneInput}
            onChange={(event) => setPhoneInput(event.target.value)}
            className={adminInputClass}
            placeholder="+8801700000000"
          />
        </AdminFormField>
        <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
          <Button type="submit">Search orders</Button>
          {hasFilters ? (
            <Button type="button" variant="outline" onClick={handleClearSearch}>
              Clear filters
            </Button>
          ) : null}
        </div>
        <p className="text-xs text-[var(--color-text-muted)] sm:col-span-2 lg:col-span-4">
          Email matches registered patient accounts only. Use at least 3 characters per field.
          Both filters apply together when set.
        </p>
      </form>

      {searchError ? <ErrorMessage message={searchError} /> : null}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}

      {error ? (
        <ErrorMessage message={getApiErrorMessage(error, "Could not load pharmacy orders.")} />
      ) : null}

      {!isLoading && !error && data ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Showing {data.items.length} of {total} order{total === 1 ? "" : "s"}
            </p>
            {total > DEFAULT_ADMIN_ORDERS_PAGE_SIZE ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                Page {Math.floor(skip / DEFAULT_ADMIN_ORDERS_PAGE_SIZE) + 1} of{" "}
                {Math.ceil(total / DEFAULT_ADMIN_ORDERS_PAGE_SIZE)}
              </p>
            ) : null}
          </div>

          <AdminOrdersList
            orders={data.items}
            selectedOrderId={selectedOrder?.id}
            emptyMessage={
              hasFilters
                ? "No orders match your search."
                : "No pharmacy orders yet."
            }
            onSelect={selectOrder}
          />

          {total > DEFAULT_ADMIN_ORDERS_PAGE_SIZE ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={skip === 0}
                onClick={() => {
                  setSkip((current) => Math.max(0, current - DEFAULT_ADMIN_ORDERS_PAGE_SIZE));
                  setSelectedOrder(null);
                }}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={skip + DEFAULT_ADMIN_ORDERS_PAGE_SIZE >= total}
                onClick={() => {
                  setSkip((current) => current + DEFAULT_ADMIN_ORDERS_PAGE_SIZE);
                  setSelectedOrder(null);
                }}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      ) : null}

      {selectedOrder ? (
        <div className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-slate-50 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
                Order {selectedOrder.id.slice(0, 8).toUpperCase()}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {selectedOrder.customerEmail ?? "Guest order"} · {selectedOrder.deliveryPhone}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Placed {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OrderStatusBadge type="payment" status={selectedOrder.paymentStatus} />
              <OrderStatusBadge type="delivery" status={selectedOrder.deliveryStatus} />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">Delivery address</p>
            <p className="mt-2 whitespace-pre-line">{selectedOrder.deliveryAddress}</p>
          </div>

          <OrderSummary order={selectedOrder} />

          <form onSubmit={handleSubmit(onUpdateStatus)} className="space-y-4">
            <AdminFormField label="Update delivery status">
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
              <p className="text-sm font-medium text-emerald-600">Delivery status updated.</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save delivery status"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
