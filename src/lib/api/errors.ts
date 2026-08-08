export interface ApiErrorShape {
  message: string;
  status?: number;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallback;
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }

  return undefined;
}

export function getApiErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  ) {
    return (error as { code: string }).code;
  }

  return undefined;
}

const ambulanceBookingErrorMessages: Record<string, string> = {
  PICKUP_ADDRESS_NOT_FOUND:
    "Pick a suggested pickup address or refine what you typed.",
  DESTINATION_ADDRESS_NOT_FOUND:
    "Pick a suggested destination or select a hospital.",
  DESTINATION_CENTER_NOT_FOUND: "Re-select the destination hospital.",
  INVALID_COORDINATES: "That location is outside our service area.",
};

export function mapAmbulanceBookingError(
  error: unknown,
  fallback: string,
): string {
  const code = getApiErrorCode(error);

  if (code && ambulanceBookingErrorMessages[code]) {
    return ambulanceBookingErrorMessages[code];
  }

  return mapApiErrorMessage(error, fallback);
}

export function mapApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, fallback);

  if (status === 409) {
    return "This slot was just booked — please pick another.";
  }

  if (status === 429) {
    return "Too many requests, please wait a moment.";
  }

  return message;
}
