"use client";

import Link from "next/link";

import { SectionHeader } from "@/components/ui/SectionHeader";

const sections = [
  {
    title: "Users",
    description: "Approve doctors, suspend accounts, manage roles.",
    href: "/admin/users",
  },
  {
    title: "Pharmacy",
    description: "Categories, medicines, and order delivery status.",
    href: "/admin/pharmacy/categories",
  },
  {
    title: "Lab",
    description: "Diagnostic centers, bookings, sample lifecycle, reports.",
    href: "/admin/lab/centers",
  },
  {
    title: "Ambulance",
    description: "Health centers, fleet, and driver management.",
    href: "/admin/ambulance/health-centers",
  },
  {
    title: "Dispatch queue",
    description: "Active ambulance bookings and manual dispatch.",
    href: "/dispatch",
  },
  {
    title: "Dashboard",
    description: "Platform metrics and today's activity.",
    href: "/dashboard/admin",
  },
];

export function AdminHubShell() {
  return (
    <div>
      <SectionHeader
        title="Admin hub"
        description="Manage platform operations across pharmacy, lab, ambulance, and users."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:border-[var(--color-primary)] hover:shadow-sm"
          >
            <h3 className="font-heading font-semibold text-[var(--color-text-primary)]">
              {section.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
