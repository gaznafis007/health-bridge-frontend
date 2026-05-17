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
