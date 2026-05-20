import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="surface-card flex flex-col items-center rounded-[2rem] border border-[var(--color-border)] px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-sky-100 p-4 text-[var(--color-primary)]">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-sm text-[var(--color-text-secondary)]">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
