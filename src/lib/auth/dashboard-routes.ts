import type { UserRole } from "@/lib/auth/auth.types";

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "PATIENT":
      return "/dashboard/patient";
    case "DOCTOR":
      return "/dashboard/doctor";
    case "ADMIN":
      return "/dashboard/admin";
    case "DISPATCHER":
      return "/dispatch";
    case "DRIVER":
      return "/driver";
    default:
      return "/";
  }
}

export function getPrimaryNavLabelForRole(role: UserRole): string {
  switch (role) {
    case "DOCTOR":
      return "My Schedule";
    case "ADMIN":
      return "Admin Hub";
    case "DISPATCHER":
      return "Dispatch";
    case "DRIVER":
      return "My Assignment";
    default:
      return "Dashboard";
  }
}

export function getPrimaryNavHrefForRole(role: UserRole): string {
  switch (role) {
    case "DOCTOR":
      return "/appointments/doctor";
    case "ADMIN":
      return "/admin";
    case "DISPATCHER":
      return "/dispatch";
    case "DRIVER":
      return "/driver";
    default:
      return getDashboardPathForRole(role);
  }
}

export type AuthenticatedNavLinkVariant = "default" | "primary";

export interface AuthenticatedNavLink {
  href: string;
  label: string;
  variant: AuthenticatedNavLinkVariant;
}

/** Role-aware nav links for authenticated users; deduplicates when dashboard and primary nav share the same destination. */
export function getAuthenticatedNavLinks(role: UserRole): AuthenticatedNavLink[] {
  const dashboardHref = getDashboardPathForRole(role);
  const primaryHref = getPrimaryNavHrefForRole(role);
  const primaryLabel = getPrimaryNavLabelForRole(role);

  if (dashboardHref === primaryHref) {
    return [{ href: primaryHref, label: primaryLabel, variant: "primary" }];
  }

  return [
    { href: dashboardHref, label: "Dashboard", variant: "default" },
    { href: primaryHref, label: primaryLabel, variant: "primary" },
  ];
}
