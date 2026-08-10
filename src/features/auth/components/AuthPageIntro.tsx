"use client";

import { useEffect, useRef } from "react";

import {
  ensureGsap,
  gsap,
  prefersReducedMotion,
  splitWords,
} from "@/lib/animations/gsap";

interface AuthPageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AuthPageIntro({ eyebrow, title, description }: AuthPageIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const titleWords = titleRef.current ? splitWords(titleRef.current) : [];

      gsap.from(".auth-intro-item", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(titleWords, {
        y: "110%",
        opacity: 0,
        duration: 0.7,
        stagger: 0.035,
        ease: "power3.out",
        delay: 0.15,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mb-8">
      <p className="auth-intro-item text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
        {eyebrow}
      </p>
      <h2
        ref={titleRef}
        className="auth-intro-item font-heading mt-3 text-3xl font-bold text-[var(--color-text-primary)]"
      >
        {title}
      </h2>
      <p className="auth-intro-item mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
        {description}
      </p>
    </div>
  );
}
