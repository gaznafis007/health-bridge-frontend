import type { LatLng } from "@/lib/ambulance/ambulance.types";

const EARTH_RADIUS_KM = 6371;
const BASE_FARE_BDT = 200;
const FARE_PER_KM_BDT = 20;

export function estimateAmbulanceFareKm(pickup: LatLng, destination: LatLng): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const latDelta = toRadians(destination.lat - pickup.lat);
  const lngDelta = toRadians(destination.lng - pickup.lng);

  const pickupLat = toRadians(pickup.lat);
  const destinationLat = toRadians(destination.lat);

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(pickupLat) * Math.cos(destinationLat) * Math.sin(lngDelta / 2) ** 2;

  const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return EARTH_RADIUS_KM * centralAngle;
}

export function estimateAmbulanceFare(pickup: LatLng, destination: LatLng): number {
  const distanceKm = estimateAmbulanceFareKm(pickup, destination);
  return BASE_FARE_BDT + FARE_PER_KM_BDT * distanceKm;
}

export function generateAmbulanceIdempotencyKey(): string {
  return crypto.randomUUID();
}

export function formatEstimatedDistance(value: string | number): string {
  const distance = typeof value === "number" ? value : Number.parseFloat(value);

  if (!Number.isFinite(distance)) {
    return "";
  }

  return `${distance.toFixed(1)} km`;
}
