"use client";

import { useEffect, useState } from "react";

interface PharmacyHeroProps {
  initialSearch?: string;
  onSearchChange: (value: string) => void;
}

export function PharmacyHero({
  initialSearch = "",
  onSearchChange,
}: PharmacyHeroProps) {
  const [searchValue, setSearchValue] = useState(initialSearch);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearchChange(searchValue.trim());
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onSearchChange, searchValue]);

  return (
    <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-500 via-sky-400 to-cyan-400 px-6 py-8 text-white shadow-[0_30px_60px_rgba(14,165,233,0.28)] sm:px-8 lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/75">
          Guest Pharmacy
        </p>
        <h1 className="font-heading mt-3 text-3xl font-bold sm:text-4xl">
          Order Medicine Anytime — No Account Needed
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">
          Search from hundreds of medicines. Delivered to your door with trusted
          care and secure checkout.
        </p>
      </div>

      <div className="mt-8 lg:mt-0">
        <label htmlFor="pharmacy-search" className="sr-only">
          Search medicines, brands, or generics
        </label>
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-4 text-[var(--color-text-primary)] shadow-[0_20px_35px_rgba(15,23,42,0.15)]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-primary)]" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            id="pharmacy-search"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search medicines, brands, generics..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/75">
          {["Secure checkout", "Fast delivery", "Genuine medicines"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
