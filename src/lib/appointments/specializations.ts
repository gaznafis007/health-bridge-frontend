/**
 * Must stay aligned with backend doctor seed / DB specialization values.
 * Search uses case-insensitive substring match: DB value must contain this term.
 */
export const DOCTOR_SPECIALIZATIONS = [
  "Cardiology",
  "General Medicine",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "Neurology",
  "ENT",
  "Psychiatry",
  "Ophthalmology",
] as const;

export type DoctorSpecialization = (typeof DOCTOR_SPECIALIZATIONS)[number];
