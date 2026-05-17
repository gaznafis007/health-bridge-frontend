export default function PharmacyLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6 animate-pulse">
        <div className="h-56 rounded-[2rem] bg-sky-100" />
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-11 rounded-full bg-white" />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white">
              <div className="aspect-[4/3] bg-sky-100" />
              <div className="space-y-4 p-5">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-200" />
                <div className="h-8 w-1/3 rounded bg-slate-200" />
                <div className="h-11 rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
