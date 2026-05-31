import { AppointmentDetailShell } from "@/features/appointments/components/AppointmentDetailShell";

interface AppointmentDetailPageProps {
  params: Promise<{ appointmentId: string }>;
}

export default async function AppointmentDetailPage({
  params,
}: AppointmentDetailPageProps) {
  const { appointmentId } = await params;

  return <AppointmentDetailShell appointmentId={appointmentId} />;
}
