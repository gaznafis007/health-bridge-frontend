const testimonials = [
  ["Raisa K.", "Dhaka", "Booked my doctor appointment in minutes. No waiting in line!"],
  ["Tanvir H.", "Chattogram", "The pharmacy delivery was fast and the medicines were genuine."],
  ["Sumaiya A.", "Sylhet", "Lab test at home was so convenient. Got my report online same day."],
] as const;

export function HomeTestimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
          Testimonials
        </p>
        <h2 className="font-heading mt-4 text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
          What Our Patients Say
        </h2>
      </div>

      <div className="hide-scrollbar mt-12 flex gap-6 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {testimonials.map(([name, city, quote]) => (
          <article
            key={name}
            className="surface-card min-w-[18rem] flex-1 rounded-[2rem] border border-white/70 p-7"
          >
            <p className="text-lg text-amber-400" aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <blockquote className="mt-5 text-base italic leading-8 text-[var(--color-text-secondary)]">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <div className="mt-7 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] font-semibold text-white">
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">{name}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{city}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
