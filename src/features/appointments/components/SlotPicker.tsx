import type { SlotsByCenter, TimeSlot } from "@/lib/appointments/appointments.types";

interface SlotPickerProps {
  slotsByCenter: SlotsByCenter[];
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

export function SlotPicker({
  slotsByCenter,
  selectedSlot,
  onSelect,
}: SlotPickerProps) {
  if (slotsByCenter.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-secondary)]">
        No available slots for this date.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {slotsByCenter.map(({ healthCenter, slots }) => (
        <section key={healthCenter.id}>
          <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
            {healthCenter.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {healthCenter.address}, {healthCenter.city}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {slots.map((slot) => {
              const isSelected =
                selectedSlot?.availabilityRuleId === slot.availabilityRuleId &&
                selectedSlot.startTime === slot.startTime;

              return (
                <button
                  key={`${slot.availabilityRuleId}-${slot.startTime}`}
                  type="button"
                  disabled={!slot.available}
                  aria-label={`${slot.startTime}, ${slot.durationMinutes} minutes${
                    !slot.available ? ", unavailable" : ""
                  }`}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(slot)}
                  className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                    !slot.available
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : isSelected
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-white text-[var(--color-text-primary)] ring-1 ring-[var(--color-border)] hover:ring-[var(--color-primary)]"
                  }`}
                >
                  {slot.startTime}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
