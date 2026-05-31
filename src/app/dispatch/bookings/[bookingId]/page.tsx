import { DispatchForm } from "@/features/dispatch/components/DispatchForm";

interface DispatchBookingPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function DispatchBookingPage({
  params,
}: DispatchBookingPageProps) {
  const { bookingId } = await params;
  return <DispatchForm bookingId={bookingId} />;
}
