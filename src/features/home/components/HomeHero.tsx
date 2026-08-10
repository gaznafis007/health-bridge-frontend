"use client";

import { useEffect, useRef } from "react";

import { HomeHeroActions } from "@/features/home/components/HomeHeroActions";
import { HeroAnimatedOverlay } from "@/features/home/components/HeroAnimatedOverlay";
import {
  ensureGsap,
  gsap,
  prefersReducedMotion,
  splitWords,
} from "@/lib/animations/gsap";
import { heroVideo } from "@/lib/content/images";

const quickLinks = [
  { label: "Pharmacy", href: "/pharmacy" },
  { label: "Lab Tests", href: "/lab-tests" },
  { label: "Ambulance", href: "/ambulance" },
  { label: "Appointments", href: "/appointments" },
];

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const titleAccentRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const titleWords = titleRef.current ? splitWords(titleRef.current) : [];

      gsap.from(badgeRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(titleWords, {
        y: "110%",
        opacity: 0,
        duration: 0.9,
        stagger: 0.04,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(titleAccentRef.current, {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.35,
      });

      gsap.from(subtitleRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.45,
      });

      gsap.from(actionsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.65,
      });

      gsap.from(chipsRef.current?.children ?? [], {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.85,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-[var(--nav-height)] flex min-h-[100dvh] items-center justify-center overflow-hidden"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={heroVideo.poster}
        aria-hidden="true"
      >
        <source src={heroVideo.src} type="video/mp4" />
      </video>

      <HeroAnimatedOverlay />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 pt-[calc(var(--nav-height)+3rem)] text-center sm:px-6 lg:px-8 lg:pt-[calc(var(--nav-height)+2rem)]">
        <p
          ref={badgeRef}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-secondary)]" />
          Bangladesh&apos;s Trusted Healthcare Platform
        </p>

        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.08]">
          <span ref={titleRef} className="block">
            Your Health,
          </span>
          <span
            ref={titleAccentRef}
            className="mt-1 block bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent"
          >
            Bridged to the Future
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85"
        >
          Teleconsultation, online pharmacy, lab tests, and emergency services —
          one platform connecting you to verified care across Bangladesh.
        </p>

        <div ref={actionsRef} className="mt-8 flex justify-center">
          <HomeHeroActions variant="hero" />
        </div>

        <div
          ref={chipsRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/30"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
