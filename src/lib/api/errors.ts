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
