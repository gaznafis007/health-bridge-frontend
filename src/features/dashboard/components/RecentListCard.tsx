import Link from "next/link";

interface RecentListCardProps {
  title: string;
  viewAllHref: string;
  emptyMessage: string;
  children: React.ReactNode;
}

export function RecentListCard({
  title,
  viewAllHref,
  emptyMessage,
  children,
}: RecentListCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          View all
        </Link>
      </div>
      {children ?? (
        <p className="text-sm text-[var(--color-text-secondary)]">{emptyMessage}</p>
      )}
    </section>
  );
}
