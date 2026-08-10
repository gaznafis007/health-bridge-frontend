"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsap() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function splitWords(element: HTMLElement) {
  const words = (element.textContent ?? "").trim().split(/\s+/);
  element.innerHTML = words
    .map(
      (word) =>
        `<span class="gsap-word inline-block overflow-hidden align-top"><span class="gsap-word-inner inline-block">${word}&nbsp;</span></span>`,
    )
    .join("");
  return element.querySelectorAll<HTMLElement>(".gsap-word-inner");
}

export function splitLines(element: HTMLElement) {
  const text = element.textContent ?? "";
  element.innerHTML = `<span class="gsap-line inline-block overflow-hidden align-top"><span class="gsap-line-inner inline-block">${text}</span></span>`;
  return element.querySelectorAll<HTMLElement>(".gsap-line-inner");
}

type AuroraBlob = {
  element: HTMLElement;
  x?: number;
  y?: number;
  duration?: number;
  delay?: number;
};

export function animateAurora(blobs: AuroraBlob[]) {
  blobs.forEach(({ element, x = 30, y = 40, duration = 14, delay = 0 }) => {
    gsap.to(element, {
      x,
      y,
      duration,
      delay,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });
}

export function drawSvgPath(
  path: SVGPathElement,
  options: {
    trigger: Element;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  },
) {
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;

  return gsap.to(path, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: options.trigger,
      start: options.start ?? "top 70%",
      end: options.end ?? "bottom 30%",
      scrub: options.scrub ?? true,
    },
  });
}

export { gsap, ScrollTrigger };
