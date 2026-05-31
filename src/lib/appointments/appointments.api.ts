import { apiRequest } from "@/lib/api/client";
import type {
  Appointment,
  CreateAppointmentPayload,
  DoctorDetail,
  DoctorSearchResult,
  HealthCenter,
  Paginated,
  Prescription,
  VisitNote,
} from "@/lib/appointments/appointments.types";

const APPOINTMENTS_PREFIX = "/appointments";

export function getHealthCenters(accessToken: string): Promise<HealthCenter[]> {
  return apiRequest<HealthCenter[]>(`${APPOINTMENTS_PREFIX}/health-centers`, {
    accessToken,
    cache: "no-store",
  });
}

export function searchDoctors(
  accessToken: string,
  params: {
    specialization: string;
    date: string;
    healthCenterId?: string;
  },
): Promise<DoctorSearchResult[]> {
  const searchParams = new URLSearchParams({
    specialization: params.specialization,
    date: params.date,
  });

  if (params.healthCenterId) {
    searchParams.set("healthCenterId", params.healthCenterId);
  }

  return apiRequest<DoctorSearchResult[]>(
    `${APPOINTMENTS_PREFIX}/doctors/search?${searchParams}`,
    { accessToken, cache: "no-store" },
  );
}

export function getDoctorDetail(
  accessToken: string,
  doctorUserId: string,
  params: { date: string; healthCenterId?: string },
): Promise<DoctorDetail> {
  const searchParams = new URLSearchParams({ date: params.date });

  if (params.healthCenterId) {
    searchParams.set("healthCenterId", params.healthCenterId);
  }

  return apiRequest<DoctorDetail>(
    `${APPOINTMENTS_PREFIX}/doctors/${doctorUserId}?${searchParams}`,
    { accessToken, cache: "no-store" },
  );
}

export function bookAppointment(
  accessToken: string,
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  return apiRequest<Appointment>(APPOINTMENTS_PREFIX, {
    method: "POST",
    accessToken,
    body: payload,
  });
}

export function getMyAppointments(
  accessToken: string,
  skip = 0,
  take = 20,
): Promise<Paginated<Appointment>> {
  const params = new URLSearchParams({
    skip: String(skip),
    take: String(take),
  });

  return apiRequest<Paginated<Appointment>>(
    `${APPOINTMENTS_PREFIX}/me/patient?${params}`,
    { accessToken, cache: "no-store" },
  );
}

export function cancelAppointment(
  accessToken: string,
  appointmentId: string,
  reason?: string,
): Promise<Appointment> {
  return apiRequest<Appointment>(
    `${APPOINTMENTS_PREFIX}/${appointmentId}/cancel`,
    {
      method: "PATCH",
      accessToken,
      body: reason ? { reason } : {},
    },
  );
}

export function getVisitNote(
  accessToken: string,
  appointmentId: string,
): Promise<VisitNote> {
  return apiRequest<VisitNote>(
    `${APPOINTMENTS_PREFIX}/${appointmentId}/visit-note`,
    { accessToken, cache: "no-store" },
  );
}

export function getPrescription(
  accessToken: string,
  appointmentId: string,
): Promise<Prescription> {
  return apiRequest<Prescription>(
    `${APPOINTMENTS_PREFIX}/${appointmentId}/prescription`,
    { accessToken, cache: "no-store" },
  );
}

export function getMyPrescriptions(
  accessToken: string,
  skip = 0,
  take = 20,
): Promise<Paginated<Prescription>> {
  const params = new URLSearchParams({
    skip: String(skip),
    take: String(take),
  });

  return apiRequest<Paginated<Prescription>>(
    `${APPOINTMENTS_PREFIX}/prescriptions/me?${params}`,
    { accessToken, cache: "no-store" },
  );
}
