import { API_BASE_URL } from "@/lib/api/config";
import type { ApiError } from "@/features/pharmacy/lib/pharmacy.types";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const JSON_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const method = options.method?.toUpperCase() ?? "GET";
  const headers = new Headers(options.headers);
  const requestBody: BodyInit | null | undefined =
    options.body && typeof options.body === "object" && !(options.body instanceof FormData)
      ? JSON.stringify(options.body)
      : (options.body as BodyInit | null | undefined);

  if (
    JSON_METHODS.has(method) &&
    !(requestBody instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...options,
      method,
      headers,
      body: requestBody,
    });

    if (!response.ok) {
      throw await buildApiError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    const networkError: ApiError = {
      message: "Network error. Please try again.",
    };

    throw networkError;
  }
}

async function buildApiError(response: Response): Promise<ApiError> {
  const fallback: ApiError = {
    message: "Something went wrong. Please try again.",
    status: response.status,
  };

  try {
    const payload = (await response.json()) as Partial<ApiError>;
    return {
      message: payload.message ?? fallback.message,
      errors: payload.errors,
      status: response.status,
    };
  } catch {
    return fallback;
  }
}

function isApiError(error: unknown): error is ApiError {
  return Boolean(
    error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string",
  );
}
