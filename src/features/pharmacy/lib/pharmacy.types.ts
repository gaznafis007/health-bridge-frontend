export interface GuestSession {
  sessionId: string;
  expiresAt: string;
}

export interface MedicineCategory {
  id: string;
  name: string;
  description: string | null;
  medicineCount: number;
}

export interface Medicine {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  genericName: string | null;
  manufacturer: string | null;
  price: string;
  stockQuantity: number;
  requiresPrescription: boolean;
  status: "ACTIVE" | "DISCONTINUED" | "OUT_OF_STOCK";
}

export interface CartItem {
  medicineId: string;
  medicineName: string;
  genericName: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  requiresPrescription: boolean;
}

export interface Cart {
  guestSessionId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: string;
  expiresAt: string;
}

export interface CheckoutPayload {
  guestSessionId: string;
  paymentMethod: "ONLINE" | "CASH";
  deliveryAddress: string;
  deliveryPhone: string;
  idempotencyKey: string;
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface Order {
  id: string;
  userId: string | null;
  guestSessionId: string | null;
  totalAmount: string;
  discountAmount: string;
  taxAmount: string;
  finalAmount: string;
  paymentMethod: "ONLINE" | "CASH";
  paymentStatus: "PENDING" | "PENDING_CASH" | "PAID" | "FAILED";
  deliveryStatus:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
  deliveryAddress: string;
  deliveryPhone: string;
  items: OrderItem[];
  createdAt: string;
}

export interface MedicineQuery {
  categoryId?: string;
  search?: string;
  requiresPrescription?: boolean;
  inStockOnly?: boolean;
}

export interface ApiError {
  message: string;
  errors?: { path: string; message: string }[];
  status?: number;
}
