import { CenterDetailShell } from "@/features/labs/components/CenterDetailShell";

interface CenterPageProps {
  params: Promise<{ centerId: string }>;
}

export default async function CenterDetailPage({ params }: CenterPageProps) {
  const { centerId } = await params;

  return <CenterDetailShell centerId={centerId} />;
}
