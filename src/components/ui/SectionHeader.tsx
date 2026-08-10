interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  eyebrow?: string;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  eyebrow,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-base leading-7 text-[var(--color-text-secondary)]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
