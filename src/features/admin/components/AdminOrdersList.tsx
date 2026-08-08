"use client";

import { OrderStatusBadge } from "@/features/pharmacy/components/OrderStatusBadge";
import type { AdminOrder } from "@/lib/pharmacy/admin.api";

function formatOrderDate(value: string) {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

function formatOrderId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

interface AdminOrdersListProps {
  orders: AdminOrder[];
  selectedOrderId?: string | null;
  emptyMessage: string;
  onSelect: (order: AdminOrder) => void;
}

export function AdminOrdersList({
  orders,
  selectedOrderId,
  emptyMessage,
  onSelect,
}: AdminOrdersListProps) {
  if (orders.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--color-border)] bg-slate-50 px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
      <div className="hidden border-b border-[var(--color-border)] bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1.1fr)_auto] lg:gap-4">
        <span>Order & customer</span>
        <span>Contact</span>
        <span>Amount</span>
        <span>Status</span>
        <span className="sr-only">Action</span>
      </div>

      <ul className="divide-y divide-[var(--color-border)]">
        {orders.map((order) => {
          const { date, time } = formatOrderDate(order.createdAt);
          const isSelected = selectedOrderId === order.id;
          const customerLabel = order.customerEmail ?? "Guest checkout";

          return (
            <li key={order.id}>
              <button
                type="button"
                onClick={() => onSelect(order)}
                aria-current={isSelected ? "true" : undefined}
                className={`group flex w-full flex-col gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1.1fr)_auto] lg:items-center lg:gap-4 ${
                  isSelected ? "bg-sky-50/80 ring-1 ring-inset ring-sky-200" : ""
                }`}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold tracking-wide text-[var(--color-text-primary)]">
                      #{formatOrderId(order.id)}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] lg:hidden">
                      {date} · {time}
                    </span>
                  </div>
                  <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                    {customerLabel}
                  </p>
                  <p className="hidden text-xs text-[var(--color-text-muted)] lg:block">
                    Placed {date} at {time}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm text-[var(--color-text-secondary)]">
                    {order.deliveryPhone}
                  </p>
                  <p className="mt-1 truncate text-xs text-[var(--color-text-muted)] lg:hidden">
                    {order.deliveryAddress}
                  </p>
                </div>

                <div>
                  <p className="text-base font-semibold text-[var(--color-text-primary)]">
                    ৳{order.finalAmount}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <OrderStatusBadge
                    type="payment"
                    status={order.paymentStatus}
                    compact
                  />
                  <OrderStatusBadge
                    type="delivery"
                    status={order.deliveryStatus}
                    compact
                  />
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline lg:hidden">
                    View details
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition-colors group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)]"
                  >
                    →
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
