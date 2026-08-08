"use client";

import { useEffect, useRef, useState } from "react";

import {
  getCart,
  removeCartItem as removeCartItemRequest,
  upsertCartItem,
} from "@/features/pharmacy/lib/pharmacy.api";
import type { Cart, Medicine } from "@/features/pharmacy/lib/pharmacy.types";
import { isGuestSessionNotFound } from "@/features/pharmacy/lib/pharmacy.utils";

const EMPTY_CART_SUBTOTAL = "0.00";

interface UseCartResult {
  cart: Cart | null;
  isLoading: boolean;
  isUpdating: boolean;
  errorMessage: string | null;
  addItem: (medicineId: string, quantity: number) => Promise<boolean>;
  updateQuantity: (medicineId: string, quantity: number) => Promise<boolean>;
  removeItem: (medicineId: string) => Promise<boolean>;
  clearLocal: () => void;
}

export function useCart(
  sessionId: string | null,
  isSessionReady: boolean,
  medicines: Medicine[],
  refreshGuestSession?: () => Promise<string | null>,
): UseCartResult {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const latestCartRef = useRef<Cart | null>(null);
  const refreshGuestSessionRef = useRef(refreshGuestSession);

  useEffect(() => {
    refreshGuestSessionRef.current = refreshGuestSession;
  }, [refreshGuestSession]);

  useEffect(() => {
    latestCartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    if (!isSessionReady || !sessionId) {
      return;
    }

    const currentSessionId = sessionId;
    let isMounted = true;

    async function hydrateCart() {
      setIsLoading(true);

      try {
        const nextCart = await getCart(currentSessionId);
        if (!isMounted) {
          return;
        }

        setCart(nextCart);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const recoveredSessionId = await recoverGuestSession(error);
        if (recoveredSessionId && recoveredSessionId !== currentSessionId) {
          return;
        }

        setCart(createEmptyCart(currentSessionId));
        setErrorMessage(getErrorMessage(error, "We could not load your cart."));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void hydrateCart();

    return () => {
      isMounted = false;
    };
  }, [isSessionReady, sessionId]);

  async function addItem(medicineId: string, quantity: number) {
    return mutateCart(medicineId, clampQuantity(quantity), "upsert");
  }

  async function updateQuantity(medicineId: string, quantity: number) {
    const nextQuantity = clampQuantity(quantity);

    if (quantity === 0) {
      return removeItem(medicineId);
    }

    return mutateCart(medicineId, nextQuantity, "upsert");
  }

  async function removeItem(medicineId: string) {
    return mutateCart(medicineId, 0, "remove");
  }

  async function mutateCart(
    medicineId: string,
    quantity: number,
    action: "upsert" | "remove",
  ): Promise<boolean> {
    if (!sessionId) {
      setErrorMessage("Your guest session is not ready yet.");
      return false;
    }

    const previousCart = latestCartRef.current ?? createEmptyCart(sessionId);
    const optimisticCart =
      action === "remove"
        ? removeItemFromCart(previousCart, medicineId)
        : setItemQuantity(previousCart, medicines, medicineId, quantity);

    setCart(optimisticCart);
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      const nextCart = await runCartMutation(sessionId, medicineId, quantity, action);
      setCart(nextCart);
      return true;
    } catch (error) {
      const recoveredSessionId = await recoverGuestSession(error);

      if (recoveredSessionId) {
        try {
          const nextCart = await runCartMutation(
            recoveredSessionId,
            medicineId,
            quantity,
            action,
          );
          setCart(nextCart);
          return true;
        } catch (retryError) {
          setCart(previousCart);
          setErrorMessage(getErrorMessage(retryError, "We could not update your cart."));
          return false;
        }
      }

      setCart(previousCart);
      setErrorMessage(getErrorMessage(error, "We could not update your cart."));
      return false;
    } finally {
      setIsUpdating(false);
    }
  }

  async function recoverGuestSession(error: unknown): Promise<string | null> {
    if (!isGuestSessionNotFound(error) || !refreshGuestSessionRef.current) {
      return null;
    }

    return refreshGuestSessionRef.current();
  }

  function clearLocal() {
    if (!sessionId) {
      setCart(null);
      return;
    }

    setCart(createEmptyCart(sessionId));
  }

  return {
    cart,
    isLoading,
    isUpdating,
    errorMessage,
    addItem,
    updateQuantity,
    removeItem,
    clearLocal,
  };
}

async function runCartMutation(
  guestSessionId: string,
  medicineId: string,
  quantity: number,
  action: "upsert" | "remove",
) {
  return action === "remove"
    ? removeCartItemRequest(guestSessionId, medicineId)
    : upsertCartItem(guestSessionId, medicineId, quantity);
}

function clampQuantity(value: number) {
  return Math.min(20, Math.max(1, value));
}

function createEmptyCart(sessionId: string): Cart {
  return {
    guestSessionId: sessionId,
    items: [],
    totalItems: 0,
    subtotal: EMPTY_CART_SUBTOTAL,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

function removeItemFromCart(cart: Cart, medicineId: string): Cart {
  const items = cart.items.filter((item) => item.medicineId !== medicineId);
  return recalculateCart(cart, items);
}

function setItemQuantity(
  cart: Cart,
  medicines: Medicine[],
  medicineId: string,
  quantity: number,
): Cart {
  const existingItem = cart.items.find((item) => item.medicineId === medicineId);

  if (!existingItem) {
    const medicine = medicines.find((item) => item.id === medicineId);

    if (!medicine) {
      return cart;
    }

    return recalculateCart(cart, [
      ...cart.items,
      {
        medicineId: medicine.id,
        medicineName: medicine.name,
        genericName: medicine.genericName,
        quantity,
        unitPrice: medicine.price,
        totalPrice: multiplyPrice(medicine.price, quantity),
        requiresPrescription: medicine.requiresPrescription,
      },
    ]);
  }

  const items = cart.items.map((item) =>
    item.medicineId === medicineId
      ? {
          ...item,
          quantity,
          totalPrice: multiplyPrice(item.unitPrice, quantity),
        }
      : item,
  );

  return recalculateCart(cart, items);
}

function recalculateCart(cart: Cart, items: Cart["items"]): Cart {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => addPrice(sum, item.totalPrice), "0.00");

  return {
    ...cart,
    items,
    totalItems,
    subtotal,
  };
}

function addPrice(left: string, right: string): string {
  const [leftWhole, leftDecimal] = normalizePrice(left);
  const [rightWhole, rightDecimal] = normalizePrice(right);
  const decimalSum = leftDecimal + rightDecimal;
  const carry = Math.floor(decimalSum / 100);
  const wholeSum = leftWhole + rightWhole + carry;
  const decimalRemainder = String(decimalSum % 100).padStart(2, "0");
  return `${wholeSum}.${decimalRemainder}`;
}

function multiplyPrice(price: string, quantity: number): string {
  let total = "0.00";
  for (let index = 0; index < quantity; index += 1) {
    total = addPrice(total, price);
  }

  return total;
}

function normalizePrice(price: string): [number, number] {
  const [whole = "0", decimals = "00"] = price.split(".");
  return [Number(whole), Number(`${decimals}00`.slice(0, 2))];
}

function getErrorMessage(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
    ? (error as { message: string }).message
    : fallback;
}
