export type BookingStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type SampleStatus =
  | "PENDING"
  | "COLLECTED"
  | "PROCESSING"
  | "COMPLETED"
  | "DELIVERED";

export type TestPaymentStatus = "PENDING" | "PAID" | "FAILED";

export type ReportStatus = "PENDING" | "READY" | "DELIVERED" | "ARCHIVED";

export type LabPaymentMethod = "CASH" | "ONLINE";

export interface LabCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

export interface LabTest {
  id: string;
  name: string;
  description: string | null;
  price: string;
  duration: string | null;
  isActive: boolean;
}

export interface LabPackage {
  id: string;
  name: string;
  description: string | null;
  price: string;
  tests: LabTest[];
  isActive: boolean;
}

export interface LabBookingItemInput {
  testId?: string;
  packageId?: string;
}

export interface CreateLabBookingPayload {
  diagnosticCenterId: string;
  items: LabBookingItemInput[];
  sampleCollectionDate: string;
  sampleCollectionTime: string;
  paymentMethod: LabPaymentMethod;
  notes?: string;
}

export interface LabBookingLineItem {
  id: string;
  test?: LabTest;
  package?: LabPackage;
  price: string;
}

export interface LabBooking {
  id: string;
  patientId: string;
  diagnosticCenterId: string;
  bookingStatus: BookingStatus;
  sampleStatus: SampleStatus;
  paymentMethod: LabPaymentMethod;
  paymentStatus: TestPaymentStatus;
  totalAmount: string;
  notes: string | null;
  sampleCollectionDate: string;
  sampleCollectionTime: string;
  createdAt: string;
  items: LabBookingLineItem[];
  center?: LabCenter;
}

export interface LabReport {
  id: string;
  bookingId: string;
  reportToken: string;
  reportUrl: string;
  reportFileName: string;
  status: ReportStatus;
  createdAt: string;
}

export interface LabBookingsPage {
  total: number;
  data: LabBooking[];
}

export interface PublicReportResponse {
  reportUrl: string;
  reportFileName: string;
}

export interface LabBookingFormValues {
  sampleCollectionDate: string;
  sampleCollectionTime: string;
  paymentMethod: LabPaymentMethod;
  notes: string;
}
