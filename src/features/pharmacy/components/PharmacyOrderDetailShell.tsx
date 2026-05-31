"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { OrderStatusBadge } from "@/features/pharmacy/components/OrderStatusBadge";
import { OrderSummary } from "@/features/pharmacy/components/OrderSummary";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getOrder,
  getPatientOrder,
} from "@/features/pharmacy/lib/pharmacy.api";
import type { Order } from "@/features/pharmacy/lib/pharmacy.types";
import { getApiErrorMessage } from "@/lib/api/errors";

interface PharmacyOrderDetailShellProps {
  orderId: string;
  guestSessionId?: string;
}

export function PharmacyOrderDetailShell({
  orderId,
  guestSessionId,
}: PharmacyOrderDetailShellProps) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    let mounted = true;

    async function load() {
      try {
        let data: Order;
        if (guestSessionId) {
          data = await getOrder(orderId, guestSessionId);
        } else if (accessToken) {
          data = await getPatientOrder(accessToken, orderId);
        } else {
          router.replace(`/auth/login?redirect=/pharmacy/orders/${orderId}`);
          return;
        }
        if (mounted) {
          setOrder(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(getApiErrorMessage(err, "Order not found."));
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [accessToken, guestSessionId, isAuthLoading, orderId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 text-center">
        <h1 className="font-heading text-2xl font-bold">Order not found</h1>
        <p className="mt-3 text-[var(--color-text-secondary)]">{error}</p>
        <Link href="/pharmacy" className="mt-6 inline-block text-sm font-semibold text-[var(--color-primary)]">
          Return to pharmacy
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="surface-card rounded-[2rem] border border-[var(--color-border)] p-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)]">
            Order tracking
          </h1>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <OrderStatusBadge type="delivery" status={order.deliveryStatus} />
          <OrderStatusBadge type="payment" status={order.paymentStatus} />
        </div>

        <div className="mt-8">
          <OrderSummary order={order} />
        </div>

        <div className="mt-8 flex justify-center gap-3">
          {accessToken ? (
            <Link href="/pharmacy/orders" className="text-sm font-semibold text-[var(--color-primary)]">
              All my orders
            </Link>
          ) : null}
          <Link href="/pharmacy" className="text-sm font-semibold text-[var(--color-primary)]">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
