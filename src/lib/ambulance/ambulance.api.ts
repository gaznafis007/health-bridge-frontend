import { apiRequest } from "@/lib/api/client";
import type {
  AmbulanceBooking,
  AmbulanceBookingsPaginated,
  AmbulanceDriver,
  AmbulanceFleetVehicle,
  AmbulanceHealthCenter,
  AmbulanceLiveLocation,
  AmbulanceShift,
  LocationTrail,
  CreateAmbulanceBookingPayload,
  CancelAmbulanceBookingPayload,
  CreateDriverPayload,
  CreateFleetPayload,
  CreateHealthCenterPayload,
  CreateShiftPayload,
  DispatchBookingPayload,
  PushLocationPayload,
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
  payload?: CancelAmbulanceBookingPayload,
): Promise<AmbulanceBooking> {
  return apiRequest<AmbulanceBooking>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}/cancel`,
    { method: "PATCH", accessToken, body: payload },
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

export function getAmbulanceLocationTrail(
  accessToken: string,
  bookingId: string,
): Promise<LocationTrail> {
  return apiRequest<LocationTrail>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}/location/trail`,
    { accessToken, cache: "no-store" },
  );
}

export function createHealthCenter(
  accessToken: string,
  payload: CreateHealthCenterPayload,
): Promise<AmbulanceHealthCenter> {
  return apiRequest<AmbulanceHealthCenter>(
    `${AMBULANCE_PREFIX}/health-centers`,
    { method: "POST", accessToken, body: payload },
  );
}

export function listFleet(
  accessToken: string,
  params: {
    healthCenterId?: string;
    status?: string;
    onlyWithActiveShift?: boolean;
  } = {},
): Promise<AmbulanceFleetVehicle[]> {
  const searchParams = new URLSearchParams();
  if (params.healthCenterId) searchParams.set("healthCenterId", params.healthCenterId);
  if (params.status) searchParams.set("status", params.status);
  if (params.onlyWithActiveShift !== undefined) {
    searchParams.set("onlyWithActiveShift", String(params.onlyWithActiveShift));
  }
  const qs = searchParams.size > 0 ? `?${searchParams}` : "";
  return apiRequest<AmbulanceFleetVehicle[]>(
    `${AMBULANCE_PREFIX}/fleet${qs}`,
    { accessToken, cache: "no-store" },
  );
}

export function createFleetVehicle(
  accessToken: string,
  payload: CreateFleetPayload,
): Promise<AmbulanceFleetVehicle> {
  return apiRequest<AmbulanceFleetVehicle>(`${AMBULANCE_PREFIX}/fleet`, {
    method: "POST",
    accessToken,
    body: payload,
  });
}

export function updateFleetStatus(
  accessToken: string,
  ambulanceId: string,
  status: AmbulanceFleetVehicle["status"],
): Promise<AmbulanceFleetVehicle> {
  return apiRequest<AmbulanceFleetVehicle>(
    `${AMBULANCE_PREFIX}/fleet/${ambulanceId}/status`,
    { method: "PATCH", accessToken, body: { status } },
  );
}

export function listDrivers(accessToken: string): Promise<AmbulanceDriver[]> {
  return apiRequest<AmbulanceDriver[]>(`${AMBULANCE_PREFIX}/drivers`, {
    accessToken,
    cache: "no-store",
  });
}

export function createDriver(
  accessToken: string,
  payload: CreateDriverPayload,
): Promise<AmbulanceDriver> {
  return apiRequest<AmbulanceDriver>(`${AMBULANCE_PREFIX}/drivers`, {
    method: "POST",
    accessToken,
    body: payload,
  });
}

export function updateDriverStatus(
  accessToken: string,
  driverId: string,
  status: AmbulanceDriver["status"],
): Promise<AmbulanceDriver> {
  return apiRequest<AmbulanceDriver>(
    `${AMBULANCE_PREFIX}/drivers/${driverId}/status`,
    { method: "PATCH", accessToken, body: { status } },
  );
}

export function verifyDriver(
  accessToken: string,
  driverId: string,
): Promise<AmbulanceDriver> {
  return apiRequest<AmbulanceDriver>(
    `${AMBULANCE_PREFIX}/drivers/${driverId}/verify`,
    { method: "PATCH", accessToken },
  );
}

export function createShift(
  accessToken: string,
  payload: CreateShiftPayload,
): Promise<AmbulanceShift> {
  return apiRequest<AmbulanceShift>(`${AMBULANCE_PREFIX}/shifts`, {
    method: "POST",
    accessToken,
    body: payload,
  });
}

export function endShift(
  accessToken: string,
  shiftId: string,
): Promise<AmbulanceShift> {
  return apiRequest<AmbulanceShift>(
    `${AMBULANCE_PREFIX}/shifts/${shiftId}/end`,
    { method: "PATCH", accessToken },
  );
}

export function getActiveBookings(
  accessToken: string,
): Promise<AmbulanceBooking[]> {
  return apiRequest<AmbulanceBooking[]>(
    `${AMBULANCE_PREFIX}/bookings/active`,
    { accessToken, cache: "no-store" },
  );
}

export function dispatchBooking(
  accessToken: string,
  bookingId: string,
  payload: DispatchBookingPayload,
): Promise<AmbulanceBooking> {
  return apiRequest<AmbulanceBooking>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}/dispatch`,
    { method: "PATCH", accessToken, body: payload },
  );
}

export function driverArrive(
  accessToken: string,
  bookingId: string,
): Promise<AmbulanceBooking> {
  return apiRequest<AmbulanceBooking>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}/arrive`,
    { method: "PATCH", accessToken },
  );
}

export function driverStartTrip(
  accessToken: string,
  bookingId: string,
): Promise<AmbulanceBooking> {
  return apiRequest<AmbulanceBooking>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}/start`,
    { method: "PATCH", accessToken },
  );
}

export function driverCompleteTrip(
  accessToken: string,
  bookingId: string,
): Promise<AmbulanceBooking> {
  return apiRequest<AmbulanceBooking>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}/complete`,
    { method: "PATCH", accessToken },
  );
}

export function pushDriverLocation(
  accessToken: string,
  bookingId: string,
  payload: PushLocationPayload,
): Promise<{ recorded: boolean }> {
  return apiRequest<{ recorded: boolean }>(
    `${AMBULANCE_PREFIX}/bookings/${bookingId}/location`,
    { method: "POST", accessToken, body: payload },
  );
}
