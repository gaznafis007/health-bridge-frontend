import { DoctorAppointmentDetailShell } from "@/features/appointments/components/doctor/DoctorAppointmentDetailShell";

interface DoctorAppointmentPageProps {
  params: Promise<{ appointmentId: string }>;
}

export default async function DoctorAppointmentPage({
  params,
}: DoctorAppointmentPageProps) {
  const { appointmentId } = await params;
  return <DoctorAppointmentDetailShell appointmentId={appointmentId} />;
}
