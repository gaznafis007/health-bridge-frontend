import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { marketingImages } from "@/lib/content/images";

const contactItems = [
  {
    label: "Address",
    value: "House 11, Road 7, Dhanmondi, Dhaka 1205, Bangladesh",
    icon: "map-pin" as const,
  },
  {
    label: "Phone",
    value: "+880 1700 123456",
    href: "tel:+8801700123456",
    icon: "phone" as const,
  },
  {
    label: "Email",
    value: "support@healthbridge.com",
    href: "mailto:support@healthbridge.com",
    icon: "mail" as const,
  },
  {
    label: "Emergency",
    value: "Use the ambulance request flow or call our hotline immediately.",
    icon: "ambulance" as const,
  },
];

export default function ContactPage() {
  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <SectionHeader
              eyebrow="Contact"
              title="We are here to help"
              description="24/7 for emergency support. Business hours for general inquiries and account assistance."
            />
            <div className="mt-8 space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-[var(--color-primary)]">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1 block font-medium text-[var(--color-primary)] hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                        {item.label === "Emergency" ? (
                          <>
                            For ambulance emergencies, use the{" "}
                            <Link
                              href="/ambulance/request"
                              className="font-semibold text-[var(--color-primary)] hover:underline"
                            >
                              ambulance request
                            </Link>{" "}
                            flow or call our hotline immediately.
                          </>
                        ) : (
                          item.value
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
            <Image
              src={marketingImages.contact.src}
              alt={marketingImages.contact.alt}
              width={marketingImages.contact.width}
              height={marketingImages.contact.height}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
