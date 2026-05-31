import { apiRequest } from "@/lib/api/client";
import type {
  Medicine,
  MedicineCategory,
  Order,
} from "@/features/pharmacy/lib/pharmacy.types";

const PREFIX = "/e-commerce";

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

export interface PaginatedOrders {
  items: Order[];
  total: number;
  skip: number;
  take: number;
}

export function listAdminOrders(
  accessToken: string,
  params: { skip?: number; take?: number } = {},
): Promise<PaginatedOrders> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set("skip", String(params.skip));
  if (params.take !== undefined) searchParams.set("take", String(params.take));
  const qs = searchParams.size > 0 ? `?${searchParams}` : "";
  return apiRequest<PaginatedOrders>(`${PREFIX}/orders${qs}`, {
    accessToken,
    cache: "no-store",
  });
}

export function getAdminOrder(
  accessToken: string,
  orderId: string,
): Promise<Order> {
  return apiRequest<Order>(`${PREFIX}/orders/${orderId}`, {
    accessToken,
    cache: "no-store",
  });
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
