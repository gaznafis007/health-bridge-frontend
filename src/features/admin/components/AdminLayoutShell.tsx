"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { RequireRole } from "@/features/auth/components/RequireRole";

const navGroups = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Hub" }],
  },
  {
    label: "Users",
    links: [{ href: "/admin/users", label: "Users" }],
  },
  {
    label: "Pharmacy",
    links: [
      { href: "/admin/pharmacy/categories", label: "Categories" },
      { href: "/admin/pharmacy/medicines", label: "Medicines" },
      { href: "/admin/pharmacy/orders", label: "Orders" },
    ],
  },
  {
    label: "Lab",
    links: [
      { href: "/admin/lab/centers", label: "Centers" },
      { href: "/admin/lab/bookings", label: "Bookings" },
      { href: "/admin/lab/reports", label: "Reports" },
    ],
  },
  {
    label: "Ambulance",
    links: [
      { href: "/admin/ambulance/health-centers", label: "Health centers" },
      { href: "/admin/ambulance/fleet", label: "Fleet" },
      { href: "/admin/ambulance/drivers", label: "Drivers" },
    ],
  },
];

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <RequireRole allowed={["ADMIN"]}>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row lg:px-8">
        <aside className="lg:w-56 lg:shrink-0">
          <p className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
            Admin console
          </p>
          <nav className="mt-6 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                  {group.label}
                </p>
                <ul className="mt-2 space-y-1">
                  {group.links.map((link) => {
                    const isActive =
                      link.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(link.href);

                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? "bg-sky-100 text-[var(--color-primary)]"
                              : "text-[var(--color-text-secondary)] hover:bg-slate-50"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </RequireRole>
  );
}
