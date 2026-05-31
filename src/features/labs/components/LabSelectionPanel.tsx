import { Button } from "@/components/ui/Button";

interface LabSelectionPanelProps {
  selectionCount: number;
  totalAmount: number;
  onBook: () => void;
}

export function LabSelectionPanel({
  selectionCount,
  totalAmount,
  onBook,
}: LabSelectionPanelProps) {
  if (selectionCount === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-4 z-20 mx-auto max-w-3xl rounded-[1.5rem] border border-[var(--color-border)] bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {selectionCount} item{selectionCount === 1 ? "" : "s"} selected
          </p>
          <p className="font-heading text-xl font-bold text-[var(--color-text-primary)]">
            ৳{totalAmount.toFixed(0)}
          </p>
        </div>
        <Button type="button" onClick={onBook}>
          Book selected tests
        </Button>
      </div>
    </div>
  );
}
