"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { OrderStatusBadge } from "@/features/pharmacy/components/OrderStatusBadge";
import { OrderIdCopyField } from "@/features/pharmacy/components/OrderIdCopyField";
import { OrderSummary } from "@/features/pharmacy/components/OrderSummary";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getOrder,
  getPatientOrder,
} from "@/features/pharmacy/lib/pharmacy.api";
import { readGuestSessionFromStorage } from "@/features/pharmacy/lib/guest-session.storage";
import { saveDeliveryPhoneForTracking } from "@/features/pharmacy/lib/pharmacy-tracking.storage";
import { isUuid } from "@/features/pharmacy/lib/pharmacy.utils";
import type { Order } from "@/features/pharmacy/lib/pharmacy.types";
import { getApiErrorMessage } from "@/lib/api/errors";

interface PharmacyOrderDetailShellProps {
  orderId: string;
  guestSessionId?: string;
  orderJustPlaced?: boolean;
}

export function PharmacyOrderDetailShell({
  orderId,
  guestSessionId,
  orderJustPlaced = false,
}: PharmacyOrderDetailShellProps) {
  const { accessToken, user, isLoading: isAuthLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlacedBanner, setShowPlacedBanner] = useState(orderJustPlaced);

  const resolvedGuestSessionId = useMemo(() => {
    const fromUrl = guestSessionId?.trim();
    if (fromUrl && isUuid(fromUrl)) {
      return fromUrl;
    }

    const fromStorage = readGuestSessionFromStorage()?.sessionId;
    if (fromStorage && isUuid(fromStorage)) {
      return fromStorage;
    }

    return null;
  }, [guestSessionId]);

  const isGuestViewer = !accessToken || user?.role !== "PATIENT";

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    let mounted = true;

    async function load() {
      try {
        let data: Order;

        if (user?.role === "PATIENT" && accessToken) {
          data = await getPatientOrder(accessToken, orderId);
        } else if (resolvedGuestSessionId) {
          data = await getOrder(orderId, resolvedGuestSessionId);
        } else {
          if (mounted) {
            setError(
              "We could not verify this guest order. Use the same browser you ordered from, or track your order from the pharmacy page.",
            );
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setOrder(data);
          setError(null);
          saveDeliveryPhoneForTracking(data.deliveryPhone);
        }
      } catch (err) {
        if (mounted) {
          setError(getApiErrorMessage(err, "Order not found."));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [accessToken, orderId, resolvedGuestSessionId, user?.role, isAuthLoading]);

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
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href={`/pharmacy/track-order?orderId=${encodeURIComponent(orderId)}&mode=orderId`}
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            Search by order ID
          </Link>
          <Link
            href="/pharmacy/track-order"
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            Track by phone
          </Link>
          <Link href="/pharmacy" className="text-sm font-semibold text-[var(--color-primary)]">
            Return to pharmacy
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="surface-card rounded-[2rem] border border-[var(--color-border)] p-8">
        {showPlacedBanner ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
            <p className="font-semibold">Your order has been placed.</p>
            <p className="mt-1 text-emerald-800">
              Copy your order ID below, or use Track Orders in the navbar to find all orders with
              your phone number.
            </p>
            <div className="mt-4">
              <OrderIdCopyField orderId={order.id} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/pharmacy/track-order?orderId=${encodeURIComponent(order.id)}&mode=orderId`}
                className="text-xs font-semibold text-emerald-900 underline"
              >
                Open track-by-ID page
              </Link>
              <Link
                href={`/pharmacy/track-order?phone=${encodeURIComponent(order.deliveryPhone)}`}
                className="text-xs font-semibold text-emerald-900 underline"
              >
                View all orders for {order.deliveryPhone}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setShowPlacedBanner(false)}
              className="mt-3 text-xs font-semibold text-emerald-900 underline"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)]">
            {showPlacedBanner ? "Order confirmation" : "Order tracking"}
          </h1>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Order #{order.id.slice(0, 8).toUpperCase()} · Placed{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          {!showPlacedBanner ? (
            <div className="mt-6 text-left">
              <OrderIdCopyField orderId={order.id} />
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <OrderStatusBadge type="delivery" status={order.deliveryStatus} />
          <OrderStatusBadge type="payment" status={order.paymentStatus} />
        </div>

        <div className="mt-8">
          <OrderSummary order={order} />
        </div>

        {isGuestViewer ? (
          <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-[var(--color-text-secondary)]">
            <p className="font-semibold text-[var(--color-text-primary)]">
              Guest order tracking
            </p>
            <p className="mt-2">
              Use{" "}
              <Link
                href={`/pharmacy/track-order?phone=${encodeURIComponent(order.deliveryPhone)}`}
                className="font-semibold text-[var(--color-primary)]"
              >
                Track Orders
              </Link>{" "}
              in the navbar to see every order for {order.deliveryPhone}.{" "}
              <Link href="/auth/register" className="font-semibold text-[var(--color-primary)]">
                Create an account
              </Link>{" "}
              to save order history permanently.
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {user?.role === "PATIENT" && accessToken ? (
            <Link href="/pharmacy/orders" className="text-sm font-semibold text-[var(--color-primary)]">
              All my orders
            </Link>
          ) : (
            <Link
              href={`/pharmacy/track-order?phone=${encodeURIComponent(order.deliveryPhone)}`}
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              Track all orders by phone
            </Link>
          )}
          <Link href="/pharmacy" className="text-sm font-semibold text-[var(--color-primary)]">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
