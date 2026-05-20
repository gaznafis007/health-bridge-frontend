export function HomePaymentsBanner() {
  const methods = ["SSLCommerz", "bKash", "Nagad", "Visa", "Mastercard", "Cash on Delivery"];

  return (
    <section className="border-t border-[var(--color-border)] bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-[var(--color-primary)]">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
              <path d="M12 3 5 6v5c0 4.6 2.9 8.9 7 10 4.1-1.1 7-5.4 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="m9.5 12 1.7 1.7 3.3-3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Secure Payments Accepted
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Flexible payment options for guest and registered users.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {methods.map((method) => (
            <span
              key={method}
              className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] shadow-sm"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
