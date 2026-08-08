export const PHARMACY_DELIVERY_PHONE_KEY = "hb_pharmacy_delivery_phone";

export const PHARMACY_TRACKING_UPDATED_EVENT = "hb-pharmacy-tracking-updated";

export function saveDeliveryPhoneForTracking(phone: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PHARMACY_DELIVERY_PHONE_KEY, phone.trim());
  window.dispatchEvent(new Event(PHARMACY_TRACKING_UPDATED_EVENT));
}

export function readDeliveryPhoneForTracking(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const phone = window.localStorage.getItem(PHARMACY_DELIVERY_PHONE_KEY)?.trim();
  return phone || null;
}
