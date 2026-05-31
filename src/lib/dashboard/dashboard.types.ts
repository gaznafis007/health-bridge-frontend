import type { Appointment } from "@/lib/appointments/appointments.types";
import type { AmbulanceBooking } from "@/lib/ambulance/ambulance.types";
import type { LabBooking, LabReport } from "@/lib/labs/labs.types";
import type { Order } from "@/features/pharmacy/lib/pharmacy.types";
import type { Prescription } from "@/lib/appointments/appointments.types";

export interface PatientDashboard {
  upcomingAppointments: Appointment[];
  recentLabBookings: LabBooking[];
  recentAmbulanceBookings: AmbulanceBooking[];
  recentOrders: Order[];
  recentReports: LabReport[];
  recentPrescriptions: Prescription[];
}

export interface DoctorDashboardAppointment {
  id: string;
  status: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationFee: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  healthCenter: { name: string };
}

export interface DoctorDashboard {
  todayAppointments: DoctorDashboardAppointment[];
  counts: {
    scheduled: number;
    completed: number;
    cancelled: number;
  };
  feesEarnedToday: string;
}

export interface AdminDashboard {
  today: {
    orders: number;
    labBookings: number;
    appointments: number;
  };
  ambulance: {
    activeBookings: number;
    fleetAvailable: number;
    fleetOnDuty: number;
  };
  lab: {
    pendingPaymentBookings: number;
  };
}
