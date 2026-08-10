"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { JourneyStepCard } from "@/features/home/components/JourneyStepCard";
import {
  JourneyMobileStepper,
  JourneyStepper,
  useJourneyStepAnimations,
} from "@/features/home/components/JourneyProgressRail";
import {
  ensureGsap,
  gsap,
  prefersReducedMotion,
  splitWords,
} from "@/lib/animations/gsap";
import { careJourneyCta, careJourneySteps } from "@/lib/content/careJourney";

export function HomeHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useJourneyStepAnimations(sectionRef);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !titleRef.current) return;

    const ctx = gsap.context(() => {
      const words = splitWords(titleRef.current!);
      gsap.from(words, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: "100%",
        opacity: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-white"
      aria-labelledby="care-journey-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,0.06),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(16,185,129,0.05),transparent_35%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Your Care Journey
          </p>
          <h2
            id="care-journey-heading"
            ref={titleRef}
            className="font-heading mt-3 text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl"
          >
            Three moves from search to support
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
            Register, book, and track — every service follows the same clear
            path with real-time visibility at each step.
          </p>
        </div>

        <JourneyStepper steps={careJourneySteps} sectionRef={sectionRef} />
        <JourneyMobileStepper steps={careJourneySteps} />

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-8">
          {careJourneySteps.map((step, index) => (
            <JourneyStepCard key={step.step} step={step} index={index} />
          ))}
        </ol>

        <div className="journey-step-card mt-8 lg:mt-10">
          <article className="relative overflow-hidden rounded-2xl border border-[var(--color-primary)]/25 bg-gradient-to-r from-sky-500 to-emerald-500 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {careJourneyCta.eyebrow}
              </p>
              <p className="font-heading mt-2 text-xl font-bold text-white sm:text-2xl">
                {careJourneyCta.title}
              </p>
            </div>
            <Link
              href={careJourneyCta.href}
              className="relative mt-5 inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-[var(--color-primary)] shadow-lg transition hover:bg-sky-50 sm:mt-0"
            >
              {careJourneyCta.label}
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
