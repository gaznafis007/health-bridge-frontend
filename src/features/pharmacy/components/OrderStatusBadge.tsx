import { Badge } from "@/components/ui/Badge";
import type { Order } from "@/features/pharmacy/lib/pharmacy.types";

type OrderBadgeStatus = Order["deliveryStatus"] | Order["paymentStatus"];

const DELIVERY_LABELS: Record<Order["deliveryStatus"], string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const PAYMENT_LABELS: Record<Order["paymentStatus"], string> = {
  PENDING: "Payment Pending",
  PENDING_CASH: "Awaiting Cash Payment",
  PAID: "Paid",
  FAILED: "Payment Failed",
};

const COMPACT_PAYMENT_LABELS: Record<Order["paymentStatus"], string> = {
  PENDING: "Payment pending",
  PENDING_CASH: "Cash due",
  PAID: "Paid",
  FAILED: "Failed",
};

const COMPACT_DELIVERY_LABELS: Record<Order["deliveryStatus"], string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function OrderStatusBadge({
  type,
  status,
  compact = false,
}: {
  type: "delivery" | "payment";
  status: OrderBadgeStatus;
  compact?: boolean;
}) {
  const variant = getVariant(status);
  const label =
    type === "delivery"
      ? compact
        ? COMPACT_DELIVERY_LABELS[status as Order["deliveryStatus"]]
        : DELIVERY_LABELS[status as Order["deliveryStatus"]]
      : compact
        ? COMPACT_PAYMENT_LABELS[status as Order["paymentStatus"]]
        : PAYMENT_LABELS[status as Order["paymentStatus"]];

  return (
    <Badge
      variant={variant}
      className={compact ? "whitespace-nowrap px-2.5 py-0.5 text-[11px]" : ""}
    >
      {label}
    </Badge>
  );
}

function getVariant(status: OrderBadgeStatus) {
  switch (status) {
    case "DELIVERED":
    case "PAID":
      return "success" as const;
    case "OUT_FOR_DELIVERY":
    case "PENDING_CASH":
      return "warning" as const;
    case "CANCELLED":
    case "FAILED":
      return "danger" as const;
    default:
      return "neutral" as const;
  }
}
