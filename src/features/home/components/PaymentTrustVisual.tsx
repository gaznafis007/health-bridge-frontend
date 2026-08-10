"use client";

import { useEffect, useRef } from "react";

import { Icon } from "@/components/ui/Icon";
import {
  ensureGsap,
  gsap,
  prefersReducedMotion,
} from "@/lib/animations/gsap";

export function PaymentTrustVisual() {
  const ringRef = useRef<SVGCircleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !ringRef.current || !containerRef.current) return;

    const ring = ringRef.current;
    const radius = ring.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference}`;

    const ctx = gsap.context(() => {
      gsap.to(ring, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto h-24 w-24 lg:mx-0">
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="2"
        />
        <circle
          ref={ringRef}
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="url(#paymentRingGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="paymentRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-50 to-emerald-50">
        <Icon name="shield-check" className="h-9 w-9 text-[var(--color-primary)]" />
      </span>
    </div>
  );
}

export function usePaymentBannerAnimations(
  sectionRef: React.RefObject<HTMLElement | null>,
  panelRef: React.RefObject<HTMLDivElement | null>,
  logosRef: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      if (logosRef.current) {
        const tiles = logosRef.current.querySelectorAll<HTMLElement>("[data-payment-tile]");
        gsap.fromTo(
          tiles,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.07,
            ease: "power2.out",
            scrollTrigger: {
              trigger: logosRef.current,
              start: "top 90%",
              once: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, panelRef, logosRef]);
}
