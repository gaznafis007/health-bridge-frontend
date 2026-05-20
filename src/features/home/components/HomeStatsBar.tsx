const stats = [
  ["10,000+", "Patients Served"],
  ["500+", "Verified Doctors"],
  ["24/7", "Emergency Service"],
  ["100+", "Lab Partners"],
] as const;

export function HomeStatsBar() {
  return (
    <section className="bg-[var(--color-primary)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-white sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map(([value, label]) => (
          <div key={label} className="text-center">
            <p className="font-heading text-4xl font-bold">{value}</p>
            <p className="mt-2 text-sm text-white/80">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
