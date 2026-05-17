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

export function OrderStatusBadge({
  type,
  status,
}: {
  type: "delivery" | "payment";
  status: OrderBadgeStatus;
}) {
  const variant = getVariant(status);
  const label =
    type === "delivery"
      ? DELIVERY_LABELS[status as Order["deliveryStatus"]]
      : PAYMENT_LABELS[status as Order["paymentStatus"]];

  return <Badge variant={variant}>{label}</Badge>;
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
