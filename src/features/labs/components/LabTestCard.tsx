import { Button } from "@/components/ui/Button";
import type { LabTest } from "@/lib/labs/labs.types";

interface LabTestCardProps {
  test: LabTest;
  isSelected: boolean;
  onToggle: () => void;
}

export function LabTestCard({ test, isSelected, onToggle }: LabTestCardProps) {
  return (
    <article className="surface-card flex h-full flex-col rounded-[2rem] border border-[var(--color-border)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
            {test.name}
          </h3>
          {test.description ? (
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              {test.description}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-lg font-bold text-[var(--color-primary)]">
          ৳{Number.parseFloat(test.price).toFixed(0)}
        </p>
      </div>
      {test.duration ? (
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
          Duration: {test.duration}
        </p>
      ) : null}
      <div className="mt-5">
        <Button
          type="button"
          variant={isSelected ? "outline" : "primary"}
          className="w-full"
          onClick={onToggle}
        >
          {isSelected ? "Remove" : "Add to booking"}
        </Button>
      </div>
    </article>
  );
}
