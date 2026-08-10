"use client";

import { useEffect, useRef } from "react";

import {
  animateAurora,
  ensureGsap,
  gsap,
  prefersReducedMotion,
} from "@/lib/animations/gsap";

export function HeroAnimatedOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const blobSkyRef = useRef<HTMLDivElement>(null);
  const blobEmeraldRef = useRef<HTMLDivElement>(null);
  const blobCyanRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      animateAurora([
        { element: blobSkyRef.current!, x: 40, y: -30, duration: 16, delay: 0 },
        { element: blobEmeraldRef.current!, x: -35, y: 25, duration: 18, delay: 2 },
        { element: blobCyanRef.current!, x: 25, y: 35, duration: 14, delay: 4 },
      ]);

      if (shimmerRef.current) {
        gsap.fromTo(
          shimmerRef.current,
          { y: "-100%", opacity: 0 },
          {
            y: "100%",
            opacity: 0.15,
            duration: 8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      }
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={overlayRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/90" />

      <div
        ref={blobSkyRef}
        className="absolute -left-1/4 top-1/4 h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.35),transparent_70%)] blur-3xl"
      />
      <div
        ref={blobEmeraldRef}
        className="absolute -right-1/4 top-1/3 h-[45vh] w-[45vh] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.28),transparent_70%)] blur-3xl"
      />
      <div
        ref={blobCyanRef}
        className="absolute bottom-0 left-1/3 h-[40vh] w-[40vh] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.22),transparent_70%)] blur-3xl"
      />

      <div
        ref={shimmerRef}
        className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-sky-400/20 via-transparent to-transparent opacity-0"
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
