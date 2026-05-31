import { PharmacyOrderDetailShell } from "@/features/pharmacy/components/PharmacyOrderDetailShell";

interface OrderTrackingPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ session?: string }>;
}

export default async function OrderTrackingPage({
  params,
  searchParams,
}: OrderTrackingPageProps) {
  const { orderId } = await params;
  const { session } = await searchParams;

  return (
    <PharmacyOrderDetailShell orderId={orderId} guestSessionId={session} />
  );
}
