import { apiRequest } from "@/lib/api/client";
import type {
  GeocodingResult,
  GeocodingReverseResponse,
  GeocodingSearchResponse,
} from "@/lib/geocoding/geocoding.types";

const GEOCODING_PREFIX = "/geocoding";

export function searchAddresses(
  accessToken: string,
  query: string,
  limit = 5,
): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  });

  return apiRequest<GeocodingSearchResponse>(
    `${GEOCODING_PREFIX}/search?${params}`,
    { accessToken, cache: "no-store" },
  ).then((payload) => payload.results);
}

export function reverseGeocodeCoordinates(
  accessToken: string,
  lat: number,
  lng: number,
): Promise<GeocodingResult | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
  });

  return apiRequest<GeocodingReverseResponse>(
    `${GEOCODING_PREFIX}/reverse?${params}`,
    { accessToken, cache: "no-store" },
  ).then((payload) => payload.result);
}

export async function geocodeAddress(
  accessToken: string,
  address: string,
): Promise<GeocodingResult | null> {
  const trimmed = address.trim();

  if (trimmed.length < 3) {
    return null;
  }

  const results = await searchAddresses(accessToken, trimmed, 1);
  return results[0] ?? null;
}
