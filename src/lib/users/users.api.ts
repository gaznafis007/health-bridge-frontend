import { apiRequest } from "@/lib/api/client";
import type { UserMeResponse } from "@/lib/auth/auth.types";
import type {
  PaginatedUsers,
  UpdateDoctorProfilePayload,
  UpdatePatientProfilePayload,
  UpdateProfilePayload,
  UpdateUserRolePayload,
} from "@/lib/users/users.types";

const PREFIX = "/users";

export function updateProfile(
  accessToken: string,
  payload: UpdateProfilePayload,
): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>(`${PREFIX}/me`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });
}

export function updatePatientProfile(
  accessToken: string,
  payload: UpdatePatientProfilePayload,
): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>(`${PREFIX}/me/patient-profile`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });
}

export function updateDoctorProfile(
  accessToken: string,
  payload: UpdateDoctorProfilePayload,
): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>(`${PREFIX}/me/doctor-profile`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });
}

export function listUsers(
  accessToken: string,
  params: { role?: string; skip?: number; take?: number } = {},
): Promise<PaginatedUsers> {
  const searchParams = new URLSearchParams();
  if (params.role) searchParams.set("role", params.role);
  if (params.skip !== undefined) searchParams.set("skip", String(params.skip));
  if (params.take !== undefined) searchParams.set("take", String(params.take));
  const qs = searchParams.size > 0 ? `?${searchParams}` : "";
  return apiRequest<PaginatedUsers>(`${PREFIX}${qs}`, {
    accessToken,
    cache: "no-store",
  });
}

export function updateUserRole(
  accessToken: string,
  userId: string,
  payload: UpdateUserRolePayload,
): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>(`${PREFIX}/${userId}/role`, {
    method: "PATCH",
    accessToken,
    body: payload,
  });
}

export function approveDoctor(
  accessToken: string,
  userId: string,
): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>(`${PREFIX}/${userId}/doctor/approve`, {
    method: "PATCH",
    accessToken,
  });
}

export function suspendDoctor(
  accessToken: string,
  userId: string,
): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>(`${PREFIX}/${userId}/doctor/suspend`, {
    method: "PATCH",
    accessToken,
  });
}
