export type AppointmentStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PrescriptionStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "EXPIRED"
  | "CANCELLED";

export interface HealthCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  type: "HOSPITAL" | "CLINIC" | "DIAGNOSTIC_CENTER";
}

export interface DoctorSearchResult {
  doctorUserId: string;
  fullName: string;
  specialization: string;
  freeSlotCount: number;
}

export interface TimeSlot {
  availabilityRuleId: string;
  healthCenterId: string;
  startTime: string;
  durationMinutes: number;
  available: boolean;
}

export interface SlotsByCenter {
  healthCenter: HealthCenter;
  slots: TimeSlot[];
}

export interface DoctorDetail {
  doctorUserId: string;
  fullName: string;
  specialization: string;
  consultationFee: string;
  doctorPhone: string;
  freeSlotCount: number;
  healthCentres: HealthCenter[];
  slotsByHealthCentre: SlotsByCenter[];
}

export interface CreateAppointmentPayload {
  availabilityRuleId: string;
  date: string;
  startTime: string;
  reasonForVisit?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  healthCenterId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  reasonForVisit: string | null;
  fee: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  doctor?: DoctorSearchResult;
  healthCenter?: HealthCenter;
}

export interface PrescriptionItem {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medicines: PrescriptionItem[];
  notes: string | null;
  status: PrescriptionStatus;
  issuedAt: string;
  expiryDate: string | null;
}

export interface VisitNote {
  id: string;
  appointmentId: string;
  diagnosis: string | null;
  treatmentPlan: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  skip: number;
  take: number;
}

export interface DoctorSearchFormValues {
  specialization: string;
  date: string;
  healthCenterId: string;
}

export interface BookAppointmentFormValues {
  reasonForVisit: string;
}

export interface CancelAppointmentFormValues {
  reason: string;
}
