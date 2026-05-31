import { DriverBookingDetailShell } from "@/features/driver/components/DriverBookingDetailShell";

interface DriverBookingPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function DriverBookingPage({ params }: DriverBookingPageProps) {
  const { bookingId } = await params;
  return <DriverBookingDetailShell bookingId={bookingId} />;
}
