import { apiRequest } from "@/lib/api/client";
import type {
  AmbulanceBooking,
  AmbulanceBookingsPaginated,
  AmbulanceHealthCenter,
  AmbulanceLiveLocation,
  CreateAmbulanceBookingPayload,
} from "@/lib/ambulance/ambulance.types";

const AMBULANCE_PREFIX = "/ambulance";

export function getAmbulanceHealthCenters(
  accessToken: string,
): Promise<AmbulanceHealthCenter[]> {
  return apiRequest<AmbulanceHealthCenter[]>(
    `${AMBULANCE_PREFIX}/health-centers`,
    { accessToken, cache: "no-store" },
  );
}

export function createAmbulanceBooking(
  accessToken: string,
  payload: CreateAmbulanceBookingPayload,
  idempotencyKey: string,
): Promise<AmbulanceBooking> {
  return apiRequest<AmbulanceBooking>(`${AMBULANCE_PREFIX}/bookings`, {
    method: "POST",
    accessToken,
    body: payload,
    headers: { "Idempotency-Key": idempotencyKey },
  });
}

export function getMyAmbulanceBookings(
  accessToken: string,
  skip = 0,
  take = 10,
): Promise<AmbulanceBookingsPaginated> {
  const params = new URLSearchParams({
    skip: String(skip),
    take: String(take),
  });

  return apiRequest<AmbulanceBookingsPaginated>(
    `${AMBULANCE_PREFIX}/bookings/me?${params}`,
    { accessToken, cache: "no-store" },
  );
}

export function getAmbulanceBooking(
  accessToken: string,
  bookingId: string,
): Promise<AmbulanceBooking> {
  return apiRequest<AmbulanceBooking>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}`,
    { accessToken, cache: "no-store" },
  );
}

export function cancelAmbulanceBooking(
  accessToken: string,
  bookingId: string,
): Promise<AmbulanceBooking> {
  return apiRequest<AmbulanceBooking>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}/cancel`,
    { method: "PATCH", accessToken },
  );
}

export function getAmbulanceLiveLocation(
  accessToken: string,
  bookingId: string,
): Promise<AmbulanceLiveLocation> {
  return apiRequest<AmbulanceLiveLocation>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}/location`,
    { accessToken, cache: "no-store" },
  );
}
