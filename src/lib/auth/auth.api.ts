import { apiRequest } from "@/lib/api/client";
import type {
  AuthUser,
  SigninPayload,
  SignupPayload,
  TokenResponse,
  UserMeResponse,
} from "@/lib/auth/auth.types";

const AUTH_PREFIX = "/auth";
const USERS_PREFIX = "/users";

export function signup(payload: SignupPayload): Promise<TokenResponse> {
  return apiRequest<TokenResponse>(`${AUTH_PREFIX}/signup`, {
    method: "POST",
    body: payload,
  });
}

export function signin(payload: SigninPayload): Promise<TokenResponse> {
  return apiRequest<TokenResponse>(`${AUTH_PREFIX}/signin`, {
    method: "POST",
    body: payload,
  });
}

export function refresh(refreshToken: string): Promise<TokenResponse> {
  return apiRequest<TokenResponse>(`${AUTH_PREFIX}/refresh`, {
    method: "POST",
    body: { refreshToken },
  });
}

export function logout(accessToken: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`${AUTH_PREFIX}/logout`, {
    method: "POST",
    accessToken,
  });
}

export function getMe(accessToken: string): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>(`${USERS_PREFIX}/me`, {
    cache: "no-store",
    accessToken,
  });
}

export function toAuthUser(user: UserMeResponse): AuthUser {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: normalizeUserRole(user.role),
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture,
    isVerified: user.isVerified,
  };
}

function normalizeUserRole(role: string): UserRole {
  const normalized = role.toUpperCase();

  if (
    normalized === "PATIENT" ||
    normalized === "DOCTOR" ||
    normalized === "ADMIN" ||
    normalized === "DISPATCHER" ||
    normalized === "DRIVER"
  ) {
    return normalized;
  }

  return role as UserRole;
}
