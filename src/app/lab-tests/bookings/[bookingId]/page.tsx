import { LabBookingDetailShell } from "@/features/labs/components/LabBookingDetailShell";

interface BookingDetailPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function LabBookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { bookingId } = await params;

  return <LabBookingDetailShell bookingId={bookingId} />;
}
