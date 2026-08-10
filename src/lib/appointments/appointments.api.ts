import { apiRequest } from "@/lib/api/client";
import {
  normalizeAppointment,
  normalizeDoctorDetail,
  normalizeDoctorSearchResults,
  normalizeHealthCenters,
  normalizePaginatedAppointments,
} from "@/lib/appointments/appointments.utils";
import type {
  Appointment,
  AvailabilityRule,
  CreateAppointmentPayload,
  CreateAvailabilityPayload,
  DoctorAppointment,
  DoctorDetail,
  DoctorSearchResult,
  HealthCenter,
  Paginated,
  Prescription,
  UpdateAvailabilityPayload,
  VisitNote,
  WritePrescriptionPayload,
  WriteVisitNotePayload,
} from "@/lib/appointments/appointments.types";

const APPOINTMENTS_PREFIX = "/appointments";

export function getHealthCenters(accessToken: string): Promise<HealthCenter[]> {
  return apiRequest<unknown>(`${APPOINTMENTS_PREFIX}/health-centers`, {
    accessToken,
    cache: "no-store",
  }).then(normalizeHealthCenters);
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

  return apiRequest<unknown>(
    `${APPOINTMENTS_PREFIX}/doctors/search?${searchParams}`,
    { accessToken, cache: "no-store" },
  ).then(normalizeDoctorSearchResults);
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

  return apiRequest<unknown>(
    `${APPOINTMENTS_PREFIX}/doctors/${doctorUserId}?${searchParams}`,
    { accessToken, cache: "no-store" },
  ).then(normalizeDoctorDetail);
}

export function bookAppointment(
  accessToken: string,
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  return apiRequest<unknown>(APPOINTMENTS_PREFIX, {
    method: "POST",
    accessToken,
    body: payload,
  }).then((response) => {
    const appointment = normalizeAppointment(response);
    if (!appointment) {
      throw new Error("Invalid appointment response.");
    }
    return appointment;
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

  return apiRequest<unknown>(
    `${APPOINTMENTS_PREFIX}/me/patient?${params}`,
    { accessToken, cache: "no-store" },
  ).then(normalizePaginatedAppointments);
}

export function cancelAppointment(
  accessToken: string,
  appointmentId: string,
  reason?: string,
): Promise<Appointment> {
  return apiRequest<unknown>(
    `${APPOINTMENTS_PREFIX}/${appointmentId}/cancel`,
    {
      method: "PATCH",
      accessToken,
      body: reason ? { reason } : {},
    },
  ).then((response) => {
    const appointment = normalizeAppointment(response);
    if (!appointment) {
      throw new Error("Invalid appointment response.");
    }
    return appointment;
  });
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

export function getDoctorAppointments(
  accessToken: string,
  params: { from?: string; toInclusive?: string; healthCenterId?: string } = {},
): Promise<DoctorAppointment[]> {
  const searchParams = new URLSearchParams();
  if (params.from) searchParams.set("from", params.from);
  if (params.toInclusive) searchParams.set("toInclusive", params.toInclusive);
  if (params.healthCenterId) searchParams.set("healthCenterId", params.healthCenterId);
  const qs = searchParams.size > 0 ? `?${searchParams}` : "";
  return apiRequest<DoctorAppointment[]>(
    `${APPOINTMENTS_PREFIX}/me/doctor${qs}`,
    { accessToken, cache: "no-store" },
  );
}

export function getDoctorAvailability(
  accessToken: string,
): Promise<AvailabilityRule[]> {
  return apiRequest<AvailabilityRule[]>(
    `${APPOINTMENTS_PREFIX}/me/doctor/availability`,
    { accessToken, cache: "no-store" },
  );
}

export function createAvailability(
  accessToken: string,
  payload: CreateAvailabilityPayload,
): Promise<AvailabilityRule> {
  return apiRequest<AvailabilityRule>(
    `${APPOINTMENTS_PREFIX}/me/doctor/availability`,
    { method: "POST", accessToken, body: payload },
  );
}

export function updateAvailability(
  accessToken: string,
  availabilityId: string,
  payload: UpdateAvailabilityPayload,
): Promise<AvailabilityRule> {
  return apiRequest<AvailabilityRule>(
    `${APPOINTMENTS_PREFIX}/me/doctor/availability/${availabilityId}`,
    { method: "PATCH", accessToken, body: payload },
  );
}

export function deleteAvailability(
  accessToken: string,
  availabilityId: string,
): Promise<void> {
  return apiRequest<void>(
    `${APPOINTMENTS_PREFIX}/me/doctor/availability/${availabilityId}`,
    { method: "DELETE", accessToken },
  );
}

export function getAppointment(
  accessToken: string,
  appointmentId: string,
): Promise<DoctorAppointment> {
  return apiRequest<DoctorAppointment>(
    `${APPOINTMENTS_PREFIX}/${appointmentId}`,
    { accessToken, cache: "no-store" },
  );
}

export function startAppointment(
  accessToken: string,
  appointmentId: string,
): Promise<Appointment> {
  return apiRequest<Appointment>(
    `${APPOINTMENTS_PREFIX}/${appointmentId}/start`,
    { method: "PATCH", accessToken },
  );
}

export function completeAppointment(
  accessToken: string,
  appointmentId: string,
): Promise<Appointment> {
  return apiRequest<Appointment>(
    `${APPOINTMENTS_PREFIX}/${appointmentId}/complete`,
    { method: "PATCH", accessToken },
  );
}

export function writeVisitNote(
  accessToken: string,
  appointmentId: string,
  payload: WriteVisitNotePayload,
): Promise<VisitNote> {
  return apiRequest<VisitNote>(
    `${APPOINTMENTS_PREFIX}/${appointmentId}/visit-note`,
    { method: "POST", accessToken, body: payload },
  );
}

export function writePrescription(
  accessToken: string,
  appointmentId: string,
  payload: WritePrescriptionPayload,
): Promise<Prescription> {
  return apiRequest<Prescription>(
    `${APPOINTMENTS_PREFIX}/${appointmentId}/prescription`,
    { method: "POST", accessToken, body: payload },
  );
}
