"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartItem } from "@/features/pharmacy/components/CartItem";
import { CheckoutForm } from "@/features/pharmacy/components/CheckoutForm";
import { formatPrice } from "@/features/pharmacy/lib/pharmacy.utils";
import type { Cart } from "@/features/pharmacy/lib/pharmacy.types";

interface CartSidebarProps {
  isOpen: boolean;
  sessionId: string | null;
  cart: Cart | null;
  isUpdating: boolean;
  onClose: () => void;
  onUpdateQuantity: (medicineId: string, quantity: number) => Promise<void>;
  onRemoveItem: (medicineId: string) => Promise<void>;
  onCheckoutSuccess: () => void;
}

export function CartSidebar({
  isOpen,
  sessionId,
  cart,
  isUpdating,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess,
}: CartSidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const panel = panelRef.current;
    panel?.focus();

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) {
        return;
      }

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const hasPrescriptionItem = cart?.items.some((item) => item.requiresPrescription) ?? false;

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/40 transition ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        ref={panelRef}
        tabIndex={-1}
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-semibold text-[var(--color-text-primary)]">
              Your Cart
            </h2>
            <Badge variant="neutral">{cart?.totalItems ?? 0} items</Badge>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        {cart && cart.items.length > 0 ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.medicineId}
                  item={item}
                  isUpdating={isUpdating}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}

              {hasPrescriptionItem ? (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                  ⚠️ One or more items require a prescription. Please have your
                  prescription ready for verification upon delivery.
                </div>
              ) : null}

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  Delivery charge calculated at checkout.
                </p>
              </div>

              {sessionId ? (
                <div className="mt-6">
                  <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
                    Checkout
                  </h3>
                  <div className="mt-4">
                    <CheckoutForm
                      cart={cart}
                      sessionId={sessionId}
                      onSuccess={onCheckoutSuccess}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center px-5">
            <EmptyState
              title="Your cart is empty"
              description="Browse medicines and add what you need for a smooth guest checkout."
              icon={
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
                  <path d="m8 16 8-8a4 4 0 1 1 5.6 5.6l-8 8A4 4 0 0 1 8 16Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="m10 6 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              }
              action={
                <Link
                  href="/pharmacy"
                  onClick={onClose}
                  className="text-sm font-semibold text-[var(--color-primary)]"
                >
                  Browse medicines →
                </Link>
              }
            />
          </div>
        )}
      </aside>
    </>
  );
}
