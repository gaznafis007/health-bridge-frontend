import type {
  Appointment,
  AppointmentStatus,
  DoctorDetail,
  DoctorSearchResult,
  HealthCenter,
  Paginated,
  SlotsByCenter,
  TimeSlot,
} from "@/lib/appointments/appointments.types";

const LIST_KEYS = ["data", "items", "doctors", "results"] as const;

type ApiHealthCenter = Partial<HealthCenter> & { id: string; name: string };

type ApiTimeSlot = {
  availabilityRuleId?: string;
  ruleId?: string;
  healthCenterId?: string;
  startTime?: string;
  durationMinutes?: number;
  available?: boolean;
  isAvailable?: boolean;
};

type ApiSlotsGroup = {
  healthCenter?: ApiHealthCenter;
  healthCentre?: ApiHealthCenter;
  center?: ApiHealthCenter;
  slots?: ApiTimeSlot[];
};

type ApiDoctorSearchRow = {
  doctorUserId?: string;
  doctorId?: string;
  userId?: string;
  fullName?: string;
  name?: string;
  specialization?: string;
  freeSlotCount?: number;
  freeSlots?: number;
};

type ApiDoctorDetail = ApiDoctorSearchRow & {
  consultationFee?: string | number;
  doctorPhone?: string;
  phone?: string;
  healthCentres?: ApiHealthCenter[];
  healthCenters?: ApiHealthCenter[];
  slotsByHealthCentre?: ApiSlotsGroup[];
  slotsByHealthCenter?: ApiSlotsGroup[];
  slots?: ApiTimeSlot[];
};

type ApiAppointmentDoctor = ApiDoctorSearchRow & {
  id?: string;
  firstName?: string;
  lastName?: string;
  doctorProfile?: { specialization?: string };
};

type ApiAppointment = {
  id?: string;
  patientId?: string;
  doctorId?: string;
  healthCenterId?: string | null;
  date?: string;
  appointmentDate?: string;
  startTime?: string;
  appointmentTime?: string;
  durationMinutes?: number;
  status?: AppointmentStatus;
  reasonForVisit?: string | null;
  fee?: string | number;
  consultationFee?: string | number;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  notes?: string | null;
  doctor?: ApiAppointmentDoctor;
  healthCenter?: ApiHealthCenter | null;
};

const TAKA_SYMBOL = "\u09F3";

export function formatAppointmentFee(
  amount: string | number | null | undefined,
): string {
  const parsed =
    typeof amount === "number"
      ? amount
      : Number.parseFloat(String(amount ?? "").trim());

  if (!Number.isFinite(parsed)) {
    return `${TAKA_SYMBOL}0`;
  }

  return `${TAKA_SYMBOL}${Math.round(parsed).toLocaleString("en-BD")}`;
}

function normalizeAppointmentDate(value?: string): string {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function normalizeAppointmentFee(raw: ApiAppointment): string {
  const value = raw.fee ?? raw.consultationFee;

  if (value === null || value === undefined) {
    return "0";
  }

  return String(value);
}

function normalizeAppointmentDoctor(
  raw?: ApiAppointmentDoctor,
): DoctorSearchResult | undefined {
  if (!raw) {
    return undefined;
  }

  const doctorUserId = raw.doctorUserId ?? raw.doctorId ?? raw.id;
  const fullName =
    raw.fullName ??
    (raw.firstName && raw.lastName
      ? `${raw.firstName} ${raw.lastName}`.trim()
      : undefined);
  const specialization =
    raw.specialization ?? raw.doctorProfile?.specialization ?? "Doctor";

  if (!doctorUserId || !fullName) {
    return undefined;
  }

  return {
    doctorUserId,
    fullName,
    specialization,
    freeSlotCount: raw.freeSlotCount ?? raw.freeSlots ?? 0,
  };
}

export function normalizeAppointment(raw: unknown): Appointment | null {
  const record = (raw ?? {}) as ApiAppointment;

  if (!record.id || !record.patientId || !record.doctorId || !record.status) {
    return null;
  }

  const date = normalizeAppointmentDate(record.date ?? record.appointmentDate);
  const startTime = record.startTime ?? record.appointmentTime;
  const cancelReason =
    record.cancelReason ??
    (record.status === "CANCELLED" && record.notes ? record.notes : null);

  if (!date || !startTime) {
    return null;
  }

  return {
    id: record.id,
    patientId: record.patientId,
    doctorId: record.doctorId,
    healthCenterId: record.healthCenterId ?? "",
    date,
    startTime,
    durationMinutes: record.durationMinutes ?? 30,
    status: record.status,
    reasonForVisit: record.reasonForVisit ?? null,
    fee: normalizeAppointmentFee(record),
    cancelledAt: record.cancelledAt ?? null,
    cancelReason,
    doctor: normalizeAppointmentDoctor(record.doctor),
    healthCenter: record.healthCenter
      ? normalizeHealthCenter(record.healthCenter)
      : undefined,
  };
}

export function normalizePaginatedAppointments(
  payload: unknown,
): Paginated<Appointment> {
  if (!payload || typeof payload !== "object") {
    return { items: [], total: 0, skip: 0, take: 0 };
  }

  const record = payload as Record<string, unknown>;
  const items = (Array.isArray(record.items) ? record.items : [])
    .map((item) => normalizeAppointment(item))
    .filter((item): item is Appointment => item !== null);

  return {
    items,
    total: Number(record.total ?? items.length),
    skip: Number(record.skip ?? 0),
    take: Number(record.take ?? items.length),
  };
}

export function unwrapAppointmentList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    for (const key of LIST_KEYS) {
      const value = record[key];
      if (Array.isArray(value)) {
        return value as T[];
      }
    }
  }

  return [];
}

function normalizeHealthCenter(raw: ApiHealthCenter): HealthCenter {
  return {
    id: raw.id,
    name: raw.name,
    address: raw.address ?? "",
    city: raw.city ?? "",
    state: raw.state ?? "",
    zipCode: raw.zipCode ?? "",
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    type: raw.type ?? "CLINIC",
  };
}

function resolveSlotAvailable(raw: ApiTimeSlot): boolean {
  if (typeof raw.available === "boolean") {
    return raw.available;
  }

  if (typeof raw.isAvailable === "boolean") {
    return raw.isAvailable;
  }

  return true;
}

function normalizeTimeSlot(raw: ApiTimeSlot): TimeSlot | null {
  const availabilityRuleId = raw.availabilityRuleId ?? raw.ruleId;
  const healthCenterId = raw.healthCenterId;
  const startTime = raw.startTime;

  if (!availabilityRuleId || !healthCenterId || !startTime) {
    return null;
  }

  return {
    availabilityRuleId,
    healthCenterId,
    startTime,
    durationMinutes: raw.durationMinutes ?? 30,
    available: resolveSlotAvailable(raw),
  };
}

function normalizeSlotsGroup(raw: ApiSlotsGroup): SlotsByCenter | null {
  const healthCenter = raw.healthCenter ?? raw.healthCentre ?? raw.center;

  if (!healthCenter?.id || !healthCenter.name) {
    return null;
  }

  const slots = (raw.slots ?? [])
    .map(normalizeTimeSlot)
    .filter((slot): slot is TimeSlot => slot !== null);

  return {
    healthCenter: normalizeHealthCenter(healthCenter),
    slots,
  };
}

function normalizeDoctorSearchResult(raw: ApiDoctorSearchRow): DoctorSearchResult | null {
  const doctorUserId = raw.doctorUserId ?? raw.doctorId ?? raw.userId;
  const fullName = raw.fullName ?? raw.name;
  const specialization = raw.specialization;

  if (!doctorUserId || !fullName || !specialization) {
    return null;
  }

  return {
    doctorUserId,
    fullName,
    specialization,
    freeSlotCount: raw.freeSlotCount ?? raw.freeSlots ?? 0,
  };
}

function normalizeSlotGroups(raw: ApiDoctorDetail): SlotsByCenter[] {
  const grouped =
    raw.slotsByHealthCentre ??
    raw.slotsByHealthCenter ??
    [];

  const normalizedGroups = grouped
    .map(normalizeSlotsGroup)
    .filter((group): group is SlotsByCenter => group !== null);

  if (normalizedGroups.length > 0) {
    return normalizedGroups;
  }

  if (!Array.isArray(raw.slots) || raw.slots.length === 0) {
    return [];
  }

  const centers =
    raw.healthCentres ??
    raw.healthCenters ??
    [];

  const centerById = new Map(
    centers
      .filter((center): center is ApiHealthCenter => Boolean(center?.id && center?.name))
      .map((center) => [center.id, normalizeHealthCenter(center)]),
  );

  const buckets = new Map<string, SlotsByCenter>();

  for (const slotRaw of raw.slots) {
    const slot = normalizeTimeSlot(slotRaw);
    if (!slot) continue;

    if (!buckets.has(slot.healthCenterId)) {
      const healthCenter = centerById.get(slot.healthCenterId);
      if (!healthCenter) continue;

      buckets.set(slot.healthCenterId, { healthCenter, slots: [] });
    }

    buckets.get(slot.healthCenterId)?.slots.push(slot);
  }

  return [...buckets.values()];
}

export function normalizeDoctorSearchResults(payload: unknown): DoctorSearchResult[] {
  return unwrapAppointmentList<ApiDoctorSearchRow>(payload)
    .map(normalizeDoctorSearchResult)
    .filter((doctor): doctor is DoctorSearchResult => doctor !== null);
}

export function normalizeDoctorDetail(payload: unknown): DoctorDetail {
  const raw = (payload ?? {}) as ApiDoctorDetail;
  const doctorUserId = raw.doctorUserId ?? raw.doctorId ?? raw.userId;
  const fullName = raw.fullName ?? raw.name;
  const specialization = raw.specialization;

  if (!doctorUserId || !fullName || !specialization) {
    throw new Error("Invalid doctor detail response.");
  }

  const healthCentres = (raw.healthCentres ?? raw.healthCenters ?? [])
    .filter((center): center is ApiHealthCenter => Boolean(center?.id && center?.name))
    .map(normalizeHealthCenter);

  const slotsByHealthCentre = normalizeSlotGroups(raw);
  const freeSlotCount =
    raw.freeSlotCount ??
    raw.freeSlots ??
    slotsByHealthCentre.reduce(
      (count, group) => count + group.slots.filter((slot) => slot.available).length,
      0,
    );

  return {
    doctorUserId,
    fullName,
    specialization,
    consultationFee: String(raw.consultationFee ?? "0"),
    doctorPhone: raw.doctorPhone ?? raw.phone ?? "",
    freeSlotCount,
    healthCentres,
    slotsByHealthCentre,
  };
}

export function normalizeHealthCenters(payload: unknown): HealthCenter[] {
  return unwrapAppointmentList<ApiHealthCenter>(payload)
    .filter((center): center is ApiHealthCenter => Boolean(center?.id && center?.name))
    .map(normalizeHealthCenter);
}

export function getAvailableSlots(slotsByCenter: SlotsByCenter[]): SlotsByCenter[] {
  return slotsByCenter
    .map((group) => ({
      healthCenter: group.healthCenter,
      slots: group.slots.filter((slot) => slot.available),
    }))
    .filter((group) => group.slots.length > 0);
}
