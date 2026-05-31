import { Badge } from "@/components/ui/Badge";
import type { AmbulanceBookingStatus } from "@/lib/ambulance/ambulance.types";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

const statusVariants: Record<AmbulanceBookingStatus, BadgeVariant> = {
  REQUESTED: "neutral",
  ACCEPTED: "warning",
  ARRIVED: "warning",
  IN_TRANSIT: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

interface AmbulanceStatusBadgeProps {
  status: AmbulanceBookingStatus;
}

export function AmbulanceStatusBadge({ status }: AmbulanceStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}
