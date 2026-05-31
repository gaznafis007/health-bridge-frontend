import { Badge } from "@/components/ui/Badge";
import type {
  BookingStatus,
  ReportStatus,
  SampleStatus,
  TestPaymentStatus,
} from "@/lib/labs/labs.types";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

const bookingStatusVariants: Record<BookingStatus, BadgeVariant> = {
  PENDING_PAYMENT: "neutral",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "success",
};

const sampleStatusVariants: Record<SampleStatus, BadgeVariant> = {
  PENDING: "neutral",
  COLLECTED: "warning",
  PROCESSING: "warning",
  COMPLETED: "success",
  DELIVERED: "success",
};

const paymentStatusVariants: Record<TestPaymentStatus, BadgeVariant> = {
  PENDING: "neutral",
  PAID: "success",
  FAILED: "danger",
};

const reportStatusVariants: Record<ReportStatus, BadgeVariant> = {
  PENDING: "neutral",
  READY: "warning",
  DELIVERED: "success",
  ARCHIVED: "neutral",
};

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

interface LabStatusBadgeProps {
  status: BookingStatus | SampleStatus | TestPaymentStatus | ReportStatus;
  kind: "booking" | "sample" | "payment" | "report";
}

export function LabStatusBadge({ status, kind }: LabStatusBadgeProps) {
  const variant =
    kind === "booking"
      ? bookingStatusVariants[status as BookingStatus]
      : kind === "sample"
        ? sampleStatusVariants[status as SampleStatus]
        : kind === "payment"
          ? paymentStatusVariants[status as TestPaymentStatus]
          : reportStatusVariants[status as ReportStatus];

  return <Badge variant={variant}>{formatLabel(status)}</Badge>;
}
