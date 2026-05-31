import { RequireRole } from "@/features/auth/components/RequireRole";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireRole allowed={["DRIVER"]}>{children}</RequireRole>;
}
