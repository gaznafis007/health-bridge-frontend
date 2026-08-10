export function AuthIllustration() {
  return (
    <div className="auth-illustration relative mx-auto w-full max-w-md">
      <div className="auth-illustration-glow absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-200/40 to-emerald-200/30 blur-2xl" />
      <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
        <svg
          viewBox="0 0 640 500"
          className="auth-illustration-svg h-auto w-full"
          role="img"
          aria-label="Healthcare professionals connecting patients to care digitally"
        >
          <rect x="52" y="66" width="270" height="184" rx="20" fill="#E0F2FE" />
          <rect x="74" y="90" width="226" height="138" rx="16" fill="#0e7490" opacity="0.12" />
          <rect x="104" y="302" width="216" height="128" rx="18" fill="#FFFFFF" />
          <rect x="118" y="318" width="188" height="12" rx="6" fill="#E2E8F0" className="auth-bar auth-bar-1" />
          <rect x="118" y="344" width="156" height="12" rx="6" fill="#E2E8F0" className="auth-bar auth-bar-2" />
          <rect x="118" y="370" width="132" height="12" rx="6" fill="#E2E8F0" className="auth-bar auth-bar-3" />
          <path d="M150 262h94l40 30H110l40-30Z" fill="#0F172A" opacity="0.08" />
          <rect x="360" y="80" width="228" height="310" rx="24" fill="#155e75" />
          <rect x="377" y="106" width="194" height="262" rx="18" fill="#FFFFFF" />
          <circle cx="474" cy="130" r="8" fill="#E0F2FE" className="auth-pulse-dot" />
          <circle cx="192" cy="152" r="38" fill="#F8C9A3" />
          <path d="M150 196c8-26 32-38 42-38s34 12 42 38v34h-84v-34Z" fill="#047857" />
          <path d="M170 134c0-24 15-38 33-38 18 0 31 14 31 34-16 4-46 5-64 4Z" fill="#0F172A" />
          <circle cx="473" cy="188" r="44" fill="#F8C9A3" />
          <path d="M420 250c10-34 40-48 53-48s42 14 54 48v78H420v-78Z" fill="#0e7490" />
          <path d="M444 169c0-26 15-40 35-40 22 0 34 15 35 39-18 5-51 5-70 1Z" fill="#0F172A" />
          <rect x="446" y="258" width="52" height="70" rx="18" fill="#FFFFFF" opacity="0.94" />
          <path
            d="M472 270v48M448 294h48"
            stroke="#0e7490"
            strokeWidth="10"
            strokeLinecap="round"
            className="auth-plus-mark"
          />
          <circle cx="286" cy="116" r="18" fill="#047857" opacity="0.2" className="auth-float auth-float-1" />
          <circle cx="550" cy="334" r="18" fill="#d97706" opacity="0.22" className="auth-float auth-float-2" />
          <circle cx="82" cy="324" r="14" fill="#0e7490" opacity="0.18" className="auth-float auth-float-3" />
        </svg>
      </div>
    </div>
  );
}
