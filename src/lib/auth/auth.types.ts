export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN" | "DISPATCHER" | "DRIVER";

export type SignupRole = "PATIENT" | "DOCTOR";

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  isVerified: boolean;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignupPayload {
  email: string;
  phone: string;
  password: string;
  role: SignupRole;
  firstName: string;
  lastName: string;
  specialization?: string;
  qualification?: string;
  licenseNumber?: string;
}

export interface SigninPayload {
  identity: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export interface AuthActionError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}

export type AuthActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthActionError };

export interface UserMeResponse {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  isVerified: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  patientProfile: Record<string, unknown> | null;
  doctorProfile: Record<string, unknown> | null;
}
