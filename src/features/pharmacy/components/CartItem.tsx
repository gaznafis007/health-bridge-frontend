"use client";

import { formatPrice } from "@/features/pharmacy/lib/pharmacy.utils";
import type { CartItem as CartItemType } from "@/features/pharmacy/lib/pharmacy.types";

interface CartItemProps {
  item: CartItemType;
  isUpdating: boolean;
  onUpdateQuantity: (medicineId: string, quantity: number) => Promise<void>;
  onRemove: (medicineId: string) => Promise<void>;
}

export function CartItem({
  item,
  isUpdating,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="border-b border-slate-100 py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[var(--color-text-primary)]">{item.medicineName}</h3>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {item.genericName ?? "General medicine"}
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {formatPrice(item.unitPrice)} each
          </p>
        </div>
        <button
          type="button"
          onClick={() => void onRemove(item.medicineId)}
          aria-label={`Remove ${item.medicineName} from cart`}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl text-[var(--color-text-muted)] transition hover:bg-red-50 hover:text-[var(--color-danger)]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-2">
          <QuantityButton
            label="Decrease quantity"
            disabled={isUpdating}
            onClick={() => void onUpdateQuantity(item.medicineId, item.quantity - 1)}
          >
            –
          </QuantityButton>
          <span className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl bg-white text-sm font-semibold text-[var(--color-text-primary)]">
            {item.quantity}
          </span>
          <QuantityButton
            label="Increase quantity"
            disabled={item.quantity >= 20 || isUpdating}
            onClick={() => void onUpdateQuantity(item.medicineId, item.quantity + 1)}
          >
            +
          </QuantityButton>
        </div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {formatPrice(item.totalPrice)}
        </p>
      </div>
    </div>
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
      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl bg-white text-lg font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
