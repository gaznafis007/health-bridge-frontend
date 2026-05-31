"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import type { Prescription, PrescriptionStatus } from "@/lib/appointments/appointments.types";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

const statusVariants: Record<PrescriptionStatus, BadgeVariant> = {
  ACTIVE: "success",
  COMPLETED: "neutral",
  EXPIRED: "warning",
  CANCELLED: "danger",
};

interface PrescriptionCardProps {
  prescription: Prescription;
}

export function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="surface-card rounded-[2rem] border border-[var(--color-border)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PillIcon />
            <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
              Prescription
            </h3>
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Issued {new Date(prescription.issuedAt).toLocaleDateString()}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {prescription.medicines.length} medicine
            {prescription.medicines.length === 1 ? "" : "s"}
            {prescription.expiryDate
              ? ` · Expires ${new Date(prescription.expiryDate).toLocaleDateString()}`
              : ""}
          </p>
        </div>
        <Badge variant={statusVariants[prescription.status]}>
          {prescription.status}
        </Badge>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="mt-4 text-sm font-semibold text-[var(--color-primary)]"
      >
        {expanded ? "Hide medicines" : "Show medicines"}
      </button>

      {expanded ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
                <th className="px-3 py-2 font-semibold">Medicine</th>
                <th className="px-3 py-2 font-semibold">Dosage</th>
                <th className="px-3 py-2 font-semibold">Frequency</th>
                <th className="px-3 py-2 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medicines.map((medicine, index) => (
                <tr key={`${medicine.name}-${index}`} className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">{medicine.name}</td>
                  <td className="px-3 py-2">{medicine.dosage}</td>
                  <td className="px-3 py-2">{medicine.frequency}</td>
                  <td className="px-3 py-2">{medicine.duration ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {prescription.notes ? (
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Notes: {prescription.notes}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function PillIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-primary)]" fill="none" aria-hidden="true">
      <path
        d="m8 16 8-8a4 4 0 1 1 5.6 5.6l-8 8A4 4 0 0 1 8 16Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
