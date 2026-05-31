"use server";

import { getMe, logout, refresh, signin, signup, toAuthUser } from "@/lib/auth/auth.api";
import {
  clearRefreshTokenCookie,
  getRefreshToken,
  setRefreshTokenCookie,
} from "@/lib/auth/auth.cookies";
import type {
  AuthActionError,
  AuthActionResult,
  AuthSession,
  SigninPayload,
  SignupPayload,
} from "@/lib/auth/auth.types";
import type { ApiError } from "@/features/pharmacy/lib/pharmacy.types";

export async function signinAction(
  payload: SigninPayload,
): Promise<AuthActionResult<AuthSession>> {
  try {
    const tokens = await signin(payload);
    await setRefreshTokenCookie(tokens.refreshToken);
    const user = toAuthUser(await getMe(tokens.accessToken));

    return {
      success: true,
      data: {
        accessToken: tokens.accessToken,
        user,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: mapAuthError(error, "We could not sign you in. Please try again."),
    };
  }
}

export async function signupAction(
  payload: SignupPayload,
): Promise<AuthActionResult<AuthSession>> {
  try {
    const tokens = await signup(payload);
    await setRefreshTokenCookie(tokens.refreshToken);
    const user = toAuthUser(await getMe(tokens.accessToken));

    return {
      success: true,
      data: {
        accessToken: tokens.accessToken,
        user,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: mapAuthError(error, "We could not create your account. Please try again."),
    };
  }
}

export async function logoutAction(
  accessToken: string | null,
): Promise<AuthActionResult<{ success: true }>> {
  try {
    if (accessToken) {
      await logout(accessToken);
    }
  } catch {
    // Always clear local session even if the backend logout fails.
  }

  await clearRefreshTokenCookie();

  return {
    success: true,
    data: { success: true },
  };
}

export async function silentRefreshAction(): Promise<AuthSession | null> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const tokens = await refresh(refreshToken);
    await setRefreshTokenCookie(tokens.refreshToken);
    const user = toAuthUser(await getMe(tokens.accessToken));

    return {
      accessToken: tokens.accessToken,
      user,
    };
  } catch {
    await clearRefreshTokenCookie();
    return null;
  }
}

function mapAuthError(error: unknown, fallback: string): AuthActionError {
  if (!isApiError(error)) {
    return { message: fallback };
  }

  const fieldErrors = mapFieldErrors(error);

  if (error.status === 401) {
    return {
      message: "Invalid email/phone or password.",
      status: error.status,
      fieldErrors,
    };
  }

  if (error.status === 409) {
    return {
      message: error.message || "An account with this email or phone already exists.",
      status: error.status,
      fieldErrors,
    };
  }

  if (error.status === 429) {
    return {
      message: "Too many attempts. Please wait a moment and try again.",
      status: error.status,
    };
  }

  return {
    message: error.message || fallback,
    status: error.status,
    fieldErrors,
  };
}

function mapFieldErrors(error: ApiError): Record<string, string> | undefined {
  if (!error.errors?.length) {
    return undefined;
  }

  const fieldErrors: Record<string, string> = {};

  for (const issue of error.errors) {
    const key = issue.path.split(".").pop() ?? issue.path;
    fieldErrors[key] = issue.message;
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

function isApiError(error: unknown): error is ApiError {
  return Boolean(
    error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string",
  );
}
