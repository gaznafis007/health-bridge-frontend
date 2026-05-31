import Link from "next/link";

import { SectionHeader } from "@/components/ui/SectionHeader";

const services = [
  {
    title: "Pharmacy",
    description: "Browse medicines, manage your cart, and track deliveries.",
    href: "/pharmacy",
  },
  {
    title: "Lab tests",
    description: "Book diagnostic tests and receive digital reports.",
    href: "/lab-tests",
  },
  {
    title: "Ambulance",
    description: "Request emergency transport with live tracking.",
    href: "/ambulance",
  },
  {
    title: "Appointments",
    description: "Find doctors, book in-person visits, and view prescriptions.",
    href: "/appointments",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        title="Our services"
        description="Everything you need for day-to-day and urgent healthcare in one platform."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-6 transition hover:border-[var(--color-primary)]"
          >
            <h2 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
              {service.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {service.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
