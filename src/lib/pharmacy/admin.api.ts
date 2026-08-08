import { apiRequest } from "@/lib/api/client";
import type {
  Medicine,
  MedicineCategory,
  Order,
} from "@/features/pharmacy/lib/pharmacy.types";

const PREFIX = "/e-commerce";

export interface AdminOrder extends Order {
  customerEmail: string | null;
}

export interface AdminOrdersQuery {
  skip?: number;
  take?: number;
  email?: string;
  phone?: string;
}

export interface PaginatedAdminOrders {
  items: AdminOrder[];
  total: number;
  skip: number;
  take: number;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

export interface CreateMedicinePayload {
  categoryId: string;
  name: string;
  genericName?: string;
  manufacturer?: string;
  price: number;
  stockQuantity: number;
  requiresPrescription?: boolean;
}

export interface UpdateMedicinePayload {
  price?: number;
  stockQuantity?: number;
  status?: "ACTIVE" | "INACTIVE" | "DISCONTINUED";
}

export interface UpdateDeliveryStatusPayload {
  deliveryStatus: Order["deliveryStatus"];
}

export const DEFAULT_ADMIN_ORDERS_PAGE_SIZE = 20;

export function listAdminOrders(
  accessToken: string,
  params: AdminOrdersQuery = {},
): Promise<PaginatedAdminOrders> {
  const searchParams = new URLSearchParams({
    skip: String(params.skip ?? 0),
    take: String(params.take ?? DEFAULT_ADMIN_ORDERS_PAGE_SIZE),
  });

  const email = params.email?.trim();
  const phone = params.phone?.trim();

  if (email && email.length >= 3) {
    searchParams.set("email", email);
  }

  if (phone && phone.length >= 3) {
    searchParams.set("phone", phone);
  }

  return apiRequest<PaginatedAdminOrders>(
    `${PREFIX}/admin/orders?${searchParams.toString()}`,
    {
      accessToken,
      cache: "no-store",
    },
  );
}

export function createCategory(
  accessToken: string,
  payload: CreateCategoryPayload,
): Promise<MedicineCategory> {
  return apiRequest<MedicineCategory>(`${PREFIX}/categories`, {
    method: "POST",
    accessToken,
    body: payload,
  });
}

export function updateCategory(
  accessToken: string,
  categoryId: string,
  payload: UpdateCategoryPayload,
): Promise<MedicineCategory> {
  return apiRequest<MedicineCategory>(`${PREFIX}/categories/${categoryId}`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });
}

export function createMedicine(
  accessToken: string,
  payload: CreateMedicinePayload,
): Promise<Medicine> {
  return apiRequest<Medicine>(`${PREFIX}/medicines`, {
    method: "POST",
    accessToken,
    body: payload,
  });
}

export function updateMedicine(
  accessToken: string,
  medicineId: string,
  payload: UpdateMedicinePayload,
): Promise<Medicine> {
  return apiRequest<Medicine>(`${PREFIX}/medicines/${medicineId}`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });
}

export function updateOrderDeliveryStatus(
  accessToken: string,
  orderId: string,
  payload: UpdateDeliveryStatusPayload,
): Promise<Order> {
  return apiRequest<Order>(`${PREFIX}/orders/${orderId}/delivery-status`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });
}
