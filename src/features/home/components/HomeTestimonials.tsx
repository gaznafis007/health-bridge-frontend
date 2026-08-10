"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { testimonialAvatars } from "@/lib/content/images";

const testimonials = [
  {
    name: "Raisa K.",
    city: "Dhaka",
    quote: "Booked my doctor appointment in minutes. No waiting in line!",
    role: "Patient",
  },
  {
    name: "Tanvir H.",
    city: "Chattogram",
    quote: "The pharmacy delivery was fast and the medicines were genuine.",
    role: "Patient",
  },
  {
    name: "Sumaiya A.",
    city: "Sylhet",
    quote: "Lab test at home was so convenient. Got my report online same day.",
    role: "Patient",
  },
  {
    name: "Dr. Imran S.",
    city: "Dhaka",
    quote: "Managing appointments and prescriptions through one dashboard saves hours every week.",
    role: "Doctor",
  },
  {
    name: "Farhana M.",
    city: "Rajshahi",
    quote: "Ambulance tracking gave our family peace of mind during an emergency.",
    role: "Patient",
  },
] as const;

function TestimonialCard({
  testimonial,
  avatarIndex,
}: {
  testimonial: (typeof testimonials)[number];
  avatarIndex: number;
}) {
  const avatar = testimonialAvatars[avatarIndex % testimonialAvatars.length];

  return (
    <article className="testimonial-card mx-3 w-[20rem] shrink-0 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-0.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <Icon
              key={starIndex}
              name="star"
              className="h-4 w-4 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
        <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          {testimonial.role}
        </span>
      </div>
      <blockquote className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
        <Image
          src={avatar.src}
          alt={avatar.alt}
          width={avatar.width}
          height={avatar.height}
          className="h-11 w-11 rounded-full object-cover ring-2 ring-sky-100"
        />
        <div>
          <p className="font-semibold text-[var(--color-text-primary)]">
            {testimonial.name}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">{testimonial.city}</p>
        </div>
      </div>
    </article>
  );
}

export function HomeTestimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const loop = [...testimonials, ...testimonials];

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !trackRef.current) return;

    const track = trackRef.current;
    const half = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -half,
      duration: 38,
      ease: "none",
      repeat: -1,
    });

    const onEnter = () => gsap.to(tween, { timeScale: 0.35, duration: 0.4 });
    const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.4 });

    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);

    return () => {
      tween.kill();
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="section-padding overflow-hidden bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Testimonials"
          title="What Our Patients Say"
          description="Real experiences from patients and doctors across Bangladesh."
        />
      </div>

      <div className="relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-50/95 to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-50/95 to-transparent sm:w-24" />

        <div ref={trackRef} className="flex w-max py-2 will-change-transform">
          {loop.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-${index}`}
              testimonial={testimonial}
              avatarIndex={index % testimonialAvatars.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
