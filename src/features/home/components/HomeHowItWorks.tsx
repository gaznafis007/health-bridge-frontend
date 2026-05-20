const steps = [
  ["1", "Register or Browse as Guest", "Start with an account or jump straight into care and shopping.", "user"],
  ["2", "Book, Order, or Request", "Choose appointments, medicines, tests, or urgent support in minutes.", "calendar"],
  ["3", "Get Cared For", "Receive treatment, delivery, reports, and updates without the usual friction.", "heart"],
] as const;

export function HomeHowItWorks() {
  return (
    <section className="bg-white/70 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Simple Flow
          </p>
          <h2 className="font-heading mt-4 text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
            How HealthBridge Works
          </h2>
        </div>

        <div className="relative mt-14 grid gap-8 lg:grid-cols-3">
          <div className="absolute left-1/2 top-12 hidden h-0.5 w-[58%] -translate-x-1/2 bg-gradient-to-r from-sky-200 via-sky-400 to-emerald-300 lg:block" />
          {steps.map(([step, title, description, icon]) => (
            <article
              key={step}
              className="surface-card relative rounded-[2rem] border border-[var(--color-border)] p-8"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)]">
                <StepIcon type={icon} />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
                Step {step}
              </p>
              <h3 className="font-heading mt-4 text-2xl font-semibold text-[var(--color-text-primary)]">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepIcon({ type }: { type: string }) {
  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M7 3v4M17 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "heart") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
