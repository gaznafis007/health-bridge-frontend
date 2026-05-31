import { apiRequest } from "@/lib/api/client";
import type {
  Cart,
  CheckoutPayload,
  GuestSession,
  Medicine,
  MedicineCategory,
  MedicineQuery,
  Order,
} from "@/features/pharmacy/lib/pharmacy.types";

const PHARMACY_PREFIX = "/e-commerce";

export function createGuestSession(): Promise<GuestSession> {
  return apiRequest<GuestSession>(`${PHARMACY_PREFIX}/guest-sessions`, {
    method: "POST",
    body: {},
  });
}

export function listCategories(): Promise<MedicineCategory[]> {
  return apiRequest<MedicineCategory[]>(`${PHARMACY_PREFIX}/categories`, {
    cache: "no-store",
  });
}

export function listMedicines(query: MedicineQuery = {}): Promise<Medicine[]> {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const suffix = searchParams.size > 0 ? `?${searchParams.toString()}` : "";

  return apiRequest<Medicine[]>(`${PHARMACY_PREFIX}/medicines${suffix}`, {
    cache: "no-store",
  });
}

export function getCart(guestSessionId: string): Promise<Cart> {
  return apiRequest<Cart>(`${PHARMACY_PREFIX}/cart/${guestSessionId}`, {
    cache: "no-store",
  });
}

export function upsertCartItem(
  guestSessionId: string,
  medicineId: string,
  quantity: number,
): Promise<Cart> {
  return apiRequest<Cart>(`${PHARMACY_PREFIX}/cart/items`, {
    method: "PUT",
    body: {
      guestSessionId,
      medicineId,
      quantity,
    },
  });
}

export function removeCartItem(
  guestSessionId: string,
  medicineId: string,
): Promise<Cart> {
  return apiRequest<Cart>(`${PHARMACY_PREFIX}/cart/items/${guestSessionId}/${medicineId}`, {
    method: "DELETE",
  });
}

export function checkout(
  payload: CheckoutPayload,
  accessToken?: string,
): Promise<Order> {
  return apiRequest<Order>(`${PHARMACY_PREFIX}/checkout`, {
    method: "POST",
    body: payload,
    accessToken,
  });
}

export interface OrdersPage {
  items: Order[];
  total: number;
  skip: number;
  take: number;
}

export function getMyOrders(
  accessToken: string,
  skip = 0,
  take = 20,
): Promise<OrdersPage> {
  const params = new URLSearchParams({
    skip: String(skip),
    take: String(take),
  });
  return apiRequest<OrdersPage>(`${PHARMACY_PREFIX}/orders/me?${params}`, {
    accessToken,
    cache: "no-store",
  });
}

export function getOrder(orderId: string, guestSessionId?: string): Promise<Order> {
  const searchParams = guestSessionId
    ? new URLSearchParams({ guestSessionId })
    : null;
  const suffix = searchParams ? `?${searchParams}` : "";
  return apiRequest<Order>(`${PHARMACY_PREFIX}/orders/${orderId}${suffix}`, {
    cache: "no-store",
  });
}

export function getPatientOrder(
  accessToken: string,
  orderId: string,
): Promise<Order> {
  return apiRequest<Order>(`${PHARMACY_PREFIX}/orders/${orderId}`, {
    accessToken,
    cache: "no-store",
  });
}
