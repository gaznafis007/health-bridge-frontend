"use client";

import { useEffect, useRef } from "react";

import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations/gsap";

const stats = [
  { value: 10000, suffix: "+", label: "Patients Served" },
  { value: 500, suffix: "+", label: "Verified Doctors" },
  { value: 24, suffix: "/7", label: "Emergency Service" },
  { value: 100, suffix: "+", label: "Lab Partners" },
] as const;

export function HomeStatsBar() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion()) return;

    const counters = sectionRef.current?.querySelectorAll("[data-count]");
    if (!counters?.length) return;

    counters.forEach((node) => {
      const el = node as HTMLElement;
      const target = Number(el.dataset.count ?? 0);
      const suffix = el.dataset.suffix ?? "";
      const counter = { value: 0 };

      gsap.to(counter, {
        value: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.value).toLocaleString()}${suffix}`;
        },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="bg-[var(--color-primary)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-white sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              data-count={stat.value}
              data-suffix={stat.suffix}
              className="font-heading text-3xl font-bold sm:text-4xl"
            >
              0{stat.suffix}
            </p>
            <p className="mt-2 text-sm text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
