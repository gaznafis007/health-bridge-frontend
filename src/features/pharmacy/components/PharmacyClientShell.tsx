"use client";

import { useEffect, useState } from "react";

import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CartSidebar } from "@/features/pharmacy/components/CartSidebar";
import { CategoryTabs } from "@/features/pharmacy/components/CategoryTabs";
import { GuestSessionBanner } from "@/features/pharmacy/components/GuestSessionBanner";
import { MedicineGrid } from "@/features/pharmacy/components/MedicineGrid";
import { PharmacyHero } from "@/features/pharmacy/components/PharmacyHero";
import { useCart } from "@/features/pharmacy/hooks/useCart";
import { useGuestSession } from "@/features/pharmacy/hooks/useGuestSession";
import { listMedicines } from "@/features/pharmacy/lib/pharmacy.api";
import type { Medicine, MedicineCategory } from "@/features/pharmacy/lib/pharmacy.types";

interface PharmacyClientShellProps {
  categories: MedicineCategory[];
  initialMedicines: Medicine[];
}

export function PharmacyClientShell({
  categories,
  initialMedicines,
}: PharmacyClientShellProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState(initialMedicines);
  const [isMedicineLoading, setIsMedicineLoading] = useState(false);
  const [listingError, setListingError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { sessionId, isReady, errorMessage: sessionError } = useGuestSession();
  const {
    cart,
    isLoading: isCartLoading,
    isUpdating,
    errorMessage: cartError,
    addItem,
    updateQuantity,
    removeItem,
    clearLocal,
  } = useCart(sessionId, isReady, medicines);

  useEffect(() => {
    let isMounted = true;

    async function refreshMedicines() {
      setIsMedicineLoading(true);
      try {
        const nextMedicines = await listMedicines({
          categoryId: selectedCategoryId ?? undefined,
          search: searchQuery || undefined,
          inStockOnly: true,
        });

        if (!isMounted) {
          return;
        }

        setMedicines(nextMedicines);
        setListingError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setListingError(getErrorMessage(error, "We could not load medicines right now."));
      } finally {
        if (isMounted) {
          setIsMedicineLoading(false);
        }
      }
    }

    refreshMedicines();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategoryId]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <PharmacyHero onSearchChange={setSearchQuery} />
          <GuestSessionBanner isReady={isReady} />
          {sessionError ? <ErrorMessage message={sessionError} /> : null}
          {listingError ? <ErrorMessage message={listingError} /> : null}
          {cartError ? <ErrorMessage message={cartError} /> : null}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CategoryTabs
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex min-h-12 items-center gap-3 rounded-2xl bg-[var(--color-text-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M4 6h2l2 9h9l2-6H7.5M10 20a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Cart
              <span className="rounded-full bg-white/15 px-2 py-1 text-xs">
                {cart?.totalItems ?? 0}
              </span>
            </button>
          </div>

          <MedicineGrid
            medicines={medicines}
            cart={cart}
            isLoading={isMedicineLoading || isCartLoading}
            isUpdating={isUpdating}
            onAddItem={async (medicineId, quantity) => {
              await addItem(medicineId, quantity);
              setIsCartOpen(true);
            }}
            onUpdateQuantity={updateQuantity}
          />
        </div>
      </section>

      <CartSidebar
        isOpen={isCartOpen}
        sessionId={sessionId}
        cart={cart}
        isUpdating={isUpdating}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckoutSuccess={() => {
          clearLocal();
          setIsCartOpen(false);
        }}
      />
    </>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
    ? (error as { message: string }).message
    : fallback;
}
