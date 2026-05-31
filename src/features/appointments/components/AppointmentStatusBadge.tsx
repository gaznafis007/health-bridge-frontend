import { Badge } from "@/components/ui/Badge";
import type { AppointmentStatus } from "@/lib/appointments/appointments.types";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

const statusVariants: Record<AppointmentStatus, BadgeVariant> = {
  SCHEDULED: "neutral",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}
