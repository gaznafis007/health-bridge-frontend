export default function LabTestsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8 animate-pulse">
        <div className="h-48 rounded-[2rem] bg-sky-100" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-[2rem] border border-[var(--color-border)] bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
