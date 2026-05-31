import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        title="About HealthBridge"
        description="Bridging patients to trusted care across Bangladesh."
      />
      <div className="prose prose-slate mt-8 max-w-none space-y-4 text-[var(--color-text-secondary)]">
        <p>
          HealthBridge is a digital healthcare platform that connects patients with
          pharmacy delivery, diagnostic lab testing, in-person appointments, and
          emergency ambulance services.
        </p>
        <p>
          We work with verified doctors, diagnostic centers, and emergency response
          teams to make healthcare accessible, transparent, and responsive — whether
          you are managing a chronic condition or facing an urgent situation.
        </p>
        <p>
          Our mission is simple: your health, bridged to the future — with secure
          accounts, role-based access for care teams, and clear status tracking at
          every step.
        </p>
      </div>
    </div>
  );
}
