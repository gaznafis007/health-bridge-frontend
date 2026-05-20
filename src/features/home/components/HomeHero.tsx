import Link from "next/link";

export function HomeHero() {
  return (
    <section className="mesh-bg overflow-hidden">
      <div className="mx-auto grid min-h-[90vh] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative z-10">
          <p className="mb-5 inline-flex rounded-full border border-sky-200 bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] backdrop-blur">
            Bangladesh&apos;s Trusted Healthcare Platform
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
            Your Health, Bridged to the Future
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)]">
            Teleconsultation, online pharmacy, lab tests, and emergency services
            all in one place.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/appointments"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
            >
              Book a Consultation
            </Link>
            <Link
              href="/pharmacy"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--color-secondary)] px-6 py-3 text-sm font-semibold text-[var(--color-secondary)] transition hover:bg-emerald-50"
            >
              Order Medicine
            </Link>
          </div>
        </div>

        <div className="animate-float-gentle relative mx-auto w-full max-w-xl">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-sky-200/35 to-emerald-200/35 blur-3xl" />
          <div className="relative rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_40px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <DoctorIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function DoctorIllustration() {
  return (
    <svg
      viewBox="0 0 640 500"
      className="h-auto w-full"
      role="img"
      aria-label="Doctor on a video call with a patient using a laptop"
    >
      <rect x="52" y="66" width="270" height="184" rx="28" fill="#DFF6FF" />
      <rect x="74" y="90" width="226" height="138" rx="22" fill="#0EA5E9" opacity="0.15" />
      <rect x="104" y="302" width="216" height="128" rx="24" fill="#FFFFFF" />
      <rect x="118" y="318" width="188" height="12" rx="6" fill="#E0F2FE" />
      <rect x="118" y="344" width="156" height="12" rx="6" fill="#E0F2FE" />
      <rect x="118" y="370" width="132" height="12" rx="6" fill="#E0F2FE" />
      <path d="M150 262h94l40 30H110l40-30Z" fill="#0F172A" opacity="0.1" />
      <rect x="360" y="80" width="228" height="310" rx="34" fill="#0F172A" />
      <rect x="377" y="106" width="194" height="262" rx="24" fill="#FFFFFF" />
      <circle cx="474" cy="130" r="8" fill="#E0F2FE" />
      <circle cx="192" cy="152" r="38" fill="#F8C9A3" />
      <path d="M150 196c8-26 32-38 42-38s34 12 42 38v34h-84v-34Z" fill="#10B981" />
      <path d="M170 134c0-24 15-38 33-38 18 0 31 14 31 34-16 4-46 5-64 4Z" fill="#0F172A" />
      <circle cx="473" cy="188" r="44" fill="#F8C9A3" />
      <path d="M420 250c10-34 40-48 53-48s42 14 54 48v78H420v-78Z" fill="#0EA5E9" />
      <path d="M444 169c0-26 15-40 35-40 22 0 34 15 35 39-18 5-51 5-70 1Z" fill="#0F172A" />
      <rect x="446" y="258" width="52" height="70" rx="22" fill="#FFFFFF" opacity="0.94" />
      <path d="M472 270v48M448 294h48" stroke="#0EA5E9" strokeWidth="10" strokeLinecap="round" />
      <circle cx="286" cy="116" r="18" fill="#10B981" opacity="0.22" />
      <circle cx="550" cy="334" r="18" fill="#F59E0B" opacity="0.28" />
      <circle cx="82" cy="324" r="14" fill="#0EA5E9" opacity="0.2" />
    </svg>
  );
}
