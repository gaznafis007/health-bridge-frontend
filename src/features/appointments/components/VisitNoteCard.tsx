import type { VisitNote } from "@/lib/appointments/appointments.types";

interface VisitNoteCardProps {
  visitNote: VisitNote | null;
}

export function VisitNoteCard({ visitNote }: VisitNoteCardProps) {
  if (!visitNote) {
    return (
      <article className="surface-card rounded-[2rem] border border-[var(--color-border)] p-6">
        <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
          Visit note
        </h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          No visit note recorded for this appointment.
        </p>
      </article>
    );
  }

  return (
    <article className="surface-card space-y-4 rounded-[2rem] border border-[var(--color-border)] p-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
          Visit note
        </h3>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          Recorded {new Date(visitNote.createdAt).toLocaleString()}
        </p>
      </div>

      {visitNote.diagnosis ? (
        <Section title="Diagnosis" content={visitNote.diagnosis} />
      ) : null}
      {visitNote.treatmentPlan ? (
        <Section title="Treatment plan" content={visitNote.treatmentPlan} />
      ) : null}
      {visitNote.notes ? (
        <Section title="Notes" content={visitNote.notes} />
      ) : null}
    </article>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        {title}
      </h4>
      <p className="mt-2 text-sm leading-7 text-[var(--color-text-primary)]">
        {content}
      </p>
    </div>
  );
}
