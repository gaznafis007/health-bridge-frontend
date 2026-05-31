import { RequireRole } from "@/features/auth/components/RequireRole";

export default function DispatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole allowed={["DISPATCHER", "ADMIN"]}>{children}</RequireRole>
  );
}
