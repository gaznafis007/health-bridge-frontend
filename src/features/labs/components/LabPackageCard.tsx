import { Button } from "@/components/ui/Button";
import type { LabPackage } from "@/lib/labs/labs.types";

interface LabPackageCardProps {
  packageItem: LabPackage;
  isSelected: boolean;
  onToggle: () => void;
}

export function LabPackageCard({
  packageItem,
  isSelected,
  onToggle,
}: LabPackageCardProps) {
  return (
    <article className="surface-card flex h-full flex-col rounded-[2rem] border border-[var(--color-border)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
            {packageItem.name}
          </h3>
          {packageItem.description ? (
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              {packageItem.description}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-lg font-bold text-[var(--color-primary)]">
          ৳{Number.parseFloat(packageItem.price).toFixed(0)}
        </p>
      </div>
      {packageItem.tests.length > 0 ? (
        <ul className="mt-4 space-y-1 text-sm text-[var(--color-text-secondary)]">
          {packageItem.tests.map((test) => (
            <li key={test.id} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
              {test.name}
            </li>
          ))}
        </ul>
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
