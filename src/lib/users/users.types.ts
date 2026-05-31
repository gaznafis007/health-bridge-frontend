import type { UserMeResponse, UserRole } from "@/lib/auth/auth.types";

export type { UserMeResponse };

export interface PaginatedUsers {
  items: UserMeResponse[];
  total: number;
  skip: number;
  take: number;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

export interface UpdatePatientProfilePayload {
  bloodGroup?: string;
  height?: number;
  weight?: number;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface UpdateDoctorProfilePayload {
  hospital?: string;
  biography?: string;
  consultationFee?: number;
}

export interface UpdateUserRolePayload {
  role: UserRole;
}
