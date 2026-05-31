"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { OrderStatusBadge } from "@/features/pharmacy/components/OrderStatusBadge";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { getMyOrders } from "@/features/pharmacy/lib/pharmacy.api";
import { useAuthenticatedSWR } from "@/lib/hooks/useAuthenticatedSWR";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";

export function PharmacyOrdersShell() {
  const [skip, setSkip] = useState(0);
  const take = 20;

  const { data, error, isLoading } = useAuthenticatedSWR(
    `pharmacy/orders/me?skip=${skip}`,
    (token) => getMyOrders(token, skip, take),
  );

  return (
    <RequireRole allowed={["PATIENT"]}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <SectionHeader
          title="My pharmacy orders"
          description="Track medicine orders linked to your account."
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}

        {error ? <ErrorMessage message="Could not load your orders." /> : null}

        {data && data.items.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">No orders yet.</p>
        ) : null}

        {data && data.items.length > 0 ? (
          <ul className="space-y-4">
            {data.items.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/pharmacy/orders/${order.id}`}
                  className="block rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:bg-slate-50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {new Date(order.createdAt).toLocaleString()} · ৳{order.finalAmount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <OrderStatusBadge type="delivery" status={order.deliveryStatus} />
                      <OrderStatusBadge type="payment" status={order.paymentStatus} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {data && data.total > take ? (
          <div className="mt-6 flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={skip === 0}
              onClick={() => setSkip((s) => Math.max(0, s - take))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={skip + take >= data.total}
              onClick={() => setSkip((s) => s + take)}
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </RequireRole>
  );
}
