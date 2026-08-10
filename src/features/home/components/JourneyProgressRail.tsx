"use client";

import { useEffect, useRef } from "react";

import {
  ensureGsap,
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
} from "@/lib/animations/gsap";
import type { CareJourneyStep } from "@/lib/content/careJourney";

type JourneyStepperProps = {
  steps: CareJourneyStep[];
  sectionRef: React.RefObject<HTMLElement | null>;
};

export function JourneyStepper({ steps, sectionRef }: JourneyStepperProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !sectionRef.current || !fillRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: true,
          },
        },
      );
    }, trackRef);

    return () => ctx.revert();
  }, [sectionRef, steps.length]);

  return (
    <div ref={trackRef} className="mt-10 hidden lg:block" aria-hidden="true">
      <div className="relative flex items-center justify-between">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--color-border)]" />
        <div
          ref={fillRef}
          className="absolute left-0 top-1/2 h-0.5 w-full origin-left -translate-y-1/2 bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500"
          style={{ transform: "scaleX(0)" }}
        />
        {steps.map((step, index) => (
          <div key={step.step} className="relative z-10 flex flex-col items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white font-heading text-sm font-bold text-[var(--color-text-primary)] shadow-md ring-2 ring-[var(--color-border)]">
              {step.step}
            </span>
            <span className="max-w-[7rem] text-center text-xs font-medium text-[var(--color-text-muted)]">
              {index === 0 ? "Register" : index === 1 ? "Book" : "Track"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JourneyMobileStepper({ steps }: { steps: CareJourneyStep[] }) {
  return (
    <ol className="mt-8 flex items-center justify-center gap-2 lg:hidden" aria-label="Care journey steps">
      {steps.map((step, index) => (
        <li key={step.step} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[var(--color-primary)] shadow-sm ring-1 ring-[var(--color-border)]">
            {step.step}
          </span>
          {index < steps.length - 1 ? (
            <span className="h-px w-6 bg-[var(--color-border)]" aria-hidden="true" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function useJourneyStepAnimations(sectionRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll<HTMLElement>("[data-journey-step]");

      cards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          y: 36,
          opacity: 0,
          duration: 0.7,
          delay: index * 0.08,
          ease: "power3.out",
        });

        ScrollTrigger.create({
          trigger: card,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () => card.classList.add("is-active"),
          onLeave: () => card.classList.remove("is-active"),
          onEnterBack: () => card.classList.add("is-active"),
          onLeaveBack: () => card.classList.remove("is-active"),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);
}
