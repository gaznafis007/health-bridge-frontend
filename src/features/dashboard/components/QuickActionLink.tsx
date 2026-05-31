import Link from "next/link";

interface QuickActionLinkProps {
  href: string;
  label: string;
}

export function QuickActionLink({ href, label }: QuickActionLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-sky-50"
    >
      {label}
    </Link>
  );
}
