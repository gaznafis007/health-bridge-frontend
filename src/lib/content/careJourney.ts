import type { IconName } from "@/components/ui/Icon";

export type CareJourneyStep = {
  step: string;
  title: string;
  description: string;
  icon: IconName;
  href: string;
  cta: string;
  accent: "sky" | "emerald" | "amber";
};

export const careJourneySteps: CareJourneyStep[] = [
  {
    step: "01",
    title: "Choose your path",
    description:
      "Register securely or browse as a guest for pharmacy and emergency services.",
    icon: "user",
    href: "/auth/register",
    cta: "Create account",
    accent: "sky",
  },
  {
    step: "02",
    title: "Book in guided steps",
    description:
      "Appointments, medicines, lab tests, or ambulance — each flow stays clear and fast.",
    icon: "calendar",
    href: "/services",
    cta: "Explore services",
    accent: "emerald",
  },
  {
    step: "03",
    title: "Track to completion",
    description:
      "Live status, reports, deliveries, and prescriptions — all visible in one place.",
    icon: "heart-pulse",
    href: "/appointments/history",
    cta: "View history",
    accent: "amber",
  },
];

export const careJourneyCta = {
  eyebrow: "Ready when you are",
  title: "Start your care journey today",
  href: "/auth/register",
  label: "Get started free",
} as const;
