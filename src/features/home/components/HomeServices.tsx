import Image from "next/image";
import Link from "next/link";

import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { serviceImages } from "@/lib/content/images";

const services = [
  {
    title: "Video Consultation",
    description: "Talk to a verified doctor from anywhere in Bangladesh.",
    href: "/appointments",
    icon: "video" as IconName,
    imageKey: "video" as keyof typeof serviceImages,
  },
  {
    title: "Online Pharmacy",
    description: "Order medicine with or without an account — fast delivery.",
    href: "/pharmacy",
    icon: "pill" as IconName,
    imageKey: "pharmacy" as keyof typeof serviceImages,
  },
  {
    title: "Lab Tests",
    description: "Book home sample collection and receive reports online.",
    href: "/lab-tests",
    icon: "flask" as IconName,
    imageKey: "lab" as keyof typeof serviceImages,
  },
  {
    title: "Ambulance Booking",
    description: "Emergency dispatch with live status and location tracking.",
    href: "/ambulance",
    icon: "ambulance" as IconName,
    imageKey: "ambulance" as keyof typeof serviceImages,
  },
  {
    title: "Health Records",
    description: "Access visit notes, prescriptions, and appointment history.",
    href: "/appointments/history",
    icon: "file-text" as IconName,
    imageKey: "records" as keyof typeof serviceImages,
  },
  {
    title: "Secure Messaging",
    description: "Stay connected with your care team between visits.",
    href: "/contact",
    icon: "message" as IconName,
    imageKey: "messaging" as keyof typeof serviceImages,
  },
] as const;

export function HomeServices() {
  return (
    <section className="section-padding mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Services"
        title="Everything Healthcare, One Platform"
        description="From everyday care to urgent response — every service is designed for clarity, speed, and trust."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const image = serviceImages[service.imageKey];
          return (
            <Link
              key={service.title}
              href={service.href}
              className="surface-card group overflow-hidden rounded-xl transition hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-soft)]"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-[var(--color-primary)]">
                  <Icon name={service.icon} className="h-4 w-4" />
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {service.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-[var(--color-primary)]">
                  Learn more →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
