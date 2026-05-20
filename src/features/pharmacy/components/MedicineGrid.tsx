import { EmptyState } from "@/components/ui/EmptyState";
import { MedicineCard } from "@/features/pharmacy/components/MedicineCard";
import type { Cart, Medicine } from "@/features/pharmacy/lib/pharmacy.types";

interface MedicineGridProps {
  medicines: Medicine[];
  cart: Cart | null;
  isLoading: boolean;
  isUpdating: boolean;
  onAddItem: (medicineId: string, quantity: number) => Promise<void>;
  onUpdateQuantity: (medicineId: string, quantity: number) => Promise<void>;
}

export function MedicineGrid({
  medicines,
  cart,
  isLoading,
  isUpdating,
  onAddItem,
  onUpdateQuantity,
}: MedicineGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white animate-pulse"
          >
            <div className="aspect-[4/3] bg-sky-100" />
            <div className="space-y-4 p-5">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-200" />
              <div className="h-8 w-1/3 rounded bg-slate-200" />
              <div className="h-11 rounded-xl bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <EmptyState
        title="No medicines found"
        description="Try a different search or switch categories to explore available medicines."
        icon={
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
            <path d="m8 16 8-8a4 4 0 1 1 5.6 5.6l-8 8A4 4 0 0 1 8 16Z" stroke="currentColor" strokeWidth="1.8" />
            <path d="m10 6 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {medicines.map((medicine) => (
        <MedicineCard
          key={medicine.id}
          medicine={medicine}
          cart={cart}
          isUpdating={isUpdating}
          onAddItem={onAddItem}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
}
