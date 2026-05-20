"use client";

import { useTransition } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatPrice } from "@/features/pharmacy/lib/pharmacy.utils";
import type { Cart, Medicine } from "@/features/pharmacy/lib/pharmacy.types";

interface MedicineCardProps {
  medicine: Medicine;
  cart: Cart | null;
  isUpdating: boolean;
  onAddItem: (medicineId: string, quantity: number) => Promise<void>;
  onUpdateQuantity: (medicineId: string, quantity: number) => Promise<void>;
}

export function MedicineCard({
  medicine,
  cart,
  isUpdating,
  onAddItem,
  onUpdateQuantity,
}: MedicineCardProps) {
  const [isPending, startTransition] = useTransition();
  const cartItem = cart?.items.find((item) => item.medicineId === medicine.id) ?? null;
  const isOutOfStock =
    medicine.stockQuantity === 0 || medicine.status === "OUT_OF_STOCK";

  const stockBadge = isOutOfStock
    ? { label: "Out of Stock", variant: "danger" as const }
    : medicine.stockQuantity <= 10
      ? { label: "Low Stock", variant: "warning" as const }
      : { label: "In Stock", variant: "success" as const };

  return (
    <article className="group surface-card overflow-hidden rounded-[2rem] border border-[var(--color-border)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(15,23,42,0.12)]">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-sky-50 to-cyan-100">
        <div className="absolute left-4 top-4">
          {medicine.requiresPrescription ? <Badge variant="warning">Rx</Badge> : null}
        </div>
        <div className="absolute right-4 top-4">
          <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
        </div>
        <div className="flex h-full items-center justify-center text-[var(--color-primary)]">
          <div aria-hidden="true" className="rounded-full bg-white/75 p-6 shadow-md">
            <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none">
              <path d="m8 16 8-8a4 4 0 1 1 5.6 5.6l-8 8A4 4 0 0 1 8 16Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="m10 6 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span className="sr-only">{medicine.name}</span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-2 font-heading text-base font-semibold text-[var(--color-text-primary)]">
            {medicine.name}
          </h3>
          <p className="mt-2 text-xs italic text-[var(--color-text-muted)]">
            {medicine.genericName ?? medicine.manufacturer ?? "Trusted healthcare supply"}
          </p>
          <span className="mt-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
            {medicine.categoryName}
          </span>
          <p className="mt-4 text-2xl font-bold text-[var(--color-primary)]">
            {formatPrice(medicine.price)}
          </p>
        </div>

        {cartItem ? (
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-2">
            <QuantityButton
              label="Decrease quantity"
              onClick={() =>
                startTransition(() => {
                  void onUpdateQuantity(medicine.id, cartItem.quantity - 1);
                })
              }
            >
              –
            </QuantityButton>
            <div className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-white text-sm font-semibold text-[var(--color-text-primary)]">
              {cartItem.quantity}
            </div>
            <QuantityButton
              label="Increase quantity"
              disabled={cartItem.quantity >= 20 || isPending || isUpdating}
              onClick={() =>
                startTransition(() => {
                  void onUpdateQuantity(medicine.id, cartItem.quantity + 1);
                })
              }
            >
              +
            </QuantityButton>
          </div>
        ) : (
          <Button
            variant="secondary"
            disabled={isOutOfStock || isPending || isUpdating}
            className="w-full rounded-xl"
            onClick={() =>
              startTransition(() => {
                void onAddItem(medicine.id, 1);
              })
            }
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Adding...
              </span>
            ) : (
              "Add to Cart"
            )}
          </Button>
        )}
      </div>
    </article>
  );
}

function QuantityButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: string;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-white text-lg font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
