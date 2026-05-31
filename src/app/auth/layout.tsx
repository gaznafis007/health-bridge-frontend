import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mesh-bg min-h-[calc(100vh-5rem)]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-stretch gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <aside className="hidden flex-col justify-between rounded-[2rem] border border-white/70 bg-white/80 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur lg:flex">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-[var(--color-primary)]">
                <LogoMark />
              </span>
              <span className="font-heading text-xl font-bold text-[var(--color-text-primary)]">
                HealthBridge
              </span>
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Secure Access
            </p>
            <h1 className="font-heading mt-4 text-4xl font-bold leading-tight text-[var(--color-text-primary)]">
              Your trusted healthcare account
            </h1>
            <p className="mt-4 max-w-md text-base leading-8 text-[var(--color-text-secondary)]">
              Sign in to book appointments, manage lab tests, request ambulance
              support, and track your care in one place.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[var(--color-border)] bg-sky-50/80 p-6">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              Privacy first
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
              Your session is protected with secure tokens. Refresh credentials
              stay in an httpOnly cookie and never touch browser storage.
            </p>
          </div>
        </aside>

        <div className="flex items-center justify-center">
          <div className="surface-card w-full max-w-lg rounded-[2rem] border border-[var(--color-border)] p-8 sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M8 29c4.2 0 6.8-9 10-9 3 0 4.8 8 7.8 8 2.6 0 3.5-4 6.2-4 3.5 0 4.8 7 8 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 20c0-6.4 5.2-11.5 11.5-11.5 3.1 0 5.9 1.3 7.8 3.3 2-2 4.8-3.3 7.9-3.3 6.3 0 11.4 5.1 11.4 11.5 0 11.4-18.8 18.5-19.3 18.5S9 31.4 9 20Z"
        stroke="currentColor"
        strokeWidth="2.4"
      />
    </svg>
  );
}
