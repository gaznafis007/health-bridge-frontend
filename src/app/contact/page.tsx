import Link from "next/link";

import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        title="Contact us"
        description="We are here 24/7 for emergency support and business hours for general inquiries."
      />
      <div className="mt-8 space-y-6 rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <div>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            Address
          </h2>
          <p className="mt-2 text-[var(--color-text-primary)]">
            House 11, Road 7, Dhanmondi, Dhaka 1205, Bangladesh
          </p>
        </div>
        <div>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            Phone
          </h2>
          <p className="mt-2">
            <a href="tel:+8801700123456" className="font-semibold text-[var(--color-primary)]">
              +880 1700 123456
            </a>
          </p>
        </div>
        <div>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            Email
          </h2>
          <p className="mt-2">
            <a
              href="mailto:support@healthbridge.com"
              className="font-semibold text-[var(--color-primary)]"
            >
              support@healthbridge.com
            </a>
          </p>
        </div>
        <div>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            Emergency
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            For ambulance emergencies, use the{" "}
            <Link href="/ambulance/request" className="font-semibold text-[var(--color-primary)]">
              ambulance request
            </Link>{" "}
            flow or call our hotline immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
