import { apiRequest } from "@/lib/api/client";
import type {
  CreateLabBookingPayload,
  LabBooking,
  LabBookingsPage,
  LabCenter,
  LabPackage,
  LabReport,
  LabTest,
  PublicReportResponse,
} from "@/lib/labs/labs.types";

const LAB_PREFIX = "/lab";

export function getCenters(accessToken: string): Promise<LabCenter[]> {
  return apiRequest<LabCenter[]>(`${LAB_PREFIX}/centers`, {
    accessToken,
    cache: "no-store",
  });
}

export function getCenterTests(
  accessToken: string,
  centerId: string,
): Promise<LabTest[]> {
  return apiRequest<LabTest[]>(`${LAB_PREFIX}/centers/${centerId}/tests`, {
    accessToken,
    cache: "no-store",
  });
}

export function getCenterPackages(
  accessToken: string,
  centerId: string,
): Promise<LabPackage[]> {
  return apiRequest<LabPackage[]>(
    `${LAB_PREFIX}/centers/${centerId}/packages`,
    {
      accessToken,
      cache: "no-store",
    },
  );
}

export function searchTests(
  accessToken: string,
  query: string,
): Promise<LabTest[]> {
  const params = new URLSearchParams({ q: query });
  return apiRequest<LabTest[]>(`${LAB_PREFIX}/tests/search?${params}`, {
    accessToken,
    cache: "no-store",
  });
}

export function createBooking(
  accessToken: string,
  payload: CreateLabBookingPayload,
  idempotencyKey: string,
): Promise<LabBooking> {
  return apiRequest<LabBooking>(`${LAB_PREFIX}/bookings`, {
    method: "POST",
    accessToken,
    body: payload,
    headers: { "Idempotency-Key": idempotencyKey },
  });
}

export function getMyBookings(
  accessToken: string,
  skip = 0,
  take = 20,
): Promise<LabBookingsPage> {
  const params = new URLSearchParams({
    skip: String(skip),
    take: String(take),
  });
  return apiRequest<LabBookingsPage>(
    `${LAB_PREFIX}/bookings/me?${params}`,
    {
      accessToken,
      cache: "no-store",
    },
  );
}

export function getBooking(
  accessToken: string,
  bookingId: string,
): Promise<LabBooking> {
  return apiRequest<LabBooking>(`${LAB_PREFIX}/bookings/${bookingId}`, {
    accessToken,
    cache: "no-store",
  });
}

export function cancelBooking(
  accessToken: string,
  bookingId: string,
): Promise<LabBooking> {
  return apiRequest<LabBooking>(`${LAB_PREFIX}/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    accessToken,
  });
}

export function getMyReports(accessToken: string): Promise<LabReport[]> {
  return apiRequest<LabReport[]>(`${LAB_PREFIX}/reports/me`, {
    accessToken,
    cache: "no-store",
  });
}

export function getBookingReports(
  accessToken: string,
  bookingId: string,
): Promise<LabReport[]> {
  return apiRequest<LabReport[]>(
    `${LAB_PREFIX}/bookings/${bookingId}/reports`,
    {
      accessToken,
      cache: "no-store",
    },
  );
}

export function getPublicReport(
  reportToken: string,
): Promise<PublicReportResponse> {
  return apiRequest<PublicReportResponse>(
    `${LAB_PREFIX}/reports/token/${reportToken}`,
    { cache: "no-store" },
  );
}

export interface CreateLabCenterPayload {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

export function createLabCenter(
  accessToken: string,
  payload: CreateLabCenterPayload,
): Promise<LabCenter> {
  return apiRequest<LabCenter>(`${LAB_PREFIX}/centers`, {
    method: "POST",
    accessToken,
    body: payload,
  });
}

export function listAllBookings(
  accessToken: string,
  skip = 0,
  take = 20,
): Promise<LabBookingsPage> {
  const params = new URLSearchParams({
    skip: String(skip),
    take: String(take),
  });
  return apiRequest<LabBookingsPage>(`${LAB_PREFIX}/bookings?${params}`, {
    accessToken,
    cache: "no-store",
  });
}

export function confirmBookingPayment(
  accessToken: string,
  bookingId: string,
): Promise<LabBooking> {
  return apiRequest<LabBooking>(
    `${LAB_PREFIX}/bookings/${bookingId}/payment/confirm`,
    { method: "PATCH", accessToken },
  );
}

export function collectSample(
  accessToken: string,
  bookingId: string,
): Promise<LabBooking> {
  return apiRequest<LabBooking>(
    `${LAB_PREFIX}/bookings/${bookingId}/sample/collect`,
    { method: "PATCH", accessToken },
  );
}

export function processSample(
  accessToken: string,
  bookingId: string,
): Promise<LabBooking> {
  return apiRequest<LabBooking>(
    `${LAB_PREFIX}/bookings/${bookingId}/sample/process`,
    { method: "PATCH", accessToken },
  );
}

export function completeSample(
  accessToken: string,
  bookingId: string,
): Promise<LabBooking> {
  return apiRequest<LabBooking>(
    `${LAB_PREFIX}/bookings/${bookingId}/sample/complete`,
    { method: "PATCH", accessToken },
  );
}

export function uploadBookingReport(
  accessToken: string,
  bookingId: string,
  file: File,
  testId?: string,
): Promise<LabReport> {
  const formData = new FormData();
  formData.append("file", file);
  if (testId) formData.append("testId", testId);

  return apiRequest<LabReport>(`${LAB_PREFIX}/bookings/${bookingId}/reports`, {
    method: "POST",
    accessToken,
    body: formData,
  });
}

export function listAdminReports(accessToken: string): Promise<LabReport[]> {
  return apiRequest<LabReport[]>(`${LAB_PREFIX}/reports`, {
    accessToken,
    cache: "no-store",
  });
}

export function deliverReport(
  accessToken: string,
  reportId: string,
): Promise<LabReport> {
  return apiRequest<LabReport>(`${LAB_PREFIX}/reports/${reportId}/deliver`, {
    method: "PATCH",
    accessToken,
  });
}
