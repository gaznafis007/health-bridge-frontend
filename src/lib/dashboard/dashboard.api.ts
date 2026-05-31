import { apiRequest } from "@/lib/api/client";
import type {
  AdminDashboard,
  DoctorDashboard,
  PatientDashboard,
} from "@/lib/dashboard/dashboard.types";

const PREFIX = "/dashboard";

export function getPatientDashboard(accessToken: string): Promise<PatientDashboard> {
  return apiRequest<PatientDashboard>(`${PREFIX}/patient`, {
    accessToken,
    cache: "no-store",
  });
}

export function getDoctorDashboard(accessToken: string): Promise<DoctorDashboard> {
  return apiRequest<DoctorDashboard>(`${PREFIX}/doctor`, {
    accessToken,
    cache: "no-store",
  });
}

export function getAdminDashboard(accessToken: string): Promise<AdminDashboard> {
  return apiRequest<AdminDashboard>(`${PREFIX}/admin`, {
    accessToken,
    cache: "no-store",
  });
}
