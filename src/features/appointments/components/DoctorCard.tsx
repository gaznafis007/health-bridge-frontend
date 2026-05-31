import { Badge } from "@/components/ui/Badge";
import type { DoctorSearchResult } from "@/lib/appointments/appointments.types";

interface DoctorCardProps {
  doctor: DoctorSearchResult;
  onSelect: () => void;
}

export function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="surface-card w-full rounded-[2rem] border border-[var(--color-border)] p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[0_24px_50px_rgba(14,165,233,0.12)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-[var(--color-primary)]">
          <DoctorIcon />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
            {doctor.fullName}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {doctor.specialization}
          </p>
          <div className="mt-3">
            <Badge variant={doctor.freeSlotCount > 0 ? "success" : "neutral"}>
              {doctor.freeSlotCount} free slot
              {doctor.freeSlotCount === 1 ? "" : "s"}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  );
}

function DoctorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
