import Link from "next/link";

import { OrderStatusBadge } from "@/features/pharmacy/components/OrderStatusBadge";
import { OrderSummary } from "@/features/pharmacy/components/OrderSummary";
import { getOrder } from "@/features/pharmacy/lib/pharmacy.api";
import type { ApiError, Order } from "@/features/pharmacy/lib/pharmacy.types";

interface OrderTrackingPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ session?: string }>;
}

export default async function OrderTrackingPage({
  params,
  searchParams,
}: OrderTrackingPageProps) {
  const { orderId } = await params;
  const { session } = await searchParams;

  if (!session) {
    return <OrderNotFoundCard />;
  }

  let order: Order | null = null;

  try {
    order = await getOrder(orderId, session);
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.status !== 404) {
      throw error;
    }
  }

  if (!order) {
    return <OrderNotFoundCard />;
  }

  const isPaid = order.paymentStatus === "PAID";

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="surface-card rounded-[2rem] border border-[var(--color-border)] p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
              <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-heading mt-5 text-3xl font-bold text-emerald-600">
            {isPaid ? "Order Confirmed ✓" : "Order Placed"}
          </h1>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Order placed: {formatOrderDate(order.createdAt)}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <OrderStatusBadge type="delivery" status={order.deliveryStatus} />
          <OrderStatusBadge type="payment" status={order.paymentStatus} />
        </div>

        <div className="mt-8 grid gap-6 rounded-[2rem] bg-slate-50 p-6 sm:grid-cols-3">
          <InfoBlock title="Delivery Address" value={order.deliveryAddress} />
          <InfoBlock title="Delivery Phone" value={order.deliveryPhone} />
          <InfoBlock
            title="Payment Method"
            value={order.paymentMethod === "CASH" ? "Cash on Delivery" : "Online Payment"}
          />
        </div>

        <div className="mt-8">
          <OrderSummary order={order} />
        </div>

        <div className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
            Delivery Timeline
          </h2>
          <div className="mt-6 space-y-4">
            {buildTimeline(order.deliveryStatus).map((step, index) => (
              <div key={step.label} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                      step.state === "complete"
                        ? "bg-[var(--color-primary)] text-white"
                        : step.state === "cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {index < 4 ? <span className="mt-2 h-10 w-px bg-slate-200" /> : null}
                </div>
                <div className="pt-1">
                  <p className="font-medium text-[var(--color-text-primary)]">{step.label}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pharmacy"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)]"
          >
            Track another order
          </Link>
          <Link
            href="/pharmacy"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

function OrderNotFoundCard() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="surface-card rounded-[2rem] border border-[var(--color-border)] p-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)]">
          We couldn&apos;t find that order
        </h1>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          The order ID and guest session did not match, or the order may no
          longer be available.
        </p>
        <Link
          href="/pharmacy"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white"
        >
          Return to Pharmacy
        </Link>
      </div>
    </section>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[var(--color-text-primary)]">
        {value}
      </p>
    </div>
  );
}

function formatOrderDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function buildTimeline(status: Order["deliveryStatus"]) {
  if (status === "CANCELLED") {
    return [
      { label: "Pending", description: "Your order was received.", state: "complete" as const },
      { label: "Cancelled", description: "This order has been cancelled.", state: "cancelled" as const },
    ];
  }

  const steps = [
    ["PENDING", "Pending", "Your order has been submitted."],
    ["CONFIRMED", "Confirmed", "A pharmacist has reviewed your order."],
    ["SHIPPED", "Shipped", "Your medicines are on the way to your area."],
    ["OUT_FOR_DELIVERY", "Out for Delivery", "The rider is heading to your address."],
    ["DELIVERED", "Delivered", "Your order has arrived successfully."],
  ] as const;

  const currentIndex = steps.findIndex(([value]) => value === status);

  return steps.map(([, label, description], index) => ({
    label,
    description,
    state: index <= currentIndex ? ("complete" as const) : ("upcoming" as const),
  }));
}
