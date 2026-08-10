import Link from "next/link";

import { AppointmentStatusBadge } from "@/features/appointments/components/AppointmentStatusBadge";
import { formatAppointmentFee } from "@/lib/appointments/appointments.utils";
import type { Appointment } from "@/lib/appointments/appointments.types";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <article className="surface-card rounded-[2rem] border border-[var(--color-border)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
            {appointment.doctor?.fullName ?? "Doctor"}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {appointment.healthCenter?.name ?? "Health center"}
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {appointment.date} at {appointment.startTime}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[var(--color-primary)]">
            {formatAppointmentFee(appointment.fee)}
          </p>
          <div className="mt-2 flex justify-end">
            <AppointmentStatusBadge status={appointment.status} />
          </div>
        </div>
      </div>
      <Link
        href={`/appointments/${appointment.id}`}
        className="mt-5 inline-flex text-sm font-semibold text-[var(--color-primary)]"
      >
        View details →
      </Link>
    </article>
  );
}
