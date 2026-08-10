import Link from "next/link";

import { SectionHeader } from "@/components/ui/SectionHeader";

const sections = [
  {
    title: "Information we collect",
    body: [
      "Account details such as your name, email, phone number, and role when you register.",
      "Health-related data you provide when booking appointments, lab tests, pharmacy orders, or ambulance requests.",
      "Usage data including device type, browser, and pages visited to improve service reliability.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "To deliver healthcare services you request and coordinate with verified providers.",
      "To authenticate your account, prevent fraud, and maintain platform security.",
      "To send transactional notifications about bookings, orders, and emergency status updates.",
    ],
  },
  {
    title: "Data sharing",
    body: [
      "We share information only with care providers, labs, pharmacies, or emergency teams involved in your request.",
      "We do not sell personal health information to third parties.",
      "We may disclose data when required by law or to protect the safety of users and the public.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You may request access to or correction of your account information through your profile settings.",
      "You may contact support to ask about data retention or deletion, subject to legal and medical record requirements.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For privacy questions, email support@healthbridge.com or visit our contact page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: August 2026. This policy explains how HealthBridge collects, uses, and protects your information."
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
        <Link href="/terms-of-service" className="font-semibold text-[var(--color-primary)] hover:underline">
          Terms of Service
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
