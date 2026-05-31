export default function AmbulanceLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8 animate-pulse">
        <div className="h-56 rounded-[2rem] bg-red-50" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 rounded-[2rem] border border-[var(--color-border)] bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
