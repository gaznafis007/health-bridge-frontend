import { PharmacyOrderDetailShell } from "@/features/pharmacy/components/PharmacyOrderDetailShell";

interface OrderTrackingPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ session?: string; placed?: string }>;
}

export default async function OrderTrackingPage({
  params,
  searchParams,
}: OrderTrackingPageProps) {
  const { orderId } = await params;
  const { session, placed } = await searchParams;

  return (
    <PharmacyOrderDetailShell
      orderId={orderId}
      guestSessionId={session}
      orderJustPlaced={placed === "1"}
    />
  );
}
