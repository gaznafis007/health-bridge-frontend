import Image from "next/image";
import Link from "next/link";

import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { marketingImages, serviceImages } from "@/lib/content/images";

const services = [
  {
    title: "Pharmacy",
    description: "Browse medicines, manage your cart, and track deliveries to your door.",
    href: "/pharmacy",
    icon: "pill" as IconName,
    imageKey: "pharmacy" as keyof typeof serviceImages,
    highlight: "Guest checkout available",
  },
  {
    title: "Lab tests",
    description: "Book diagnostic tests, track sample collection, and receive digital reports.",
    href: "/lab-tests",
    icon: "flask" as IconName,
    imageKey: "lab" as keyof typeof serviceImages,
    highlight: "Home sample collection",
  },
  {
    title: "Ambulance",
    description: "Request emergency transport with live status and location tracking.",
    href: "/ambulance",
    icon: "ambulance" as IconName,
    imageKey: "ambulance" as keyof typeof serviceImages,
    highlight: "24/7 emergency dispatch",
  },
  {
    title: "Appointments",
    description: "Find doctors, book in-person visits, and access prescriptions and history.",
    href: "/appointments",
    icon: "calendar" as IconName,
    imageKey: "records" as keyof typeof serviceImages,
    highlight: "500+ verified doctors",
  },
] as const;

const highlights = [
  { label: "Services", value: "4+" },
  { label: "Coverage", value: "Nationwide" },
  { label: "Support", value: "24/7" },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <SectionHeader
              eyebrow="Our Services"
              title="Complete healthcare in one place"
              description="From everyday pharmacy orders to emergency ambulance dispatch — every service is built for clarity, speed, and trust."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-[var(--color-border)] bg-cyan-50/40 px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {item.label}
                  </p>
                  <p className="font-heading mt-1 text-lg font-bold text-[var(--color-primary)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-card)]">
              <Image
                src={marketingImages.services.src}
                alt={marketingImages.services.alt}
                width={marketingImages.services.width}
                height={marketingImages.services.height}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-2 hidden rounded-lg border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)] sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Trusted by patients
              </p>
              <p className="font-heading mt-1 text-xl font-bold text-[var(--color-primary)]">
                10,000+ served
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Explore"
          title="Pick the service you need"
          description="Each pathway is designed with role-aware access, clear status tracking, and secure payments."
          className="mb-10"
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => {
            const image = serviceImages[service.imageKey];
            const featured = index === 0;

            return (
              <Link
                key={service.href}
                href={service.href}
                className={`group overflow-hidden rounded-xl border border-[var(--color-border)] bg-white transition hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-soft)] ${
                  featured ? "lg:row-span-1" : ""
                }`}
              >
                <div className={`relative overflow-hidden ${featured ? "h-52" : "h-40"}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-[var(--color-primary)]">
                    <Icon name={service.icon} className="h-5 w-5" />
                  </span>
                  <span className="absolute right-3 top-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                    {service.highlight}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
                    {service.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                    {service.description}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]">
                    Get started
                    <span aria-hidden="true">→</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
