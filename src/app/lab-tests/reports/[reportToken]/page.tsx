import { PublicReportShell } from "@/features/labs/components/PublicReportShell";

interface PublicReportPageProps {
  params: Promise<{ reportToken: string }>;
}

export default async function PublicReportPage({ params }: PublicReportPageProps) {
  const { reportToken } = await params;
  return <PublicReportShell reportToken={reportToken} />;
}
