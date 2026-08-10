import Link from "next/link";

import { SectionHeader } from "@/components/ui/SectionHeader";

const sections = [
  {
    title: "What are cookies?",
    body: [
      "Cookies are small text files stored on your device when you visit HealthBridge. They help us keep you signed in, remember preferences, and understand how the site is used.",
    ],
  },
  {
    title: "Cookies we use",
    body: [
      "Essential cookies — required for authentication, security, and core booking flows.",
      "Preference cookies — remember settings such as language or notification choices where supported.",
      "Analytics cookies — help us measure page performance and fix errors (aggregated, not sold).",
    ],
  },
  {
    title: "Managing cookies",
    body: [
      "You can control or delete cookies through your browser settings. Blocking essential cookies may prevent sign-in or checkout from working correctly.",
      "If we add a consent banner for non-essential cookies in your region, you will be able to opt in or out at that time.",
    ],
  },
  {
    title: "Third-party cookies",
    body: [
      "Payment or map providers used during checkout or ambulance tracking may set their own cookies subject to their policies.",
    ],
  },
  {
    title: "Updates",
    body: [
      "We may update this Cookie Policy when our tooling changes. Material updates will be reflected on this page with a revised date.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Questions: support@healthbridge.com or our contact page.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Legal"
        title="Cookie Policy"
        description="Last updated: August 2026. How HealthBridge uses cookies and similar technologies."
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
        <Link href="/terms-of-service" className="font-semibold text-[var(--color-primary)] hover:underline">
          Terms of Service
        </Link>
        .
      </p>
    </article>
  );
}
