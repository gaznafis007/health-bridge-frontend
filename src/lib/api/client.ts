import { API_BASE_URL } from "@/lib/api/config";
import type { ApiError } from "@/lib/api/types";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string;
};

const JSON_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { accessToken, body, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const method = fetchOptions.method?.toUpperCase() ?? "GET";
  const headers = new Headers(fetchOptions.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  const requestBody: BodyInit | null | undefined =
    body && typeof body === "object" && !(body instanceof FormData)
      ? JSON.stringify(body)
      : (body as BodyInit | null | undefined);

  if (
    JSON_METHODS.has(method) &&
    !(requestBody instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
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
    const payload = (await response.json()) as Partial<ApiError> & {
      message?: string | string[];
    };
    const message = normalizeErrorMessage(payload.message, fallback.message);
    return {
      message,
      errors: payload.errors,
      status: response.status,
    };
  } catch {
    return fallback;
  }
}

function normalizeErrorMessage(
  message: string | string[] | undefined,
  fallback: string,
): string {
  if (Array.isArray(message)) {
    return message.join(" ");
  }

  if (typeof message === "string" && message.length > 0) {
    return message;
  }

  return fallback;
}

function isApiError(error: unknown): error is ApiError {
  return Boolean(
    error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string",
  );
}
