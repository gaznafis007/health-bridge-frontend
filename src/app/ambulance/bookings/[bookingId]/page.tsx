import { AmbulanceBookingDetailShell } from "@/features/ambulance/components/AmbulanceBookingDetailShell";

interface AmbulanceBookingDetailPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function AmbulanceBookingDetailPage({
  params,
}: AmbulanceBookingDetailPageProps) {
  const { bookingId } = await params;

  return <AmbulanceBookingDetailShell bookingId={bookingId} />;
}
