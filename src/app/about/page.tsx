import Image from "next/image";

import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { marketingImages } from "@/lib/content/images";

const values = [
  {
    title: "Patient-first",
    description: "Every flow is designed around clarity, privacy, and timely care.",
    icon: "heart-pulse" as const,
  },
  {
    title: "Verified network",
    description: "Doctors, labs, and emergency teams are vetted before joining.",
    icon: "shield-check" as const,
  },
  {
    title: "Always available",
    description: "Emergency ambulance and pharmacy access when minutes matter.",
    icon: "clock" as const,
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <SectionHeader
              eyebrow="About Us"
              title="Bridging patients to trusted care"
              description="HealthBridge connects Bangladesh to pharmacy delivery, diagnostic testing, in-person appointments, and emergency ambulance services."
            />
            <div className="mt-6 space-y-4 text-[var(--color-text-secondary)]">
              <p className="leading-7">
                We work with verified doctors, diagnostic centers, and emergency
                response teams to make healthcare accessible, transparent, and
                responsive — whether you are managing a chronic condition or facing
                an urgent situation.
              </p>
              <p className="leading-7">
                Our mission is simple: your health, bridged to the future — with
                secure accounts, role-based access for care teams, and clear status
                tracking at every step.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
            <Image
              src={marketingImages.about.src}
              alt={marketingImages.about.alt}
              width={marketingImages.about.width}
              height={marketingImages.about.height}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="surface-card rounded-xl p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-[var(--color-primary)]">
                <Icon name={value.icon} className="h-5 w-5" />
              </span>
              <h2 className="font-heading mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                {value.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
