interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="surface-card rounded-xl p-5">
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl font-bold text-[var(--color-text-primary)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{hint}</p>
      ) : null}
    </article>
  );
}
