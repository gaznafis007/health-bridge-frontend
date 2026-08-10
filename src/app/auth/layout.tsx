import { AuthAsidePanel } from "@/features/auth/components/AuthAsidePanel";
import { AuthIllustration } from "@/features/auth/components/AuthIllustration";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mesh-bg min-h-[calc(100vh-5rem)]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-stretch gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <AuthAsidePanel />

        <div className="flex flex-col items-center justify-center">
          <div className="mb-6 w-full max-w-lg lg:hidden">
            <AuthIllustration />
          </div>
          <div className="surface-card w-full max-w-lg rounded-xl border border-[var(--color-border)] p-8 sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
