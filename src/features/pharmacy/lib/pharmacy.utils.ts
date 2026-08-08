import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api/errors";

const TAKA_SYMBOL = "\u09F3";

export function generateIdempotencyKey(): string {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `checkout-${Date.now()}-${randomPart}`;
}

export function formatPrice(price: string): string {
  const normalized = price.trim();
  const [whole = "0", decimals = "00"] = normalized.split(".");
  const safeDecimals = `${decimals}00`.slice(0, 2);
  return `${TAKA_SYMBOL}${whole}.${safeDecimals}`;
}

export function isSessionExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value.trim());
}

export function isGuestSessionNotFound(error: unknown): boolean {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, "").toLowerCase();

  return (
    status === 404 &&
    (message.includes("guest session") || message.includes("session not found"))
  );
}
