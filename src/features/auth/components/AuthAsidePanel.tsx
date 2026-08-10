"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { Icon } from "@/components/ui/Icon";
import { AuthIllustration } from "@/features/auth/components/AuthIllustration";
import {
  ensureGsap,
  gsap,
  prefersReducedMotion,
  splitWords,
} from "@/lib/animations/gsap";

const features = [
  "Book appointments in minutes",
  "Track lab reports and prescriptions",
  "Request ambulance with live status",
];

export function AuthAsidePanel() {
  const panelRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !panelRef.current) return;

    const ctx = gsap.context(() => {
      const titleWords = titleRef.current ? splitWords(titleRef.current) : [];

      gsap.from(".auth-aside-item", {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.from(titleWords, {
        y: "110%",
        opacity: 0,
        duration: 0.75,
        stagger: 0.035,
        ease: "power3.out",
        delay: 0.25,
      });

      gsap.from(".auth-illustration", {
        scale: 0.94,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.45,
      });
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={panelRef}
      className="hidden flex-col justify-center rounded-xl border border-[var(--color-border)] bg-white p-8 lg:flex lg:p-10"
    >
      <div className="auth-aside-item">
        <Link
          href="/"
          className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-[var(--color-primary)]">
            <Icon name="heart-pulse" className="h-5 w-5" />
          </span>
          <span className="font-heading text-xl font-bold text-[var(--color-text-primary)]">
            HealthBridge
          </span>
        </Link>
      </div>

      <div className="auth-aside-item mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Secure Access
        </p>
        <h1
          ref={titleRef}
          className="font-heading mt-3 text-3xl font-bold leading-tight text-[var(--color-text-primary)]"
        >
          Care that follows you everywhere
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
          One account for pharmacy orders, lab bookings, doctor visits, and
          emergency ambulance support across Bangladesh.
        </p>
      </div>

      <div className="auth-aside-item my-8">
        <AuthIllustration />
      </div>

      <ul className="auth-aside-item space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-[var(--color-primary)]">
              <Icon name="shield-check" className="h-3.5 w-3.5" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </aside>
  );
}
