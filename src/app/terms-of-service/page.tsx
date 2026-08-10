import Link from "next/link";

import { SectionHeader } from "@/components/ui/SectionHeader";

const sections = [
  {
    title: "Acceptance of terms",
    body: [
      "By creating an account or using HealthBridge, you agree to these Terms of Service and our Privacy Policy.",
      "If you do not agree, please do not use the platform.",
    ],
  },
  {
    title: "Eligibility and accounts",
    body: [
      "You must provide accurate registration information and keep your credentials secure.",
      "Doctors must supply valid professional credentials; HealthBridge may verify licenses before activating provider accounts.",
      "You are responsible for all activity under your account.",
    ],
  },
  {
    title: "Healthcare services",
    body: [
      "HealthBridge connects you with third-party providers. We do not replace in-person emergency care when immediate medical attention is required.",
      "For life-threatening emergencies, call local emergency services in addition to using ambulance features when available.",
      "Medical advice delivered through the platform is provided by licensed professionals, not by HealthBridge itself.",
    ],
  },
  {
    title: "Payments and cancellations",
    body: [
      "Fees for appointments, lab tests, pharmacy orders, and ambulance services are displayed before you confirm a booking.",
      "Cancellation and refund rules follow the policy shown at checkout and applicable provider terms.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "Do not misuse the platform, attempt unauthorized access, or submit false medical or identity information.",
      "We may suspend accounts that violate these terms or pose a risk to other users.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "HealthBridge is provided as-is to the extent permitted by law. We are not liable for indirect damages arising from service interruptions or third-party provider actions.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Questions about these terms: support@healthbridge.com.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: August 2026. Please read these terms carefully before using HealthBridge."
      />

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              {section.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {section.body.map((paragraph) => (
                <li
                  key={paragraph}
                  className="text-sm leading-7 text-[var(--color-text-secondary)]"
                >
                  {paragraph}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-[var(--color-text-secondary)]">
        See also{" "}
        <Link href="/privacy-policy" className="font-semibold text-[var(--color-primary)] hover:underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/cookie-policy" className="font-semibold text-[var(--color-primary)] hover:underline">
          Cookie Policy
        </Link>
        .
      </p>
    </article>
  );
}
