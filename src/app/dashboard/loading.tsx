export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-10 w-64 rounded-xl bg-slate-200" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-48 rounded-2xl bg-slate-200" />
        <div className="h-48 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
