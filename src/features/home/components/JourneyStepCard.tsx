import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import type { CareJourneyStep } from "@/lib/content/careJourney";

const accentStyles = {
  sky: {
    border: "border-l-sky-500",
    icon: "bg-sky-50 text-sky-600",
    glow: "from-sky-500/10 to-transparent",
    badge: "text-sky-600 bg-sky-50",
  },
  emerald: {
    border: "border-l-emerald-500",
    icon: "bg-emerald-50 text-emerald-600",
    glow: "from-emerald-500/10 to-transparent",
    badge: "text-emerald-600 bg-emerald-50",
  },
  amber: {
    border: "border-l-amber-500",
    icon: "bg-amber-50 text-amber-600",
    glow: "from-amber-500/10 to-transparent",
    badge: "text-amber-600 bg-amber-50",
  },
} as const;

type JourneyStepCardProps = {
  step: CareJourneyStep;
  index: number;
};

export function JourneyStepCard({ step, index }: JourneyStepCardProps) {
  const accent = accentStyles[step.accent];

  return (
    <li
      data-journey-step
      data-step-index={index}
      className="journey-step-card relative list-none"
    >
      <article
        className={`group relative overflow-hidden rounded-2xl border border-[var(--color-border)] border-l-4 ${accent.border} bg-white p-6 shadow-sm transition-all duration-300`}
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          aria-hidden="true"
        />

        <span
          className="pointer-events-none absolute -right-2 -top-4 font-heading text-7xl font-bold leading-none text-slate-100"
          aria-hidden="true"
        >
          {step.step}
        </span>

        <div className="relative flex items-start justify-between gap-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${accent.badge}`}
          >
            Step {index + 1}
          </span>
          <span
            className={`journey-step-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent.icon}`}
          >
            <Icon name={step.icon} className="h-5 w-5" />
          </span>
        </div>

        <h3 className="relative font-heading mt-5 text-xl font-semibold text-[var(--color-text-primary)]">
          {step.title}
        </h3>
        <p className="relative mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
          {step.description}
        </p>

        <div className="relative mt-6 border-t border-[var(--color-border)] pt-4">
          <Link
            href={step.href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] transition hover:gap-2 hover:text-[var(--color-primary-dark)]"
          >
            {step.cta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    </li>
  );
}
