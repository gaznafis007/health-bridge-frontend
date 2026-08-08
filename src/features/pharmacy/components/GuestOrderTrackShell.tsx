"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { OrderStatusBadge } from "@/features/pharmacy/components/OrderStatusBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { getOrdersByPhone } from "@/features/pharmacy/lib/pharmacy.api";
import { readGuestSessionFromStorage } from "@/features/pharmacy/lib/guest-session.storage";
import {
  readDeliveryPhoneForTracking,
  saveDeliveryPhoneForTracking,
} from "@/features/pharmacy/lib/pharmacy-tracking.storage";
import type { Order } from "@/features/pharmacy/lib/pharmacy.types";
import { isUuid } from "@/features/pharmacy/lib/pharmacy.utils";
import { getApiErrorMessage } from "@/lib/api/errors";

type TrackMode = "phone" | "orderId";

const phonePattern = /^\+?[1-9]\d{7,14}$/;
const PAGE_SIZE = 20;

export function GuestOrderTrackShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get("phone") ?? readDeliveryPhoneForTracking() ?? "";
  const initialOrderId = searchParams.get("orderId") ?? "";
  const initialMode: TrackMode =
    searchParams.get("mode") === "orderId" || (initialOrderId && !initialPhone)
      ? "orderId"
      : "phone";

  const [mode, setMode] = useState<TrackMode>(initialMode);
  const [phone, setPhone] = useState(initialPhone);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [orderIdError, setOrderIdError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchByPhone = useCallback(async (nextPhone: string, nextSkip: number) => {
    const trimmedPhone = nextPhone.trim();

    if (!phonePattern.test(trimmedPhone)) {
      setPhoneError("Enter a valid phone number in the same format used at checkout (e.g. +8801712345678).");
      return;
    }

    setIsSearching(true);
    setPhoneError(null);

    try {
      const page = await getOrdersByPhone(trimmedPhone, nextSkip, PAGE_SIZE);
      setOrders(page.items);
      setTotal(page.total);
      setSkip(page.skip);
      setHasSearched(true);
      saveDeliveryPhoneForTracking(trimmedPhone);
    } catch (error) {
      setPhoneError(getApiErrorMessage(error, "Could not find orders for this phone number."));
      setOrders([]);
      setTotal(0);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (initialMode !== "phone" || !initialPhone.trim()) {
      return;
    }

    void searchByPhone(initialPhone, 0);
  }, [initialMode, initialPhone, searchByPhone]);

  function handlePhoneSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSkip(0);
    void searchByPhone(phone, 0);
  }

  function handleOrderIdSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedOrderId = orderId.trim();
    if (!trimmedOrderId) {
      setOrderIdError("Enter your order ID.");
      return;
    }

    const guestSession = readGuestSessionFromStorage();
    if (!guestSession) {
      setOrderIdError(
        "Your guest session expired. Track by phone number instead, or place a new order from the pharmacy.",
      );
      return;
    }

    setOrderIdError(null);
    router.push(
      `/pharmacy/orders/${encodeURIComponent(trimmedOrderId)}?session=${encodeURIComponent(guestSession.sessionId)}`,
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <SectionHeader
        title="Track pharmacy orders"
        description="Look up guest orders with the delivery phone number from checkout, or open a single order with its ID."
      />

      <div className="mt-8 flex gap-2 rounded-2xl border border-[var(--color-border)] bg-slate-50 p-1">
        {(
          [
            ["phone", "By phone"],
            ["orderId", "By order ID"],
          ] as const
        ).map(([value, label]) => {
          const selected = mode === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                selected
                  ? "bg-white text-[var(--color-primary)] shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {mode === "phone" ? (
        <div className="mt-6 space-y-6">
          <form
            onSubmit={handlePhoneSubmit}
            className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-6"
          >
            <div>
              <label htmlFor="deliveryPhone" className="mb-2 block text-sm font-medium">
                Delivery phone
              </label>
              <input
                id="deliveryPhone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+8801712345678"
                className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
              />
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Use the exact number from checkout, including country code.
              </p>
            </div>

            {phoneError ? <ErrorMessage message={phoneError} /> : null}

            <Button type="submit" className="w-full rounded-2xl" disabled={isSearching}>
              {isSearching ? "Searching..." : "Find my orders"}
            </Button>
          </form>

          {isSearching ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : null}

          {hasSearched && !isSearching && orders.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-text-secondary)]">
              No orders found for this phone number.
            </p>
          ) : null}

          {orders.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Found {total} order{total === 1 ? "" : "s"}
              </p>
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order.id}>
                    <OrderListCard order={order} />
                  </li>
                ))}
              </ul>

              {total > PAGE_SIZE ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={skip === 0 || isSearching}
                    onClick={() => void searchByPhone(phone, Math.max(0, skip - PAGE_SIZE))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={skip + PAGE_SIZE >= total || isSearching}
                    onClick={() => void searchByPhone(phone, skip + PAGE_SIZE)}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <form
          onSubmit={handleOrderIdSubmit}
          className="mt-6 space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-6"
        >
          <div>
            <label htmlFor="orderId" className="mb-2 block text-sm font-medium">
              Order ID
            </label>
            <input
              id="orderId"
              type="text"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="e.g. f8de4c23-4a58-405f-ae0f-0de82a4f65cb"
              className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
            />
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Copy the full order ID from your confirmation page. Works on the same browser you
              ordered from.
            </p>
          </div>

          {orderIdError ? <ErrorMessage message={orderIdError} /> : null}

          <Button type="submit" className="w-full rounded-2xl">
            Open order
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        Have an account?{" "}
        <Link href="/auth/login?redirect=/pharmacy/orders" className="font-semibold text-[var(--color-primary)]">
          Sign in to see all orders
        </Link>
      </p>
    </section>
  );
}

function OrderListCard({ order }: { order: Order }) {
  const href =
    order.guestSessionId && isUuid(order.guestSessionId)
      ? `/pharmacy/orders/${order.id}?session=${encodeURIComponent(order.guestSessionId)}`
      : `/pharmacy/orders/${order.id}`;

  return (
    <Link
      href={href}
      className="block rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:bg-slate-50"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {new Date(order.createdAt).toLocaleString()} · ৳{order.finalAmount}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge type="delivery" status={order.deliveryStatus} />
          <OrderStatusBadge type="payment" status={order.paymentStatus} />
        </div>
      </div>
    </Link>
  );
}
