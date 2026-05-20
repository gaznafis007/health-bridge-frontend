const services = [
  ["Video Consultation", "Talk to a doctor from anywhere", "video"],
  ["Online Pharmacy", "Order medicine, no login needed", "pill"],
  ["Lab Tests", "Book home sample collection, get reports online", "flask"],
  ["Ambulance Booking", "Emergency dispatch with live tracking", "ambulance"],
  ["Health Records", "Your complete medical history in one place", "file"],
  ["Secure Messaging", "Chat with your doctor anytime", "message"],
] as const;

export function HomeServices() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
          Services
        </p>
        <h2 className="font-heading mt-4 text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
          Everything Healthcare, One Platform
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map(([title, description, icon]) => (
          <article
            key={title}
            className="surface-card group rounded-[2rem] border border-[var(--color-border)] p-7 transition duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[0_24px_50px_rgba(14,165,233,0.16)]"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-[var(--color-primary)]">
              <ServiceIcon type={icon} />
            </div>
            <h3 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              {description}
            </p>
            <p className="mt-6 text-sm font-semibold text-[var(--color-primary)]">
              Learn more -&gt;
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceIcon({ type }: { type: string }) {
  const shared = {
    className: "h-7 w-7",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };

  switch (type) {
    case "video":
      return (
        <svg {...shared}>
          <path
            d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m16 10 4-2v8l-4-2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "pill":
      return (
        <svg {...shared}>
          <path
            d="m8 16 8-8a4 4 0 1 1 5.6 5.6l-8 8A4 4 0 0 1 8 16Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m10 6 8 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "flask":
      return (
        <svg {...shared}>
          <path
            d="M10 3v5l-5.5 8.5A3 3 0 0 0 7 21h10a3 3 0 0 0 2.5-4.5L14 8V3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M8 14h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "ambulance":
      return (
        <svg {...shared}>
          <path d="M3 14V8a2 2 0 0 1 2-2h8v8H3Z" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M13 10h3l3 3v1h2v3h-2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M8 9h3M9.5 7.5v3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "file":
      return (
        <svg {...shared}>
          <path
            d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M14 3v5h5M8 13h8M8 17h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...shared}>
          <path
            d="M5 19V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 11h8M8 15h5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M5 19h14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
